import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", async () => {
  const { mockDb } = await import("../../test/mocks/db");
  return { db: mockDb };
});

import { mockDb, resetDbMocks } from "../../test/mocks/db";
import { FollowUpAgent } from "./follow-up";

describe("FollowUpAgent", () => {
  const agent = new FollowUpAgent();

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
      { leadId: "lead-missing", actionType: "email", message: "Hello" },
      { agentId: "agent-1", runId: "run-1", model: "gpt-4o", temperature: 0.7, maxTokens: 4096 }
    );

    expect(result.status).toBe("failed");
    expect(result.error).toContain("Lead not found");
  });

  it("sends follow-up successfully", async () => {
    mockDb.lead.findUnique.mockResolvedValue({
      id: "lead-1",
      name: "Test Lead",
    });
    mockDb.leadEvent.findMany.mockResolvedValue([]);
    mockDb.leadEvent.create.mockResolvedValue({ id: "event-1" });

    const result = await agent.execute(
      { leadId: "lead-1", actionType: "email", message: "Follow-up message" },
      { agentId: "agent-1", runId: "run-1", model: "gpt-4o", temperature: 0.7, maxTokens: 4096 }
    );

    expect(result.status).toBe("completed");
    expect((result.output as Record<string, unknown>).actionExecuted).toBe(true);
    expect(mockDb.leadEvent.create).toHaveBeenCalled();
  });

  it("stops after max attempts", async () => {
    mockDb.lead.findUnique.mockResolvedValue({
      id: "lead-1",
      name: "Test Lead",
    });
    mockDb.leadEvent.findMany.mockResolvedValue([
      { id: "e1" }, { id: "e2" }, { id: "e3" }, { id: "e4" }, { id: "e5" },
    ]);

    const result = await agent.execute(
      { leadId: "lead-1", actionType: "email", message: "Hello" },
      { agentId: "agent-1", runId: "run-1", model: "gpt-4o", temperature: 0.7, maxTokens: 4096 }
    );

    expect(result.status).toBe("completed");
    expect((result.output as Record<string, unknown>).actionExecuted).toBe(false);
    expect((result.output as Record<string, unknown>).reason).toContain("Maximum");
  });
});
