import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", async () => {
  const { mockDb } = await import("../../test/mocks/db");
  return { db: mockDb };
});

import { mockDb, resetDbMocks } from "../../test/mocks/db";
import { HumanHandoffAgent } from "./human-handoff";

describe("HumanHandoffAgent", () => {
  const agent = new HumanHandoffAgent();

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
      { leadId: "lead-missing", reason: "Low confidence" },
      { agentId: "agent-1", runId: "run-1", model: "gpt-4o", temperature: 0.7, maxTokens: 4096 }
    );

    expect(result.status).toBe("failed");
    expect(result.error).toContain("Lead not found");
  });

  it("escalates lead successfully", async () => {
    mockDb.lead.findUnique.mockResolvedValue({
      id: "lead-1",
      name: "Test Lead",
      qualificationScore: 50,
      status: "new",
    });
    mockDb.leadEvent.create.mockResolvedValue({ id: "event-1" });
    mockDb.lead.update.mockResolvedValue({ id: "lead-1" });

    const result = await agent.execute(
      { leadId: "lead-1", reason: "Customer requested human assistance" },
      { agentId: "agent-1", runId: "run-1", model: "gpt-4o", temperature: 0.7, maxTokens: 4096 }
    );

    expect(result.status).toBe("completed");
    expect((result.output as Record<string, unknown>).escalated).toBe(true);
    expect(mockDb.leadEvent.create).toHaveBeenCalled();
    expect(mockDb.lead.update).toHaveBeenCalled();
  });

  it("sets high priority for legal/financial reasons", async () => {
    mockDb.lead.findUnique.mockResolvedValue({
      id: "lead-1",
      name: "Test Lead",
      qualificationScore: 50,
      status: "new",
    });
    mockDb.leadEvent.create.mockResolvedValue({ id: "event-1" });
    mockDb.lead.update.mockResolvedValue({ id: "lead-1" });

    const result = await agent.execute(
      { leadId: "lead-1", reason: "Legal contract question" },
      { agentId: "agent-1", runId: "run-1", model: "gpt-4o", temperature: 0.7, maxTokens: 4096 }
    );

    expect(result.status).toBe("completed");
    expect((result.output as Record<string, unknown>).priority).toBe("high");
  });
});
