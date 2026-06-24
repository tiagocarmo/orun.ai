import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", async () => {
  const { mockDb } = await import("../../test/mocks/db");
  return { db: mockDb };
});

import { mockDb, resetDbMocks } from "../../test/mocks/db";
import { DocumentAgent } from "./document";

describe("DocumentAgent", () => {
  const agent = new DocumentAgent();

  beforeEach(() => {
    resetDbMocks();
  });

  it("fails validation when leadId is missing", async () => {
    const result = await agent.execute(
      {},
      { agentId: "agent-1", runId: "run-1", model: "gpt-4o", temperature: 0.7, maxTokens: 4096 }
    );

    expect(result.status).toBe("failed");
    expect(result.error).toContain("Validation failed");
  });

  it("returns error when lead not found", async () => {
    mockDb.lead.findUnique.mockResolvedValue(null);

    const result = await agent.execute(
      { leadId: "lead-missing", templateType: "proposal" },
      { agentId: "agent-1", runId: "run-1", model: "gpt-4o", temperature: 0.7, maxTokens: 4096 }
    );

    expect(result.status).toBe("failed");
    expect(result.error).toContain("Lead not found");
  });

  it("generates document successfully", async () => {
    mockDb.lead.findUnique.mockResolvedValue({
      id: "lead-1",
      name: "Test Lead",
      email: "test@example.com",
      company: "Acme Corp",
    });
    mockDb.document.create.mockResolvedValue({ id: "doc-1" });
    mockDb.leadEvent.create.mockResolvedValue({ id: "event-1" });

    const result = await agent.execute(
      { leadId: "lead-1", templateType: "proposal" },
      { agentId: "agent-1", runId: "run-1", model: "gpt-4o", temperature: 0.7, maxTokens: 4096 }
    );

    expect(result.status).toBe("completed");
    expect(result.output).toBeDefined();
    expect((result.output as Record<string, unknown>).documentId).toBeDefined();
    expect(mockDb.document.create).toHaveBeenCalled();
    expect(mockDb.leadEvent.create).toHaveBeenCalled();
  });
});
