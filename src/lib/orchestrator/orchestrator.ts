import { agentRegistry } from "@/lib/agents";
import { createPlan } from "./planner";
import { createContext } from "./context";
import { executePlan } from "./executor";
import { consolidateResults } from "./consolidator";
import { logExecution, formatExecutionLog } from "./observability";
import { OrchestratorResult, AgentDefinition } from "./types";

export async function orchestrate(
  objective: string,
  input: Record<string, unknown>
): Promise<OrchestratorResult> {
  const startTime = Date.now();

  const availableAgents = getAvailableAgents();
  const plan = createPlan(objective, availableAgents, input);
  const context = createContext(input);

  const { stepResults } = await executePlan(plan, context);

  const totalDurationMs = Date.now() - startTime;
  const result = consolidateResults(plan, stepResults, totalDurationMs);

  const log = logExecution(plan, result);
  console.log(formatExecutionLog(log));

  return result;
}

function getAvailableAgents(): AgentDefinition[] {
  return agentRegistry.list();
}

export { createPlan } from "./planner";
export { createContext, addStepResult, getAgentContext, resolveInput } from "./context";
export { executePlan, executeStep } from "./executor";
export { consolidateResults } from "./consolidator";
export { logExecution, formatExecutionLog } from "./observability";
export type {
  OrchestratorPlan,
  OrchestratorStep,
  OrchestratorResult,
  StepResult,
  ExecutionContext,
  ExecutionStrategy,
  StepStatus,
  AgentDefinition,
} from "./types";
