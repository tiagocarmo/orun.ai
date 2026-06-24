import { db } from "@/lib/db";
import { executeAgent } from "@/lib/agents";
import {
  WorkflowStepDefinition,
  WorkflowContext,
  WorkflowRunStatus,
  WorkflowRunResult,
} from "./types";
import {
  createStepLog,
  completeStepLog,
  failStepLog,
  skipStepLog,
  serializeStepLogs,
  deserializeStepLogs,
} from "./logger";

function parseSteps(stepsJson: string): WorkflowStepDefinition[] {
  try {
    return JSON.parse(stepsJson) as WorkflowStepDefinition[];
  } catch {
    throw new Error("Invalid workflow steps JSON");
  }
}

function resolveInput(
  mapping: Record<string, string>,
  context: WorkflowContext
): Record<string, unknown> {
  const resolved: Record<string, unknown> = {};

  for (const [key, template] of Object.entries(mapping)) {
    if (typeof template === "string" && template.startsWith("$input.")) {
      const field = template.slice(7);
      resolved[key] = context.input[field];
    } else if (typeof template === "string" && template.startsWith("$previous.")) {
      const field = template.slice(10);
      resolved[key] = context.previous?.[field];
    } else if (typeof template === "string" && template.startsWith("$context.")) {
      const field = template.slice(9);
      const lastStep = context.steps[context.steps.length - 1];
      resolved[key] = lastStep?.output?.[field];
    } else {
      resolved[key] = template;
    }
  }

  return resolved;
}

function checkCondition(
  condition: string | undefined,
  context: WorkflowContext
): boolean {
  if (!condition) return true;

  if (condition.startsWith("$previous.")) {
    const field = condition.slice(10);
    return !!context.previous?.[field];
  }

  if (condition.startsWith("!$previous.")) {
    const field = condition.slice(11);
    return !context.previous?.[field];
  }

  return true;
}

export async function startWorkflow(
  workflowId: string,
  input: Record<string, unknown>
): Promise<WorkflowRunResult> {
  const workflow = await db.workflow.findUnique({ where: { id: workflowId } });
  if (!workflow) {
    throw new Error(`Workflow '${workflowId}' not found`);
  }

  if (!workflow.isActive) {
    throw new Error(`Workflow '${workflowId}' is not active`);
  }

  const steps = parseSteps(workflow.steps);

  const run = await db.workflowRun.create({
    data: {
      workflowId,
      status: "running",
      input: JSON.stringify(input),
      startedAt: new Date(),
      context: serializeStepLogs([]),
    },
  });

  const context: WorkflowContext = {
    input,
    steps: [],
  };

  const result = await executeSteps(run.id, steps, context);

  await db.workflowRun.update({
    where: { id: run.id },
    data: {
      status: result.status,
      output: result.output ? JSON.stringify(result.output) : null,
      error: result.error ?? null,
      context: serializeStepLogs(result.stepLogs),
      completedAt: new Date(),
    },
  });

  return { ...result, runId: run.id };
}

async function executeSteps(
  runId: string,
  steps: WorkflowStepDefinition[],
  context: WorkflowContext
): Promise<WorkflowRunResult> {
  for (const step of steps) {
    const run = await db.workflowRun.findUnique({ where: { id: runId } });
    if (!run) {
      throw new Error(`WorkflowRun '${runId}' not found`);
    }

    if (run.status === "paused") {
      return {
        runId,
        status: "paused",
        stepLogs: context.steps,
      };
    }

    if (run.status === "cancelled") {
      return {
        runId,
        status: "cancelled",
        stepLogs: context.steps,
      };
    }

    if (!checkCondition(step.condition, context)) {
      const skippedLog = skipStepLog(createStepLog(step.id, step.agentSlug, {}));
      context.steps.push(skippedLog);
      continue;
    }

    const stepInput = resolveInput(step.inputMapping, context);
    const stepLog = createStepLog(step.id, step.agentSlug, stepInput);
    context.steps.push(stepLog);

    try {
      const { result } = await executeAgent(step.agentSlug, stepInput);

      if (result.status === "completed") {
        const completedLog = completeStepLog(stepLog, result.output ?? {});
        context.steps[context.steps.length - 1] = completedLog;
        context.previous = result.output ?? {};
      } else {
        const failedLog = failStepLog(stepLog, result.error ?? "Agent execution failed");
        context.steps[context.steps.length - 1] = failedLog;

        await db.workflowRun.update({
          where: { id: runId },
          data: {
            status: "failed",
            error: result.error ?? "Step execution failed",
            context: serializeStepLogs(context.steps),
          },
        });

        return {
          runId,
          status: "failed",
          error: result.error ?? "Step execution failed",
          stepLogs: context.steps,
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const failedLog = failStepLog(stepLog, errorMessage);
      context.steps[context.steps.length - 1] = failedLog;

      await db.workflowRun.update({
        where: { id: runId },
        data: {
          status: "failed",
          error: errorMessage,
          context: serializeStepLogs(context.steps),
        },
      });

      return {
        runId,
        status: "failed",
        error: errorMessage,
        stepLogs: context.steps,
      };
    }
  }

  const lastStep = context.steps[context.steps.length - 1];
  return {
    runId,
    status: "completed",
    output: lastStep?.output ?? {},
    stepLogs: context.steps,
  };
}

export async function pauseWorkflow(runId: string): Promise<void> {
  const run = await db.workflowRun.findUnique({ where: { id: runId } });
  if (!run) {
    throw new Error(`WorkflowRun '${runId}' not found`);
  }

  if (run.status !== "running") {
    throw new Error(`Cannot pause workflow in status '${run.status}'`);
  }

  await db.workflowRun.update({
    where: { id: runId },
    data: { status: "paused" },
  });
}

export async function resumeWorkflow(runId: string): Promise<WorkflowRunResult> {
  const run = await db.workflowRun.findUnique({ where: { id: runId } });
  if (!run) {
    throw new Error(`WorkflowRun '${runId}' not found`);
  }

  if (run.status !== "paused") {
    throw new Error(`Cannot resume workflow in status '${run.status}'`);
  }

  const workflow = await db.workflow.findUnique({ where: { id: run.workflowId } });
  if (!workflow) {
    throw new Error(`Workflow '${run.workflowId}' not found`);
  }

  const steps = parseSteps(workflow.steps);
  const stepLogs = deserializeStepLogs(run.context);
  const input = run.input ? JSON.parse(run.input) as Record<string, unknown> : {};

  const completedStepIds = new Set(stepLogs.filter((l) => l.status === "completed").map((l) => l.stepId));
  const skippedStepIds = new Set(stepLogs.filter((l) => l.status === "skipped").map((l) => l.stepId));
  const remainingSteps = steps.filter((s) => !completedStepIds.has(s.id) && !skippedStepIds.has(s.id));

  const context: WorkflowContext = {
    input,
    previous: stepLogs.filter((l) => l.status === "completed").pop()?.output,
    steps: stepLogs,
  };

  await db.workflowRun.update({
    where: { id: runId },
    data: { status: "running" },
  });

  const result = await executeSteps(runId, remainingSteps, context);

  await db.workflowRun.update({
    where: { id: runId },
    data: {
      status: result.status,
      output: result.output ? JSON.stringify(result.output) : null,
      error: result.error ?? null,
      context: serializeStepLogs(result.stepLogs),
      completedAt: new Date(),
    },
  });

  return { ...result, runId };
}

export async function cancelWorkflow(runId: string): Promise<void> {
  const run = await db.workflowRun.findUnique({ where: { id: runId } });
  if (!run) {
    throw new Error(`WorkflowRun '${runId}' not found`);
  }

  if (run.status === "completed" || run.status === "failed" || run.status === "cancelled") {
    throw new Error(`Cannot cancel workflow in status '${run.status}'`);
  }

  await db.workflowRun.update({
    where: { id: runId },
    data: { status: "cancelled" },
  });
}

export async function getWorkflowRun(runId: string): Promise<WorkflowRunResult | null> {
  const run = await db.workflowRun.findUnique({ where: { id: runId } });
  if (!run) return null;

  return {
    runId: run.id,
    status: run.status as WorkflowRunStatus,
    output: run.output ? JSON.parse(run.output) as Record<string, unknown> : undefined,
    error: run.error ?? undefined,
    stepLogs: deserializeStepLogs(run.context),
  };
}

export { deserializeStepLogs, serializeStepLogs };
