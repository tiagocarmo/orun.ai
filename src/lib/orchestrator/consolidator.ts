import { OrchestratorPlan, StepResult, OrchestratorResult } from "./types";

export function consolidateResults(
  plan: OrchestratorPlan,
  stepResults: StepResult[],
  totalDurationMs: number
): OrchestratorResult {
  const completedSteps = stepResults.filter((r) => r.status === "completed");
  const failedSteps = stepResults.filter((r) => r.status === "failed");
  const skippedSteps = stepResults.filter((r) => r.status === "skipped");

  const output = mergeOutputs(completedSteps);
  const errors = failedSteps.map((r) => r.error ?? "Unknown error");
  const status = determineStatus(completedSteps, failedSteps, skippedSteps, plan);
  const summary = generateSummary(plan, completedSteps, failedSteps, skippedSteps);
  const tokensConsumed = calculateTokens(stepResults);

  return {
    planId: plan.id,
    status,
    output,
    stepResults,
    summary,
    durationMs: totalDurationMs,
    tokensConsumed,
    errors,
  };
}

function mergeOutputs(completedSteps: StepResult[]): Record<string, unknown> {
  const merged: Record<string, unknown> = {};

  for (const step of completedSteps) {
    if (step.output) {
      merged[step.stepId] = step.output;
    }
  }

  return merged;
}

function determineStatus(
  completedSteps: StepResult[],
  failedSteps: StepResult[],
  skippedSteps: StepResult[],
  plan: OrchestratorPlan
): "completed" | "failed" | "partial" {
  const requiredSteps = plan.steps.filter((s) => s.required);
  const requiredCompleted = completedSteps.filter((r) =>
    requiredSteps.some((s) => s.id === r.stepId)
  );
  const requiredFailed = failedSteps.filter((r) =>
    requiredSteps.some((s) => s.id === r.stepId)
  );

  if (requiredFailed.length > 0) {
    return "failed";
  }

  if (requiredCompleted.length === requiredSteps.length) {
    return "completed";
  }

  return "partial";
}

function generateSummary(
  plan: OrchestratorPlan,
  completedSteps: StepResult[],
  failedSteps: StepResult[],
  skippedSteps: StepResult[]
): string {
  const parts: string[] = [];

  parts.push(`Objective: ${plan.objective}`);
  parts.push(
    `Steps: ${completedSteps.length} completed, ${failedSteps.length} failed, ${skippedSteps.length} skipped`
  );

  if (failedSteps.length > 0) {
    parts.push(
      `Failed steps: ${failedSteps.map((r) => r.stepId).join(", ")}`
    );
  }

  if (skippedSteps.length > 0) {
    parts.push(
      `Skipped steps: ${skippedSteps.map((r) => r.stepId).join(", ")}`
    );
  }

  return parts.join(". ");
}

function calculateTokens(stepResults: StepResult[]): number {
  return stepResults.reduce((total, r) => {
    const tokens = (r.output as Record<string, unknown>)?.tokensConsumed;
    return total + (typeof tokens === "number" ? tokens : 0);
  }, 0);
}
