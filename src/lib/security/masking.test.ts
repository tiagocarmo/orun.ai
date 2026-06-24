import { describe, expect, it } from "vitest";
import {
  maskField,
  maskName,
  maskEmail,
  maskPhone,
  maskObject,
  maskPII,
  maskLogData,
} from "./masking";

describe("Security Masking", () => {
  describe("maskField", () => {
    it("masks email with partial strategy", () => {
      const result = maskField("user@example.com", "partial", "email");
      expect(result).toBe("u**r@example.com");
    });

    it("masks email with full strategy", () => {
      const result = maskField("user@example.com", "full", "email");
      expect(result).toBe("***@***");
    });

    it("masks phone with partial strategy", () => {
      const result = maskField("+5511999999999", "partial", "phone");
      expect(result).toMatch(/^\+55\*+999$/);
    });

    it("masks phone with full strategy", () => {
      const result = maskField("+5511999999999", "full", "phone");
      expect(result).toBe("*".repeat(14));
    });

    it("masks generic field with partial strategy", () => {
      const result = maskField("abcdef", "partial", "name");
      expect(result).toBe("a****f");
    });

    it("masks generic field with full strategy", () => {
      const result = maskField("abcdef", "full");
      expect(result).toBe("***");
    });

    it("masks with hash strategy", () => {
      const result = maskField("test-value", "hash");
      expect(result).toMatch(/^hash_[0-9a-f]+$/);
    });

    it("masks with redact strategy", () => {
      const result = maskField("secret data", "redact");
      expect(result).toBe("[REDACTED]");
    });

    it("returns empty string as-is", () => {
      expect(maskField("", "partial")).toBe("");
    });
  });

  describe("maskName", () => {
    it("partially masks a name", () => {
      expect(maskName("Maria")).toBe("M***a");
    });

    it("fully masks a name", () => {
      expect(maskName("Maria", "full")).toBe("***");
    });

    it("handles single char name", () => {
      expect(maskName("A")).toBe("*");
    });

    it("handles two char name", () => {
      expect(maskName("Jo")).toBe("J*");
    });

    it("hashes a name", () => {
      const result = maskName("Maria", "hash");
      expect(result).toMatch(/^hash_[0-9a-f]+$/);
    });
  });

  describe("maskEmail", () => {
    it("partially masks email", () => {
      expect(maskEmail("test@example.com")).toBe("t**t@example.com");
    });

    it("fully masks email", () => {
      expect(maskEmail("test@example.com", "full")).toBe("***@***");
    });

    it("handles short local part", () => {
      expect(maskEmail("ab@example.com")).toBe("ab@example.com");
    });
  });

  describe("maskPhone", () => {
    it("partially masks phone", () => {
      expect(maskPhone("+5511999999999")).toBe("+55********999");
    });

    it("fully masks phone", () => {
      expect(maskPhone("+5511999999999", "full")).toBe("*".repeat(14));
    });

    it("returns short phone as-is", () => {
      expect(maskPhone("123")).toBe("123");
    });
  });

  describe("maskObject", () => {
    it("masks specified fields", () => {
      const obj = { name: "Maria", email: "maria@test.com", age: 30 };
      const result = maskObject(obj, [
        { fieldName: "name", strategy: "partial" },
        { fieldName: "email", strategy: "partial" },
      ]);
      expect(result.name).toBe("M***a");
      expect(result.email).toBe("m***a@test.com");
      expect(result.age).toBe(30);
    });
  });

  describe("maskPII", () => {
    it("masks common PII fields", () => {
      const data = {
        name: "Maria Silva",
        email: "maria@example.com",
        phone: "+5511999999999",
        company: "Orun",
        externalId: "ext_123",
      };
      const masked = maskPII(data);
      expect(masked.name).not.toBe("Maria Silva");
      expect(masked.email).not.toBe("maria@example.com");
      expect(masked.phone).not.toBe("+5511999999999");
      expect(masked.company).not.toBe("Orun");
      expect(masked.externalId).toMatch(/^hash_/);
    });
  });

  describe("maskLogData", () => {
    it("masks and redacts log data", () => {
      const data = {
        name: "Maria",
        email: "maria@test.com",
        message: "sensitive content here",
        token: "secret-token-123",
      };
      const masked = maskLogData(data);
      expect(masked.name).not.toBe("Maria");
      expect(masked.email).not.toBe("maria@test.com");
      expect(masked.message).toBe("[REDACTED]");
      expect(masked.token).toBe("***");
    });
  });
});
