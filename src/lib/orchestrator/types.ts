export type ExecutionStrategy = "sequential" | "parallel" | "hybrid";

export type StepStatus = "pending" | "running" | "completed" | "failed" | "skipped";

export interface OrchestratorStep {
  id: string;
  description: string;
  agentSlug: string;
  inputMapping: Record<string, string>;
  dependsOn?: string[];
  required: boolean;
}

export interface OrchestratorPlan {
  id: string;
  objective: string;
  steps: OrchestratorStep[];
  strategy: ExecutionStrategy;
  createdAt: string;
}

export interface StepResult {
  stepId: string;
  status: StepStatus;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  agentRunId?: string;
  durationMs?: number;
}

export interface OrchestratorResult {
  planId: string;
  status: "completed" | "failed" | "partial";
  output: Record<string, unknown>;
  stepResults: StepResult[];
  summary: string;
  durationMs: number;
  tokensConsumed: number;
  errors: string[];
}

export interface ExecutionContext {
  global: Record<string, unknown>;
  workflow?: Record<string, unknown>;
  agent: Record<string, Record<string, unknown>>;
  stepResults: Map<string, StepResult>;
}

export interface AgentDefinition {
  slug: string;
  name: string;
  description: string;
}
