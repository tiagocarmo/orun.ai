import { ExecutionContext, StepResult } from "./types";

export function createContext(input: Record<string, unknown>): ExecutionContext {
  return {
    global: { ...input },
    workflow: {},
    agent: {},
    stepResults: new Map(),
  };
}

export function addStepResult(
  context: ExecutionContext,
  stepId: string,
  result: StepResult
): ExecutionContext {
  const newStepResults = new Map(context.stepResults);
  newStepResults.set(stepId, result);

  return {
    ...context,
    stepResults: newStepResults,
  };
}

export function getAgentContext(
  context: ExecutionContext,
  agentSlug: string
): Record<string, unknown> {
  return context.agent[agentSlug] ?? {};
}

export function setAgentContext(
  context: ExecutionContext,
  agentSlug: string,
  data: Record<string, unknown>
): ExecutionContext {
  return {
    ...context,
    agent: {
      ...context.agent,
      [agentSlug]: { ...context.agent[agentSlug], ...data },
    },
  };
}

export function resolveInput(
  mapping: Record<string, string>,
  context: ExecutionContext
): Record<string, unknown> {
  const resolved: Record<string, unknown> = {};

  for (const [key, template] of Object.entries(mapping)) {
    if (typeof template !== "string") {
      resolved[key] = template;
      continue;
    }

    if (template.startsWith("$input.")) {
      const field = template.slice(7);
      resolved[key] = context.global[field];
    } else if (template.startsWith("$previous.")) {
      const field = template.slice(10);
      const lastResult = Array.from(context.stepResults.values())
        .filter((r) => r.status === "completed")
        .pop();
      resolved[key] = lastResult?.output?.[field];
    } else if (template.startsWith("$context.")) {
      const field = template.slice(9);
      resolved[key] = context.workflow?.[field];
    } else {
      resolved[key] = template;
    }
  }

  return resolved;
}
