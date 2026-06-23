import { BaseAgent, AgentDefinition } from "./types";

class AgentRegistry {
  private agents = new Map<string, BaseAgent>();

  register(agent: BaseAgent): void {
    const def = agent.definition();
    if (this.agents.has(def.slug)) {
      throw new Error(`Agent with slug '${def.slug}' is already registered`);
    }
    this.agents.set(def.slug, agent);
  }

  get(slug: string): BaseAgent | undefined {
    return this.agents.get(slug);
  }

  has(slug: string): boolean {
    return this.agents.has(slug);
  }

  list(): AgentDefinition[] {
    return Array.from(this.agents.values()).map((a) => a.definition());
  }

  slugs(): string[] {
    return Array.from(this.agents.keys());
  }
}

export const agentRegistry = new AgentRegistry();
