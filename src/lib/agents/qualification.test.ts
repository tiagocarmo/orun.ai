import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", async () => {
  const { mockDb } = await import("../../test/mocks/db");
  return { db: mockDb };
});

import { QualificationAgent } from "./qualification";
import { mockDb, resetDbMocks } from "../../test/mocks/db";

describe("QualificationAgent", () => {
  const agent = new QualificationAgent();

  beforeEach(() => {
    resetDbMocks();
  });

  it("fails validation when leadId is missing", async () => {
    const result = await agent.execute(
      {},
      {
        agentId: "agent-1",
        runId: "run-1",
        model: "gpt-4o",
        temperature: 0.2,
        maxTokens: 500,
      }
    );

    expect(mockDb.lead.findUnique).not.toHaveBeenCalled();
    expect(result).toEqual({
      status: "failed",
      error: "Validation failed: leadId: Required",
    });
  });

  it("returns a not found error when the lead does not exist", async () => {
    mockDb.lead.findUnique.mockResolvedValue(null);

    const result = await agent.execute(
      { leadId: "lead-missing" },
      {
        agentId: "agent-1",
        runId: "run-2",
        model: "gpt-4o",
        temperature: 0.2,
        maxTokens: 500,
      }
    );

    expect(result).toEqual({
      status: "failed",
      error: "Lead not found: lead-missing",
    });
  });

  it("scores, classifies, persists and logs a qualified lead", async () => {
    mockDb.lead.findUnique.mockResolvedValue({
      id: "lead-1",
      name: "Maria Silva",
      email: "maria@example.com",
      phone: "+5511999999999",
      company: "Orun",
      message: "Gostaria de entender como automatizar meu funil comercial.",
      source: "website",
    });
    mockDb.lead.update.mockResolvedValue({ id: "lead-1" });

    const result = await agent.execute(
      { leadId: "lead-1" },
      {
        agentId: "agent-1",
        runId: "run-3",
        model: "gpt-4o",
        temperature: 0.2,
        maxTokens: 500,
      }
    );

    expect(mockDb.lead.update).toHaveBeenCalledWith({
      where: { id: "lead-1" },
      data: {
        qualificationScore: 100,
        qualificationReason: [
          "Valid name provided",
          "Email provided",
          "Phone provided",
          "Company provided",
          "Detailed message provided",
          "Lead from source: website",
          "Full contact information available",
        ].join("; "),
        status: "qualified",
      },
    });
    expect(mockDb.leadEvent.create).toHaveBeenCalledWith({
      data: {
        leadId: "lead-1",
        type: "qualified",
        data: JSON.stringify({
          score: 100,
          classification: "qualified",
          reasoning: [
            "Valid name provided",
            "Email provided",
            "Phone provided",
            "Company provided",
            "Detailed message provided",
            "Lead from source: website",
            "Full contact information available",
          ],
          nextAction: "schedule-meeting",
          runId: "run-3",
          model: "gpt-4o",
        }),
      },
    });
    expect(result).toEqual({
      status: "completed",
      output: {
        leadId: "lead-1",
        score: 100,
        classification: "qualified",
        reasoning: [
          "Valid name provided",
          "Email provided",
          "Phone provided",
          "Company provided",
          "Detailed message provided",
          "Lead from source: website",
          "Full contact information available",
        ],
        nextAction: "schedule-meeting",
      },
    });
  });
});
