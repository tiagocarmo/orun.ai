import { db } from "@/lib/db";
import { agentRegistry } from "./registry";
import { AgentContext, AgentExecuteResult } from "./types";

export async function executeAgent(
  agentSlug: string,
  input: Record<string, unknown>
): Promise<{ runId: string; result: AgentExecuteResult }> {
  const agent = agentRegistry.get(agentSlug);
  if (!agent) {
    throw new Error(`Agent '${agentSlug}' not found in registry`);
  }

  const validation = agent.validate(input);
  if (!validation.valid) {
    throw new Error(`Input validation failed: ${validation.errors?.join("; ")}`);
  }

  const dbAgent = await db.agent.findUnique({ where: { slug: agentSlug } });
  if (!dbAgent) {
    throw new Error(`Agent '${agentSlug}' not found in database`);
  }

  const latestVersion = await db.agentVersion.findFirst({
    where: { agentId: dbAgent.id },
    orderBy: { version: "desc" },
  });

  const run = await db.agentRun.create({
    data: {
      agentId: dbAgent.id,
      agentVersionId: latestVersion?.id ?? null,
      status: "running",
      input: JSON.stringify(input),
      startedAt: new Date(),
      model: dbAgent.model,
    },
  });

  await db.agentLog.create({
    data: {
      runId: run.id,
      level: "info",
      message: `Agent '${agentSlug}' execution started`,
      metadata: JSON.stringify({ input }),
    },
  });

  const context: AgentContext = {
    agentId: dbAgent.id,
    agentVersionId: latestVersion?.id ?? undefined,
    runId: run.id,
    model: dbAgent.model,
    temperature: dbAgent.temperature,
    maxTokens: dbAgent.maxTokens,
  };

  let result: AgentExecuteResult;
  const startTime = Date.now();

  try {
    result = await agent.execute(input, context);
    result.durationMs = Date.now() - startTime;
  } catch (error) {
    result = {
      status: "failed",
      error: error instanceof Error ? error.message : String(error),
      durationMs: Date.now() - startTime,
    };
  }

  await db.agentRun.update({
    where: { id: run.id },
    data: {
      status: result.status,
      output: result.output ? JSON.stringify(result.output) : null,
      error: result.error ?? null,
      durationMs: result.durationMs ?? null,
      tokensConsumed: result.tokensConsumed ?? null,
      completedAt: new Date(),
    },
  });

  await db.agentLog.create({
    data: {
      runId: run.id,
      level: result.status === "completed" ? "info" : "error",
      message: result.status === "completed"
        ? `Agent '${agentSlug}' execution completed`
        : `Agent '${agentSlug}' execution failed: ${result.error}`,
      metadata: JSON.stringify({
        status: result.status,
        durationMs: result.durationMs,
        tokensConsumed: result.tokensConsumed,
      }),
    },
  });

  return { runId: run.id, result };
}
