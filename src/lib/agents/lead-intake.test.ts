import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockDb } = vi.hoisted(() => ({
  mockDb: {
    lead: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
    },
    leadEvent: {
      create: vi.fn(),
    },
  },
}));

vi.mock("@/lib/db", () => ({
  db: mockDb,
}));

import { LeadIntakeAgent } from "./lead-intake";

describe("LeadIntakeAgent", () => {
  const agent = new LeadIntakeAgent();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deduplicates by externalId even when metadata contains extra fields", async () => {
    mockDb.lead.findMany.mockResolvedValue([
      {
        id: "lead-existing",
        metadata: JSON.stringify({ externalId: "ext-1", channel: "meta" }),
      },
    ]);

    const result = await agent.execute(
      {
        name: "Lead Duplicado",
        externalId: "ext-1",
        metadata: { channel: "meta", campaign: "launch" },
      },
      {
        agentId: "agent-1",
        runId: "run-1",
        model: "gpt-4o",
        temperature: 0.2,
        maxTokens: 500,
      }
    );

    expect(result).toEqual({
      status: "completed",
      output: {
        leadId: "lead-existing",
        duplicated: true,
        message: "Lead already exists with this external ID",
      },
    });
    expect(mockDb.leadEvent.create).toHaveBeenCalledWith({
      data: {
        leadId: "lead-existing",
        type: "intake_duplicate_detected",
        data: JSON.stringify({
          identifier: "externalId",
          value: "ext-1",
          runId: "run-1",
        }),
      },
    });
  });

  it("records a created event with run correlation for new leads", async () => {
    mockDb.lead.findMany.mockResolvedValue([]);
    mockDb.lead.create.mockResolvedValue({ id: "lead-new" });

    const result = await agent.execute(
      {
        name: "Lead Novo",
        email: "novo@example.com",
        externalId: "ext-2",
        source: "landing-page",
        metadata: { channel: "meta" },
      },
      {
        agentId: "agent-1",
        runId: "run-2",
        model: "gpt-4o",
        temperature: 0.2,
        maxTokens: 500,
      }
    );

    expect(mockDb.lead.create).toHaveBeenCalledWith({
      data: {
        name: "Lead Novo",
        email: "novo@example.com",
        phone: null,
        company: null,
        source: "landing-page",
        message: null,
        status: "new",
        metadata: JSON.stringify({ externalId: "ext-2", channel: "meta" }),
      },
    });
    expect(mockDb.leadEvent.create).toHaveBeenCalledWith({
      data: {
        leadId: "lead-new",
        type: "created",
        data: JSON.stringify({
          source: "landing-page",
          externalId: "ext-2",
          metadata: { channel: "meta" },
          runId: "run-2",
          agent: "lead-intake",
        }),
      },
    });
    expect(result).toEqual({
      status: "completed",
      output: {
        leadId: "lead-new",
        duplicated: false,
        nextAction: "qualification",
        message: "Lead created successfully",
      },
    });
  });
});
