import { agentRegistry } from "./registry";
import { LeadIntakeAgent } from "./lead-intake";
import { QualificationAgent } from "./qualification";
import { SchedulingAgent } from "./scheduling";
import { FollowUpAgent } from "./follow-up";
import { ResearchAgent } from "./research";
import { DocumentAgent } from "./document";
import { HumanHandoffAgent } from "./human-handoff";

agentRegistry.register(new LeadIntakeAgent());
agentRegistry.register(new QualificationAgent());
agentRegistry.register(new SchedulingAgent());
agentRegistry.register(new FollowUpAgent());
agentRegistry.register(new ResearchAgent());
agentRegistry.register(new DocumentAgent());
agentRegistry.register(new HumanHandoffAgent());

export { agentRegistry } from "./registry";
export { executeAgent } from "./engine";
export type { BaseAgent, AgentContext, AgentExecuteResult, AgentDefinition } from "./types";
export { LeadIntakeAgent } from "./lead-intake";
export { QualificationAgent } from "./qualification";
export { SchedulingAgent } from "./scheduling";
export { FollowUpAgent } from "./follow-up";
export { ResearchAgent } from "./research";
export { DocumentAgent } from "./document";
export { HumanHandoffAgent } from "./human-handoff";
