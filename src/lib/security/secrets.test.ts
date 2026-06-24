import { describe, expect, it } from "vitest";
import {
  getSecretsPolicy,
  updateSecretsPolicy,
  validateSecretReference,
  createSecretRef,
  maskSecret,
  redactSecretsFromLog,
} from "./secrets";

describe("Security Secrets", () => {
  describe("Secrets Policy", () => {
    it("returns default policy", () => {
      const policy = getSecretsPolicy();
      expect(policy.allowDatabaseStorage).toBe(false);
      expect(policy.allowedLocations).toContain("env");
      expect(policy.requireEncryption).toBe(true);
      expect(policy.rotationIntervalDays).toBe(90);
    });

    it("updates policy", () => {
      const updated = updateSecretsPolicy({ rotationIntervalDays: 30 });
      expect(updated.rotationIntervalDays).toBe(30);
    });
  });

  describe("Secret Reference Validation", () => {
    it("validates a valid env reference", () => {
      const ref = createSecretRef("OPENAI_KEY", "env", "ORUN_OPENAI_KEY");
      const result = validateSecretReference(ref);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("rejects vault location when not allowed", () => {
      const ref = createSecretRef("db-password", "vault", "db_password");
      const result = validateSecretReference(ref);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("validates secret_manager location", () => {
      const ref = createSecretRef("api-key", "secret_manager", "api_key");
      const result = validateSecretReference(ref);
      expect(result.valid).toBe(true);
    });
  });

  describe("maskSecret", () => {
    it("masks a long secret", () => {
      expect(maskSecret("sk-1234567890abcdef")).toBe("sk***************ef");
    });

    it("masks a short secret", () => {
      expect(maskSecret("abc")).toBe("****");
    });

    it("returns empty string as-is", () => {
      expect(maskSecret("")).toBe("");
    });
  });

  describe("redactSecretsFromLog", () => {
    it("redacts API key patterns", () => {
      const log = 'api_key="sk-1234567890abcdef1234567890"';
      const redacted = redactSecretsFromLog(log);
      expect(redacted).not.toContain("sk-1234567890abcdef1234567890");
    });

    it("redacts Bearer tokens", () => {
      const log = "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.test.signature";
      const redacted = redactSecretsFromLog(log);
      expect(redacted).toContain("REDACTED_SECRET");
    });

    it("preserves non-secret content", () => {
      const log = "Processing lead lead-123 with name Maria";
      const redacted = redactSecretsFromLog(log);
      expect(redacted).toBe(log);
    });

    it("redacts token patterns", () => {
      const log = 'token: "abc123def456ghi789"';
      const redacted = redactSecretsFromLog(log);
      expect(redacted).toContain("REDACTED_SECRET");
    });
  });
});
