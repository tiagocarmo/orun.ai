import { AuthUser } from "@/lib/auth/types";

export type SensitiveAction =
  | "agent:execute"
  | "agent:delete"
  | "lead:delete"
  | "workflow:execute"
  | "workflow:delete"
  | "integration:create"
  | "integration:update"
  | "integration:delete"
  | "document:delete"
  | "user:delete"
  | "settings:update";

export interface ApprovalRequest {
  id: string;
  action: SensitiveAction;
  requestedBy: AuthUser;
  resourceType: string;
  resourceId: string;
  reason?: string;
  status: "pending" | "approved" | "denied";
  reviewedBy?: string;
  reviewedAt?: Date;
  createdAt: Date;
}

export interface ActionLimit {
  action: SensitiveAction;
  maxPerHour: number;
  maxPerDay: number;
}

const DEFAULT_ACTION_LIMITS: ActionLimit[] = [
  { action: "agent:execute", maxPerHour: 50, maxPerDay: 500 },
  { action: "agent:delete", maxPerHour: 5, maxPerDay: 20 },
  { action: "lead:delete", maxPerHour: 10, maxPerDay: 100 },
  { action: "workflow:execute", maxPerHour: 30, maxPerDay: 300 },
  { action: "workflow:delete", maxPerHour: 5, maxPerDay: 20 },
  { action: "integration:create", maxPerHour: 10, maxPerDay: 50 },
  { action: "integration:update", maxPerHour: 20, maxPerDay: 100 },
  { action: "integration:delete", maxPerHour: 5, maxPerDay: 20 },
  { action: "document:delete", maxPerHour: 10, maxPerDay: 100 },
  { action: "user:delete", maxPerHour: 2, maxPerDay: 10 },
  { action: "settings:update", maxPerHour: 10, maxPerDay: 50 },
];

const actionTimestamps: Map<SensitiveAction, Date[]> = new Map();
const approvalRequests = new Map<string, ApprovalRequest>();

export function getActionLimits(): ActionLimit[] {
  return [...DEFAULT_ACTION_LIMITS];
}

export function getActionLimit(action: SensitiveAction): ActionLimit | undefined {
  return DEFAULT_ACTION_LIMITS.find((l) => l.action === action);
}

export function recordAction(action: SensitiveAction): void {
  if (!actionTimestamps.has(action)) {
    actionTimestamps.set(action, []);
  }
  const timestamps = actionTimestamps.get(action)!;
  timestamps.push(new Date());
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const filtered = timestamps.filter((t) => t > oneDayAgo);
  actionTimestamps.set(action, filtered);
}

export function checkActionLimit(action: SensitiveAction): { allowed: boolean; reason?: string } {
  const limit = getActionLimit(action);
  if (!limit) return { allowed: true };

  const timestamps = actionTimestamps.get(action) ?? [];
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;
  const oneDayAgo = now - 24 * 60 * 60 * 1000;

  const lastHour = timestamps.filter((t) => t.getTime() > oneHourAgo).length;
  const lastDay = timestamps.filter((t) => t.getTime() > oneDayAgo).length;

  if (lastHour >= limit.maxPerHour) {
    return { allowed: false, reason: `Hourly limit reached for '${action}' (${limit.maxPerHour}/${limit.maxPerHour})` };
  }
  if (lastDay >= limit.maxPerDay) {
    return { allowed: false, reason: `Daily limit reached for '${action}' (${limit.maxPerDay}/${limit.maxPerDay})` };
  }

  return { allowed: true };
}

export function requiresApproval(action: SensitiveAction): boolean {
  return ["agent:delete", "lead:delete", "workflow:delete", "integration:delete", "user:delete", "settings:update"].includes(action);
}

export function createApprovalRequest(
  action: SensitiveAction,
  user: AuthUser,
  resourceType: string,
  resourceId: string,
  reason?: string
): ApprovalRequest {
  const id = `apr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const request: ApprovalRequest = {
    id,
    action,
    requestedBy: user,
    resourceType,
    resourceId,
    reason,
    status: "pending",
    createdAt: new Date(),
  };
  approvalRequests.set(id, request);
  return request;
}

export function approveRequest(id: string, reviewerId: string): ApprovalRequest | null {
  const request = approvalRequests.get(id);
  if (!request) return null;
  request.status = "approved";
  request.reviewedBy = reviewerId;
  request.reviewedAt = new Date();
  return request;
}

export function denyRequest(id: string, reviewerId: string): ApprovalRequest | null {
  const request = approvalRequests.get(id);
  if (!request) return null;
  request.status = "denied";
  request.reviewedBy = reviewerId;
  request.reviewedAt = new Date();
  return request;
}

export function getApprovalRequest(id: string): ApprovalRequest | undefined {
  return approvalRequests.get(id);
}

export function listPendingApprovals(): ApprovalRequest[] {
  return Array.from(approvalRequests.values()).filter((r) => r.status === "pending");
}

export function evaluateAction(
  action: SensitiveAction,
  user: AuthUser
): { allowed: boolean; requiresApproval: boolean; error?: string; approvalRequest?: ApprovalRequest } {
  const limitCheck = checkActionLimit(action);
  if (!limitCheck.allowed) {
    return { allowed: false, requiresApproval: false, error: limitCheck.reason };
  }

  recordAction(action);

  if (requiresApproval(action)) {
    const approvalReq = createApprovalRequest(action, user, action, "pending");
    return {
      allowed: false,
      requiresApproval: true,
      approvalRequest: approvalReq,
    };
  }

  return { allowed: true, requiresApproval: false };
}
