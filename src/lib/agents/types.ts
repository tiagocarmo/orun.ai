import { Agent, AgentVersion, AgentRun, AgentLog } from "@prisma/client";

export interface AgentContext {
  agentId: string;
  agentVersionId?: string;
  runId: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface AgentDefinition {
  slug: string;
  name: string;
  description: string;
}

export interface AgentExecuteResult {
  status: "completed" | "failed";
  output?: Record<string, unknown>;
  error?: string;
  tokensConsumed?: number;
  durationMs?: number;
}

export interface BaseAgent {
  definition(): AgentDefinition;
  validate(input: Record<string, unknown>): { valid: boolean; errors?: string[] };
  execute(
    input: Record<string, unknown>,
    context: AgentContext
  ): Promise<AgentExecuteResult>;
}

export type { Agent, AgentVersion, AgentRun, AgentLog };
