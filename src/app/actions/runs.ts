"use server";

import { db } from "@/lib/db";
import { runAgentSchema } from "@/lib/validators";
import { ApiResponse, AgentExecutionResult, AgentRunWithLogs } from "@/lib/types";
import { executeAgent } from "@/lib/agents/engine";
import { revalidatePath } from "next/cache";

export async function runAgent(
  agentSlug: string,
  input: Record<string, unknown>
): Promise<ApiResponse<AgentExecutionResult>> {
  const validation = runAgentSchema.safeParse({ agentSlug, input });
  if (!validation.success) {
    return {
      success: false,
      error: "Validation failed",
      details: validation.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const { runId, result } = await executeAgent(agentSlug, input);

    revalidatePath("/dashboard");

    return {
      success: true,
      data: {
        runId,
        status: result.status,
        output: result.output,
        error: result.error,
        durationMs: result.durationMs ?? 0,
        tokensConsumed: result.tokensConsumed ?? 0,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function getRuns(
  agentSlug?: string,
  page = 1,
  pageSize = 20
): Promise<ApiResponse<{ data: AgentRunWithLogs[]; total: number; page: number; pageSize: number; totalPages: number }>> {
  const agent = agentSlug
    ? await db.agent.findUnique({ where: { slug: agentSlug } })
    : null;

  const where = agent ? { agentId: agent.id } : {};

  const [total, runs] = await Promise.all([
    db.agentRun.count({ where }),
    db.agentRun.findMany({
      where,
      include: {
        agent: true,
        logs: { orderBy: { createdAt: "asc" } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return {
    success: true,
    data: {
      data: runs,
      total,
      page,
      pageSize,
      totalPages,
    },
  };
}

export async function getRun(
  runId: string
): Promise<ApiResponse<AgentRunWithLogs>> {
  const run = await db.agentRun.findUnique({
    where: { id: runId },
    include: {
      agent: true,
      logs: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!run) {
    return { success: false, error: `Run '${runId}' not found` };
  }

  return { success: true, data: run };
}
