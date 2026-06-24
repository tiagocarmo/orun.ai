export const LEAD_ACTIVE_STATUSES = [
  "new",
  "qualified",
  "nurturing",
  "disqualified",
  "converted",
] as const;

export type LeadActiveStatus = (typeof LEAD_ACTIVE_STATUSES)[number];
export type LeadStatus = LeadActiveStatus | "archived";
export type LeadMetadata = Record<string, unknown>;

const ACTIVE_STATUS_SET = new Set<string>(LEAD_ACTIVE_STATUSES);

export function parseLeadMetadata(raw: string | null | undefined): LeadMetadata {
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as LeadMetadata;
    }
  } catch {
    return {};
  }

  return {};
}

export function stringifyLeadMetadata(metadata: LeadMetadata | null | undefined): string | null {
  if (!metadata || Object.keys(metadata).length === 0) {
    return null;
  }

  return JSON.stringify(metadata);
}

export function restoreLeadStatus(metadata: LeadMetadata): LeadActiveStatus {
  const lastActiveStatus = metadata.lastActiveStatus;
  if (typeof lastActiveStatus === "string" && ACTIVE_STATUS_SET.has(lastActiveStatus)) {
    return lastActiveStatus as LeadActiveStatus;
  }

  return "new";
}

export function withLastActiveStatus(
  metadata: LeadMetadata,
  status: LeadActiveStatus
): LeadMetadata {
  return {
    ...metadata,
    lastActiveStatus: status,
  };
}

export function withoutLastActiveStatus(metadata: LeadMetadata): LeadMetadata {
  const nextMetadata = { ...metadata };
  delete nextMetadata.lastActiveStatus;
  return nextMetadata;
}
