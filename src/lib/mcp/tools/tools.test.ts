import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", async () => {
  const { mockDb } = await import("../../../test/mocks/db");
  return { db: mockDb };
});

import { resetDbMocks } from "../../../test/mocks/db";
import { callTool, callToolWithRetry, getExecutionLogs, clearExecutionLogs } from "../client";
import { mcpRegistry } from "../registry";
import { CheckAvailabilityTool, CreateEventTool } from "./calendar";
import { GenerateDocumentTool, ReadDocumentTool } from "./document";

describe("MCP Tools", () => {
  beforeEach(() => {
    resetDbMocks();
    clearExecutionLogs();
    mcpRegistry.register(new CheckAvailabilityTool());
    mcpRegistry.register(new CreateEventTool());
    mcpRegistry.register(new GenerateDocumentTool());
    mcpRegistry.register(new ReadDocumentTool());
  });

  describe("CheckAvailabilityTool", () => {
    it("returns available slots for a date range", async () => {
      const result = await callTool("calendar-check-availability", {
        date: "2024-01-15",
        startTime: "09:00",
        endTime: "17:00",
        durationMinutes: 30,
      });

      expect(result.isError).toBeFalsy();
      const data = JSON.parse(result.content[0].text!);
      expect(data.date).toBe("2024-01-15");
      expect(data.availableSlots).toBeDefined();
      expect(Array.isArray(data.availableSlots)).toBe(true);
    });

    it("returns error for missing fields", async () => {
      const result = await callTool("calendar-check-availability", {});

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("Missing required fields");
    });
  });

  describe("CreateEventTool", () => {
    it("creates a stub event", async () => {
      const result = await callTool("calendar-create-event", {
        title: "Meeting with Client",
        date: "2024-01-15",
        startTime: "10:00",
        endTime: "11:00",
        description: "Discuss project requirements",
      });

      expect(result.isError).toBeFalsy();
      const data = JSON.parse(result.content[0].text!);
      expect(data.eventId).toBeDefined();
      expect(data.title).toBe("Meeting with Client");
      expect(data.isStub).toBe(true);
    });

    it("returns error for missing fields", async () => {
      const result = await callTool("calendar-create-event", {});

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("Missing required fields");
    });
  });

  describe("GenerateDocumentTool", () => {
    it("generates a proposal document", async () => {
      const result = await callTool("document-generate", {
        template: "proposal",
        data: {
          companyName: "Acme Corp",
          contactName: "John Doe",
          contactEmail: "john@acme.com",
          scope: "Web development",
          value: "50,000",
        },
      });

      expect(result.isError).toBeFalsy();
      const data = JSON.parse(result.content[0].text!);
      expect(data.documentId).toBeDefined();
      expect(data.template).toBe("proposal");
      expect(data.content).toContain("Acme Corp");
    });

    it("generates HTML format", async () => {
      const result = await callTool("document-generate", {
        template: "summary",
        data: { leadName: "Test Lead", status: "qualified" },
        format: "html",
      });

      expect(result.isError).toBeFalsy();
      const data = JSON.parse(result.content[0].text!);
      expect(data.format).toBe("html");
      expect(data.content).toContain("<!DOCTYPE html>");
    });

    it("returns error for missing fields", async () => {
      const result = await callTool("document-generate", {});

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("Missing required fields");
    });
  });

  describe("ReadDocumentTool", () => {
    it("reads a document stub", async () => {
      const result = await callTool("document-read", {
        documentId: "doc-123",
      });

      expect(result.isError).toBeFalsy();
      const data = JSON.parse(result.content[0].text!);
      expect(data.documentId).toBe("doc-123");
      expect(data.isStub).toBe(true);
    });

    it("returns error for missing documentId", async () => {
      const result = await callTool("document-read", {});

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("Missing required field");
    });
  });

  describe("callTool", () => {
    it("returns error for unknown tool", async () => {
      const result = await callTool("unknown-tool", {});

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("not found");
    });

    it("logs execution", async () => {
      await callTool("document-read", { documentId: "doc-1" });

      const logs = getExecutionLogs("document-read");
      expect(logs.length).toBe(1);
      expect(logs[0].toolName).toBe("document-read");
      expect(logs[0].durationMs).toBeGreaterThanOrEqual(0);
    });
  });

  describe("callToolWithRetry", () => {
    it("retries on failure", async () => {
      let callCount = 0;
      const originalExecute = ReadDocumentTool.prototype.execute;

      ReadDocumentTool.prototype.execute = async () => {
        callCount++;
        if (callCount < 3) {
          return { content: [{ type: "text", text: "Temporary error" }], isError: true };
        }
        return { content: [{ type: "text", text: '{"success": true}' }], isError: false };
      };

      const result = await callToolWithRetry("document-read", { documentId: "doc-1" }, {
        maxRetries: 3,
        retryDelayMs: 10,
      });

      expect(result.isError).toBeFalsy();
      expect(callCount).toBe(3);

      ReadDocumentTool.prototype.execute = originalExecute;
    });

    it("fails after max retries", async () => {
      const originalExecute = ReadDocumentTool.prototype.execute;

      ReadDocumentTool.prototype.execute = async () => {
        return { content: [{ type: "text", text: "Persistent error" }], isError: true };
      };

      const result = await callToolWithRetry("document-read", { documentId: "doc-1" }, {
        maxRetries: 2,
        retryDelayMs: 10,
      });

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("failed after");

      ReadDocumentTool.prototype.execute = originalExecute;
    });
  });
});
