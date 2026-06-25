import { db } from "./db";
import type { Setting } from "@prisma/client";

export async function getSettingValue(key: string): Promise<string | null> {
  const setting = await db.setting.findUnique({ where: { key } });
  return setting?.value ?? null;
}

export async function getSettingNumber(key: string): Promise<number | null> {
  const value = await getSettingValue(key);
  if (value === null) return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
}

export async function getSettingBoolean(key: string): Promise<boolean> {
  const value = await getSettingValue(key);
  return value === "true";
}

export async function getSettingsByGroup(group: string): Promise<Setting[]> {
  return db.setting.findMany({
    where: { group },
    orderBy: { key: "asc" },
  });
}

export async function getAllSettings(): Promise<Setting[]> {
  return db.setting.findMany({
    orderBy: [{ group: "asc" }, { key: "asc" }],
  });
}
