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
const MANAGED_METADATA_KEYS = new Set(["externalId"]);

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

export function stripManagedLeadMetadata(metadata: LeadMetadata | null | undefined): LeadMetadata {
  if (!metadata) {
    return {};
  }

  const nextMetadata = { ...metadata };
  for (const key of MANAGED_METADATA_KEYS) {
    delete nextMetadata[key];
  }

  return nextMetadata;
}

export function resolveLeadExternalId(
  externalId: unknown,
  metadata: LeadMetadata | null | undefined
): string | null {
  if (typeof externalId === "string" && externalId.trim().length > 0) {
    return externalId.trim();
  }

  const metadataExternalId = metadata?.externalId;
  if (typeof metadataExternalId === "string" && metadataExternalId.trim().length > 0) {
    return metadataExternalId.trim();
  }

  return null;
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
