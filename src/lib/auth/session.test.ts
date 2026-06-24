import { describe, expect, it } from "vitest";
import {
  generateApiKey,
  validateAPIKey,
  revokeAPIKey,
  createSessionToken,
  verifySessionToken,
  extractBearerToken,
} from "./session";

describe("Auth Session", () => {
  describe("API Keys", () => {
    it("generates a valid API key", () => {
      const apiKey = generateApiKey("user-1", "admin", "org-1");
      expect(apiKey.key).toMatch(/^orun_/);
      expect(apiKey.userId).toBe("user-1");
      expect(apiKey.role).toBe("admin");
      expect(apiKey.organizationId).toBe("org-1");
      expect(apiKey.createdAt).toBeInstanceOf(Date);
      expect(apiKey.expiresAt).toBeInstanceOf(Date);
    });

    it("validates a generated API key", () => {
      const apiKey = generateApiKey("user-2", "operator");
      const result = validateAPIKey(apiKey.key);
      expect(result.authenticated).toBe(true);
      expect(result.user?.id).toBe("user-2");
      expect(result.user?.role).toBe("operator");
    });

    it("rejects an invalid API key", () => {
      const result = validateAPIKey("orun_invalidkey123");
      expect(result.authenticated).toBe(false);
      expect(result.error).toBe("Invalid API key");
    });

    it("revokes an API key", () => {
      const apiKey = generateApiKey("user-3", "viewer");
      expect(revokeAPIKey(apiKey.key)).toBe(true);
      const result = validateAPIKey(apiKey.key);
      expect(result.authenticated).toBe(false);
    });

    it("returns false when revoking a non-existent key", () => {
      expect(revokeAPIKey("orun_nonexistent")).toBe(false);
    });
  });

  describe("Session Tokens", () => {
    it("creates and verifies a valid session token", () => {
      const user = {
        id: "user-1",
        email: "test@example.com",
        name: "Test User",
        role: "admin" as const,
        organizationId: "org-1",
      };
      const token = createSessionToken(user);
      expect(token).toContain(".");

      const result = verifySessionToken(token);
      expect(result.authenticated).toBe(true);
      expect(result.user?.id).toBe("user-1");
      expect(result.user?.role).toBe("admin");
      expect(result.user?.organizationId).toBe("org-1");
    });

    it("rejects an invalid token", () => {
      const result = verifySessionToken("invalid.token");
      expect(result.authenticated).toBe(false);
    });

    it("rejects a token with wrong format", () => {
      const result = verifySessionToken("not-a-token");
      expect(result.authenticated).toBe(false);
      expect(result.error).toContain("Invalid token format");
    });
  });

  describe("extractBearerToken", () => {
    it("extracts token from Bearer header", () => {
      expect(extractBearerToken("Bearer abc123")).toBe("abc123");
    });

    it("handles case-insensitive Bearer prefix", () => {
      expect(extractBearerToken("bearer abc123")).toBe("abc123");
      expect(extractBearerToken("BEARER abc123")).toBe("abc123");
    });

    it("returns null for missing header", () => {
      expect(extractBearerToken(null)).toBeNull();
    });

    it("returns null for non-Bearer header", () => {
      expect(extractBearerToken("Basic abc123")).toBeNull();
    });
  });
});
