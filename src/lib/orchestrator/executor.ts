import { executeAgent } from "@/lib/agents";
import { OrchestratorPlan, OrchestratorStep, StepResult, ExecutionContext } from "./types";
import { resolveInput, addStepResult, setAgentContext } from "./context";

export async function executePlan(
  plan: OrchestratorPlan,
  context: ExecutionContext
): Promise<{ context: ExecutionContext; stepResults: StepResult[] }> {
  let currentContext = context;
  const stepResults: StepResult[] = [];

  for (const step of plan.steps) {
    const dependencyMet = checkDependencies(step, currentContext);

    if (!dependencyMet && step.required) {
      const skippedResult: StepResult = {
        stepId: step.id,
        status: "skipped",
        input: {},
        error: "Dependency not met",
      };
      stepResults.push(skippedResult);
      currentContext = addStepResult(currentContext, step.id, skippedResult);
      continue;
    }

    if (!dependencyMet) {
      continue;
    }

    const result = await executeStep(step, currentContext);
    stepResults.push(result);
    currentContext = addStepResult(currentContext, step.id, result);

    if (result.status === "completed" && result.output) {
      currentContext = setAgentContext(currentContext, step.agentSlug, result.output);
    }

    if (result.status === "failed" && step.required) {
      break;
    }
  }

  return { context: currentContext, stepResults };
}

function checkDependencies(
  step: OrchestratorStep,
  context: ExecutionContext
): boolean {
  if (!step.dependsOn || step.dependsOn.length === 0) {
    return true;
  }

  return step.dependsOn.every((depId) => {
    const depResult = context.stepResults.get(depId);
    return depResult?.status === "completed";
  });
}

export async function executeStep(
  step: OrchestratorStep,
  context: ExecutionContext
): Promise<StepResult> {
  const input = resolveInput(step.inputMapping, context);

  const startTime = Date.now();

  try {
    const { runId, result } = await executeAgent(step.agentSlug, input);

    return {
      stepId: step.id,
      status: result.status === "completed" ? "completed" : "failed",
      input,
      output: result.output,
      error: result.error,
      agentRunId: runId,
      durationMs: Date.now() - startTime,
    };
  } catch (error) {
    return {
      stepId: step.id,
      status: "failed",
      input,
      error: error instanceof Error ? error.message : String(error),
      durationMs: Date.now() - startTime,
    };
  }
}
