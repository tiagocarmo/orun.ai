"use server";

import { db } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export type SettingData = {
  id: string;
  key: string;
  value: string;
  type: string;
  group: string;
  label: string;
  helpText: string | null;
};

export async function getSettings(
  group?: string
): Promise<ApiResponse<SettingData[]>> {
  const where = group ? { group } : {};
  const settings = await db.setting.findMany({
    where,
    orderBy: [{ group: "asc" }, { key: "asc" }],
  });
  return { success: true, data: settings };
}

export async function getSetting(
  key: string
): Promise<ApiResponse<SettingData>> {
  const setting = await db.setting.findUnique({ where: { key } });
  if (!setting) {
    return { success: false, error: `Setting '${key}' not found` };
  }
  return { success: true, data: setting };
}

export async function updateSetting(
  key: string,
  value: string
): Promise<ApiResponse<{ key: string }>> {
  const existing = await db.setting.findUnique({ where: { key } });
  if (!existing) {
    return { success: false, error: `Setting '${key}' not found` };
  }

  await db.setting.update({
    where: { key },
    data: { value },
  });

  revalidatePath("/settings");

  return { success: true, data: { key } };
}

export async function updateSettings(
  entries: Array<{ key: string; value: string }>
): Promise<ApiResponse<{ updated: number }>> {
  let updated = 0;

  for (const entry of entries) {
    const existing = await db.setting.findUnique({
      where: { key: entry.key },
    });
    if (existing) {
      await db.setting.update({
        where: { key: entry.key },
        data: { value: entry.value },
      });
      updated++;
    }
  }

  revalidatePath("/settings");

  return { success: true, data: { updated } };
}
