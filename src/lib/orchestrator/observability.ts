import { OrchestratorPlan, OrchestratorResult } from "./types";

export interface ExecutionLog {
  planId: string;
  objective: string;
  strategy: string;
  stepsCount: number;
  status: string;
  durationMs: number;
  tokensConsumed: number;
  errors: string[];
  stepLogs: StepLogEntry[];
  createdAt: string;
}

export interface StepLogEntry {
  stepId: string;
  agentSlug: string;
  status: string;
  durationMs?: number;
  error?: string;
}

export function logExecution(
  plan: OrchestratorPlan,
  result: OrchestratorResult
): ExecutionLog {
  const stepLogs: StepLogEntry[] = result.stepResults.map((r) => ({
    stepId: r.stepId,
    agentSlug: plan.steps.find((s) => s.id === r.stepId)?.agentSlug ?? "unknown",
    status: r.status,
    durationMs: r.durationMs,
    error: r.error,
  }));

  const log: ExecutionLog = {
    planId: plan.id,
    objective: plan.objective,
    strategy: plan.strategy,
    stepsCount: plan.steps.length,
    status: result.status,
    durationMs: result.durationMs,
    tokensConsumed: result.tokensConsumed,
    errors: result.errors,
    stepLogs,
    createdAt: new Date().toISOString(),
  };

  return log;
}

export function formatExecutionLog(log: ExecutionLog): string {
  const lines: string[] = [
    `Plan: ${log.planId}`,
    `Objective: ${log.objective}`,
    `Strategy: ${log.strategy}`,
    `Status: ${log.status}`,
    `Duration: ${log.durationMs}ms`,
    `Tokens: ${log.tokensConsumed}`,
    `Steps: ${log.stepsCount}`,
    "",
    "Step Details:",
  ];

  for (const step of log.stepLogs) {
    const duration = step.durationMs ? ` (${step.durationMs}ms)` : "";
    const error = step.error ? ` - Error: ${step.error}` : "";
    lines.push(`  ${step.stepId}: ${step.status}${duration}${error}`);
  }

  if (log.errors.length > 0) {
    lines.push("", "Errors:");
    for (const error of log.errors) {
      lines.push(`  - ${error}`);
    }
  }

  return lines.join("\n");
}
