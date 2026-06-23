import { agentRegistry } from "./registry";
import { LeadIntakeAgent } from "./lead-intake";
import { QualificationAgent } from "./qualification";

agentRegistry.register(new LeadIntakeAgent());
agentRegistry.register(new QualificationAgent());

export { agentRegistry } from "./registry";
export { executeAgent } from "./engine";
export type { BaseAgent, AgentContext, AgentExecuteResult, AgentDefinition } from "./types";
export { LeadIntakeAgent } from "./lead-intake";
export { QualificationAgent } from "./qualification";
