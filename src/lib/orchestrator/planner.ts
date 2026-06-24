import { OrchestratorPlan, OrchestratorStep, AgentDefinition } from "./types";

let planCounter = 0;

export function createPlan(
  objective: string,
  availableAgents: AgentDefinition[],
  input: Record<string, unknown>
): OrchestratorPlan {
  planCounter++;
  const steps = generateSteps(objective, availableAgents, input);

  return {
    id: `plan-${Date.now()}-${planCounter}`,
    objective,
    steps,
    strategy: steps.length > 1 ? "sequential" : "sequential",
    createdAt: new Date().toISOString(),
  };
}

function generateSteps(
  objective: string,
  availableAgents: AgentDefinition[],
  input: Record<string, unknown>
): OrchestratorStep[] {
  const lowerObjective = objective.toLowerCase();
  const steps: OrchestratorStep[] = [];

  if (lowerObjective.includes("qualific") || lowerObjective.includes("lead")) {
    const qualificationAgent = availableAgents.find((a) => a.slug === "qualification");
    if (qualificationAgent) {
      steps.push({
        id: "step-qualification",
        description: "Qualify the lead",
        agentSlug: "qualification",
        inputMapping: { leadId: "$input.leadId" },
        required: true,
      });
    }
  }

  if (lowerObjective.includes("agend") || lowerObjective.includes("reuni") || lowerObjective.includes("meeting")) {
    const schedulingAgent = availableAgents.find((a) => a.slug === "scheduling");
    if (schedulingAgent) {
      steps.push({
        id: "step-scheduling",
        description: "Schedule meeting",
        agentSlug: "scheduling",
        inputMapping: {
          leadId: "$input.leadId",
          qualificationResult: "$previous.classification",
        },
        dependsOn: steps.length > 0 ? [steps[steps.length - 1].id] : [],
        required: true,
      });
    }
  }

  if (lowerObjective.includes("enriquec") || lowerObjective.includes("research") || lowerObjective.includes("pesquis")) {
    const researchAgent = availableAgents.find((a) => a.slug === "research");
    if (researchAgent) {
      steps.push({
        id: "step-research",
        description: "Research and enrich lead information",
        agentSlug: "research",
        inputMapping: { leadId: "$input.leadId" },
        required: false,
      });
    }
  }

  if (lowerObjective.includes("documento") || lowerObjective.includes("proposta") || lowerObjective.includes("contrato")) {
    const documentAgent = availableAgents.find((a) => a.slug === "document");
    if (documentAgent) {
      steps.push({
        id: "step-document",
        description: "Generate document",
        agentSlug: "document",
        inputMapping: {
          leadId: "$input.leadId",
          context: "$previous",
        },
        dependsOn: steps.length > 0 ? [steps[steps.length - 1].id] : [],
        required: true,
      });
    }
  }

  if (steps.length === 0) {
    const firstAgent = availableAgents[0];
    if (firstAgent) {
      steps.push({
        id: "step-default",
        description: `Execute ${firstAgent.name}`,
        agentSlug: firstAgent.slug,
        inputMapping: mapInputToAgent(firstAgent.slug, input),
        required: true,
      });
    }
  }

  return steps;
}

function mapInputToAgent(
  agentSlug: string,
  input: Record<string, unknown>
): Record<string, string> {
  const mapping: Record<string, string> = {};

  if (input.leadId) {
    mapping.leadId = "$input.leadId";
  }

  return mapping;
}

export function selectAgents(
  step: OrchestratorStep,
  availableAgents: AgentDefinition[]
): AgentDefinition | null {
  return availableAgents.find((a) => a.slug === step.agentSlug) ?? null;
}
