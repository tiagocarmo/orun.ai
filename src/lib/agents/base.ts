import { BaseAgent, AgentDefinition, AgentContext, AgentExecuteResult } from "./types";

export abstract class AbstractAgent implements BaseAgent {
  abstract definition(): AgentDefinition;
  abstract validate(input: Record<string, unknown>): { valid: boolean; errors?: string[] };
  abstract execute(
    input: Record<string, unknown>,
    context: AgentContext
  ): Promise<AgentExecuteResult>;

  getName(): string {
    return this.definition().name;
  }

  getSlug(): string {
    return this.definition().slug;
  }

  getDescription(): string {
    return this.definition().description;
  }
}
