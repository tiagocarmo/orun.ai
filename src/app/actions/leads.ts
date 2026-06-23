"use server";

import { db } from "@/lib/db";
import { createLeadSchema, updateLeadSchema } from "@/lib/validators";
import { ApiResponse, LeadWithEvents, PaginatedResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function createLead(
  input: Record<string, unknown>
): Promise<ApiResponse<{ id: string }>> {
  const validation = createLeadSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: "Validation failed",
      details: validation.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const data = validation.data;

  if (data.email) {
    const existing = await db.lead.findFirst({ where: { email: data.email } });
    if (existing) {
      return {
        success: false,
        error: "A lead with this email already exists",
      };
    }
  }

  if (data.phone) {
    const existing = await db.lead.findFirst({ where: { phone: data.phone } });
    if (existing) {
      return {
        success: false,
        error: "A lead with this phone already exists",
      };
    }
  }

  const lead = await db.lead.create({
    data: {
      name: data.name,
      email: data.email ?? null,
      phone: data.phone ?? null,
      company: data.company ?? null,
      source: data.source ?? null,
      message: data.message ?? null,
      status: "new",
      metadata: data.metadata ? JSON.stringify(data.metadata) : null,
    },
  });

  await db.leadEvent.create({
    data: {
      leadId: lead.id,
      type: "created",
      data: JSON.stringify({ source: data.source }),
    },
  });

  revalidatePath("/dashboard");

  return { success: true, data: { id: lead.id } };
}

export async function getLeads(
  page = 1,
  pageSize = 20,
  status?: string
): Promise<ApiResponse<PaginatedResponse<LeadWithEvents>>> {
  const where = status ? { status } : {};

  const [total, leads] = await Promise.all([
    db.lead.count({ where }),
    db.lead.findMany({
      where,
      include: { events: { orderBy: { createdAt: "desc" } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return {
    success: true,
    data: {
      data: leads,
      total,
      page,
      pageSize,
      totalPages,
    },
  };
}

export async function getLead(
  id: string
): Promise<ApiResponse<LeadWithEvents>> {
  const lead = await db.lead.findUnique({
    where: { id },
    include: { events: { orderBy: { createdAt: "desc" } } },
  });

  if (!lead) {
    return { success: false, error: `Lead '${id}' not found` };
  }

  return { success: true, data: lead };
}

export async function updateLead(
  id: string,
  input: Record<string, unknown>
): Promise<ApiResponse<{ id: string }>> {
  const validation = updateLeadSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: "Validation failed",
      details: validation.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const existing = await db.lead.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, error: `Lead '${id}' not found` };
  }

  const data = validation.data;
  const updateData: Record<string, unknown> = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.company !== undefined) updateData.company = data.company;
  if (data.source !== undefined) updateData.source = data.source;
  if (data.message !== undefined) updateData.message = data.message;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.qualificationScore !== undefined) updateData.qualificationScore = data.qualificationScore;
  if (data.qualificationReason !== undefined) updateData.qualificationReason = data.qualificationReason;
  if (data.metadata !== undefined) updateData.metadata = JSON.stringify(data.metadata);

  if (data.status && data.status !== existing.status) {
    await db.leadEvent.create({
      data: {
        leadId: id,
        type: "status_changed",
        data: JSON.stringify({ from: existing.status, to: data.status }),
      },
    });
  }

  const lead = await db.lead.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/dashboard");

  return { success: true, data: { id: lead.id } };
}

export async function searchLeads(
  query: string
): Promise<ApiResponse<{ id: string; name: string; email: string | null; company: string | null; phone: string | null }[]>> {
  if (!query || query.length < 3) {
    return { success: true, data: [] };
  }

  const leads = await db.lead.findMany({
    where: {
      OR: [
        { name: { contains: query } },
        { email: { contains: query } },
        { company: { contains: query } },
      ],
    },
    select: { id: true, name: true, email: true, company: true, phone: true },
    take: 3,
    orderBy: { name: "asc" },
  });

  return { success: true, data: leads };
}

export async function deleteLead(
  id: string
): Promise<ApiResponse<{ deleted: boolean }>> {
  const existing = await db.lead.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, error: `Lead '${id}' not found` };
  }

  await db.lead.delete({ where: { id } });

  revalidatePath("/dashboard");

  return { success: true, data: { deleted: true } };
}
