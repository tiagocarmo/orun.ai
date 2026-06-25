"use server";

import { db } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export type IntegrationData = {
  id: string;
  name: string;
  type: string;
  provider: string | null;
  config: string | null;
  secretRef: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export async function getAllIntegrations(): Promise<ApiResponse<IntegrationData[]>> {
  const integrations = await db.integration.findMany({
    orderBy: { createdAt: "desc" },
  });
  return { success: true, data: integrations };
}

export async function toggleIntegration(
  id: string,
  isActive: boolean
): Promise<ApiResponse<{ id: string }>> {
  const existing = await db.integration.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, error: "Integration not found" };
  }

  await db.integration.update({
    where: { id },
    data: { isActive },
  });

  revalidatePath("/settings/integrations");

  return { success: true, data: { id } };
}
