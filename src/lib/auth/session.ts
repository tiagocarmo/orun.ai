import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { AuthUser, AuthResult, AuthRole, APIKeyConfig } from "./types";

const SESSION_SECRET = process.env.SESSION_SECRET ?? "dev-session-secret-change-in-production";
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;

const apiKeyStore = new Map<string, APIKeyConfig>();

export function generateApiKey(userId: string, role: AuthRole, organizationId?: string): APIKeyConfig {
  const key = `orun_${randomBytes(32).toString("hex")}`;
  const config: APIKeyConfig = {
    key,
    userId,
    role,
    organizationId,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  };
  apiKeyStore.set(key, config);
  return config;
}

export function validateAPIKey(key: string): AuthResult {
  const config = apiKeyStore.get(key);
  if (!config) {
    return { authenticated: false, error: "Invalid API key" };
  }

  if (config.expiresAt && config.expiresAt < new Date()) {
    return { authenticated: false, error: "API key expired" };
  }

  return {
    authenticated: true,
    user: {
      id: config.userId,
      email: "",
      name: "",
      role: config.role,
      organizationId: config.organizationId,
    },
  };
}

export function revokeAPIKey(key: string): boolean {
  return apiKeyStore.delete(key);
}

export function createSessionToken(user: AuthUser): string {
  const payload = JSON.stringify({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    organizationId: user.organizationId,
    iat: Date.now(),
    exp: Date.now() + SESSION_MAX_AGE_MS,
  });

  const encoded = Buffer.from(payload).toString("base64url");
  const signature = createHmac("sha256", SESSION_SECRET)
    .update(encoded)
    .digest("hex");

  return `${encoded}.${signature}`;
}

export function verifySessionToken(token: string): AuthResult {
  const parts = token.split(".");
  if (parts.length !== 2) {
    return { authenticated: false, error: "Invalid token format" };
  }

  const [encoded, signature] = parts;

  const expectedSignature = createHmac("sha256", SESSION_SECRET)
    .update(encoded)
    .digest("hex");

  try {
    const sigBuf = Buffer.from(signature, "hex");
    const expectedBuf = Buffer.from(expectedSignature, "hex");
    if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
      return { authenticated: false, error: "Invalid token signature" };
    }
  } catch {
    return { authenticated: false, error: "Invalid token signature" };
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString());

    if (payload.exp && payload.exp < Date.now()) {
      return { authenticated: false, error: "Token expired" };
    }

    return {
      authenticated: true,
      user: {
        id: payload.userId,
        email: payload.email,
        name: payload.name,
        role: payload.role as AuthRole,
        organizationId: payload.organizationId,
      },
    };
  } catch {
    return { authenticated: false, error: "Invalid token payload" };
  }
}

export function extractBearerToken(authorizationHeader: string | null): string | null {
  if (!authorizationHeader) return null;
  const match = authorizationHeader.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}
