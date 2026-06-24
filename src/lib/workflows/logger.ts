import { WorkflowStepLog } from "./types";

export function createStepLog(
  stepId: string,
  agentSlug: string,
  input: Record<string, unknown>
): WorkflowStepLog {
  return {
    stepId,
    agentSlug,
    status: "running",
    input,
    startedAt: new Date().toISOString(),
  };
}

export function completeStepLog(
  log: WorkflowStepLog,
  output: Record<string, unknown>
): WorkflowStepLog {
  return {
    ...log,
    status: "completed",
    output,
    completedAt: new Date().toISOString(),
    durationMs: new Date().toISOString() > log.startedAt
      ? new Date(log.startedAt).getTime() > 0
        ? Date.now() - new Date(log.startedAt).getTime()
        : 0
      : 0,
  };
}

export function failStepLog(
  log: WorkflowStepLog,
  error: string
): WorkflowStepLog {
  return {
    ...log,
    status: "failed",
    error,
    completedAt: new Date().toISOString(),
    durationMs: Date.now() - new Date(log.startedAt).getTime(),
  };
}

export function skipStepLog(log: WorkflowStepLog): WorkflowStepLog {
  return {
    ...log,
    status: "skipped",
    completedAt: new Date().toISOString(),
  };
}

export function serializeStepLogs(logs: WorkflowStepLog[]): string {
  return JSON.stringify(logs);
}

export function deserializeStepLogs(json: string | null): WorkflowStepLog[] {
  if (!json) return [];
  try {
    return JSON.parse(json) as WorkflowStepLog[];
  } catch {
    return [];
  }
}
