import { AuthRole } from "@/lib/auth/types";

export type Permission =
  | "agents:read"
  | "agents:write"
  | "agents:execute"
  | "leads:read"
  | "leads:write"
  | "leads:delete"
  | "workflows:read"
  | "workflows:write"
  | "workflows:execute"
  | "conversations:read"
  | "conversations:write"
  | "documents:read"
  | "documents:write"
  | "integrations:read"
  | "integrations:write"
  | "settings:read"
  | "settings:write"
  | "metrics:read"
  | "users:read"
  | "users:write"
  | "audit:read";

const ROLE_PERMISSIONS: Record<AuthRole, Permission[]> = {
  admin: [
    "agents:read",
    "agents:write",
    "agents:execute",
    "leads:read",
    "leads:write",
    "leads:delete",
    "workflows:read",
    "workflows:write",
    "workflows:execute",
    "conversations:read",
    "conversations:write",
    "documents:read",
    "documents:write",
    "integrations:read",
    "integrations:write",
    "settings:read",
    "settings:write",
    "metrics:read",
    "users:read",
    "users:write",
    "audit:read",
  ],
  operator: [
    "agents:read",
    "agents:execute",
    "leads:read",
    "leads:write",
    "workflows:read",
    "workflows:execute",
    "conversations:read",
    "conversations:write",
    "documents:read",
    "documents:write",
    "metrics:read",
  ],
  viewer: [
    "agents:read",
    "leads:read",
    "workflows:read",
    "conversations:read",
    "documents:read",
    "metrics:read",
  ],
};

export function getRolePermissions(role: AuthRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function hasPermission(role: AuthRole, permission: Permission): boolean {
  return getRolePermissions(role).includes(permission);
}

export function hasAnyPermission(role: AuthRole, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

export function hasAllPermissions(role: AuthRole, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}
