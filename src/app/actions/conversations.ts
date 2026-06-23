"use server";

import { db } from "@/lib/db";
import { createConversationSchema, addMessageSchema, updateConversationSchema } from "@/lib/validators";
import { ApiResponse, ConversationWithMessages, PaginatedResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function createConversation(
  input: Record<string, unknown>
): Promise<ApiResponse<{ id: string }>> {
  const validation = createConversationSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: "Validation failed",
      details: validation.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const data = validation.data;

  const conversation = await db.conversation.create({
    data: {
      leadId: data.leadId ?? null,
      title: data.title ?? null,
      status: "active",
    },
  });

  revalidatePath("/");

  return { success: true, data: { id: conversation.id } };
}

export async function updateConversation(
  id: string,
  data: Record<string, unknown>
): Promise<ApiResponse<{ id: string }>> {
  const validation = updateConversationSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      error: "Validation failed",
      details: validation.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const conversation = await db.conversation.findUnique({ where: { id } });
  if (!conversation) {
    return { success: false, error: `Conversation '${id}' not found` };
  }

  const updated = await db.conversation.update({
    where: { id },
    data: validation.data,
  });

  revalidatePath("/conversations");

  return { success: true, data: { id: updated.id } };
}

export async function addMessage(
  input: Record<string, unknown>
): Promise<ApiResponse<{ id: string }>> {
  const validation = addMessageSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: "Validation failed",
      details: validation.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const data = validation.data;

  const conversation = await db.conversation.findUnique({
    where: { id: data.conversationId },
  });
  if (!conversation) {
    return {
      success: false,
      error: `Conversation '${data.conversationId}' not found`,
    };
  }

  const message = await db.message.create({
    data: {
      conversationId: data.conversationId,
      role: data.role,
      content: data.content,
      metadata: data.metadata ? JSON.stringify(data.metadata) : null,
    },
  });

  await db.conversation.update({
    where: { id: data.conversationId },
    data: { updatedAt: new Date() },
  });

  revalidatePath("/");

  return { success: true, data: { id: message.id } };
}

export async function getConversation(
  id: string
): Promise<ApiResponse<ConversationWithMessages>> {
  const conversation = await db.conversation.findUnique({
    where: { id },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
      lead: true,
    },
  });

  if (!conversation) {
    return { success: false, error: `Conversation '${id}' not found` };
  }

  return { success: true, data: conversation };
}

export async function getConversationHistory(
  conversationId: string,
  page = 1,
  pageSize = 50
): Promise<ApiResponse<PaginatedResponse<ConversationWithMessages["messages"][0]>>> {
  const conversation = await db.conversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation) {
    return {
      success: false,
      error: `Conversation '${conversationId}' not found`,
    };
  }

  const [total, messages] = await Promise.all([
    db.message.count({ where: { conversationId } }),
    db.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return {
    success: true,
    data: {
      data: messages,
      total,
      page,
      pageSize,
      totalPages,
    },
  };
}
