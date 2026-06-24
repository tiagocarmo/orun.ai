export type WorkflowStepStatus = "pending" | "running" | "completed" | "failed" | "skipped";

export interface WorkflowStepDefinition {
  id: string;
  agentSlug: string;
  inputMapping: Record<string, string>;
  condition?: string;
}

export interface WorkflowStepLog {
  stepId: string;
  agentSlug: string;
  status: WorkflowStepStatus;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
}

export interface WorkflowContext {
  input: Record<string, unknown>;
  previous?: Record<string, unknown>;
  steps: WorkflowStepLog[];
}

export type WorkflowRunStatus = "pending" | "running" | "paused" | "completed" | "failed" | "cancelled";

export interface WorkflowRunResult {
  runId: string;
  status: WorkflowRunStatus;
  output?: Record<string, unknown>;
  error?: string;
  stepLogs: WorkflowStepLog[];
}
