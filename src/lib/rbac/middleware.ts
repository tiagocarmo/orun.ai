import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/lib/auth/middleware";
import { AuthUser } from "@/lib/auth/types";
import { hasPermission, hasAnyPermission, Permission } from "./roles";

export function requirePermission(permission: Permission) {
  return (request: NextRequest): { allowed: boolean; user?: AuthUser; error?: string } => {
    const authResult = authenticate(request);
    if (!authResult.authenticated || !authResult.user) {
      return { allowed: false, error: authResult.error ?? "Unauthorized" };
    }

    if (!hasPermission(authResult.user.role, permission)) {
      return {
        allowed: false,
        error: `Insufficient permissions: requires '${permission}'`,
      };
    }

    return { allowed: true, user: authResult.user };
  };
}

export function requireAnyPermission(permissions: Permission[]) {
  return (request: NextRequest): { allowed: boolean; user?: AuthUser; error?: string } => {
    const authResult = authenticate(request);
    if (!authResult.authenticated || !authResult.user) {
      return { allowed: false, error: authResult.error ?? "Unauthorized" };
    }

    if (!hasAnyPermission(authResult.user.role, permissions)) {
      return {
        allowed: false,
        error: `Insufficient permissions: requires one of [${permissions.join(", ")}]`,
      };
    }

    return { allowed: true, user: authResult.user };
  };
}

export function withPermission(permission: Permission) {
  return <T>(
    handler: (request: NextRequest, user: AuthUser) => Promise<T>
  ): ((request: NextRequest) => Promise<T | NextResponse>) => {
    return async (request: NextRequest) => {
      const check = requirePermission(permission)(request);
      if (!check.allowed) {
        return NextResponse.json(
          { success: false, error: check.error },
          { status: check.error?.includes("Unauthorized") ? 401 : 403 }
        );
      }
      return handler(request, check.user!);
    };
  };
}
