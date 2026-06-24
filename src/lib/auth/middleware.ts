import { NextRequest, NextResponse } from "next/server";
import { validateAPIKey, verifySessionToken, extractBearerToken } from "./session";
import { AuthUser } from "./types";

export interface AuthenticatedRequest extends NextRequest {
  auth?: AuthUser;
}

export function authenticate(request: NextRequest): { authenticated: boolean; user?: AuthUser; error?: string } {
  const apiKey = request.headers.get("x-api-key");
  if (apiKey) {
    return validateAPIKey(apiKey);
  }

  const authHeader = request.headers.get("authorization");
  const bearerToken = extractBearerToken(authHeader);
  if (bearerToken) {
    return verifySessionToken(bearerToken);
  }

  const sessionCookie = request.cookies.get("session")?.value;
  if (sessionCookie) {
    return verifySessionToken(sessionCookie);
  }

  return { authenticated: false, error: "No authentication credentials provided" };
}

export function requireAuth(request: NextRequest): NextResponse | null {
  const result = authenticate(request);
  if (!result.authenticated) {
    return NextResponse.json(
      { success: false, error: result.error ?? "Unauthorized" },
      { status: 401 }
    );
  }
  return null;
}

export function withAuth<T>(
  handler: (request: NextRequest, user: AuthUser) => Promise<T>
): (request: NextRequest) => Promise<T | NextResponse> {
  return async (request: NextRequest) => {
    const result = authenticate(request);
    if (!result.authenticated || !result.user) {
      return NextResponse.json(
        { success: false, error: result.error ?? "Unauthorized" },
        { status: 401 }
      );
    }
    return handler(request, result.user);
  };
}
