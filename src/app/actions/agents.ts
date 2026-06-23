"use server";

import { db } from "@/lib/db";
import { createAgentSchema, updateAgentSchema } from "@/lib/validators";
import { ApiResponse, AgentWithVersions } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function createAgent(
  input: Record<string, unknown>
): Promise<ApiResponse<{ id: string; slug: string }>> {
  const validation = createAgentSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: "Validation failed",
      details: validation.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const data = validation.data;

  const existing = await db.agent.findUnique({ where: { slug: data.slug } });
  if (existing) {
    return {
      success: false,
      error: `Agent with slug '${data.slug}' already exists`,
    };
  }

  const agent = await db.agent.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
      prompt: data.prompt,
      model: data.model,
      maxTokens: data.maxTokens,
      temperature: data.temperature,
      config: data.config ? JSON.stringify(data.config) : null,
    },
  });

  await db.agentVersion.create({
    data: {
      agentId: agent.id,
      version: 1,
      prompt: data.prompt,
      model: data.model,
      config: data.config ? JSON.stringify(data.config) : null,
      changelog: "Initial version",
    },
  });

  revalidatePath("/");

  return {
    success: true,
    data: { id: agent.id, slug: agent.slug },
  };
}

export async function getAgents(): Promise<ApiResponse<AgentWithVersions[]>> {
  const agents = await db.agent.findMany({
    include: { versions: { orderBy: { version: "desc" } } },
    orderBy: { createdAt: "desc" },
  });
  return { success: true, data: agents };
}

export async function getAgent(
  slug: string
): Promise<ApiResponse<AgentWithVersions>> {
  const agent = await db.agent.findUnique({
    where: { slug },
    include: { versions: { orderBy: { version: "desc" } } },
  });

  if (!agent) {
    return { success: false, error: `Agent '${slug}' not found` };
  }

  return { success: true, data: agent };
}

export async function updateAgent(
  slug: string,
  input: Record<string, unknown>
): Promise<ApiResponse<{ id: string }>> {
  const validation = updateAgentSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: "Validation failed",
      details: validation.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const existing = await db.agent.findUnique({ where: { slug } });
  if (!existing) {
    return { success: false, error: `Agent '${slug}' not found` };
  }

  const data = validation.data;

  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.prompt !== undefined) updateData.prompt = data.prompt;
  if (data.model !== undefined) updateData.model = data.model;
  if (data.maxTokens !== undefined) updateData.maxTokens = data.maxTokens;
  if (data.temperature !== undefined) updateData.temperature = data.temperature;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;
  if (data.config !== undefined) updateData.config = JSON.stringify(data.config);

  const agent = await db.agent.update({
    where: { slug },
    data: updateData,
  });

  if (data.prompt || data.model || data.config) {
    const latestVersion = await db.agentVersion.findFirst({
      where: { agentId: existing.id },
      orderBy: { version: "desc" },
    });

    await db.agentVersion.create({
      data: {
        agentId: existing.id,
        version: (latestVersion?.version ?? 0) + 1,
        prompt: (data.prompt as string) ?? existing.prompt,
        model: (data.model as string) ?? existing.model,
        config: data.config ? JSON.stringify(data.config) : existing.config,
        changelog: "Updated via server action",
      },
    });
  }

  revalidatePath("/");

  return { success: true, data: { id: agent.id } };
}

export async function deleteAgent(
  slug: string
): Promise<ApiResponse<{ deleted: boolean }>> {
  const existing = await db.agent.findUnique({ where: { slug } });
  if (!existing) {
    return { success: false, error: `Agent '${slug}' not found` };
  }

  await db.agent.delete({ where: { slug } });

  revalidatePath("/");

  return { success: true, data: { deleted: true } };
}
