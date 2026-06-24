import { createHmac } from "crypto";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const validate = vi.fn();
const get = vi.fn();
const executeAgent = vi.fn();

vi.mock("@/lib/agents", () => ({
  agentRegistry: { get },
  executeAgent,
}));

describe("POST /api/webhooks/leads", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    process.env.WEBHOOK_SECRET = "test-secret";
    validate.mockReturnValue({ valid: true });
    get.mockReturnValue({ validate });
    executeAgent.mockResolvedValue({
      runId: "run-1",
      result: {
        status: "completed",
        output: { leadId: "lead-1", duplicated: false },
      },
    });
  });

  it("executes the lead intake agent through the standard run pipeline", async () => {
    const body = JSON.stringify({
      name: "Maria Silva",
      email: "maria@example.com",
      source: "webhook",
    });
    const signature = createHmac("sha256", "test-secret")
      .update(body, "utf8")
      .digest("hex");

    const request = new NextRequest("http://localhost/api/webhooks/leads", {
      method: "POST",
      body,
      headers: { "x-webhook-signature": signature },
    });

    const { POST } = await import("./route");
    const response = await POST(request);
    const json = await response.json();

    expect(executeAgent).toHaveBeenCalledWith("lead-intake", {
      name: "Maria Silva",
      email: "maria@example.com",
      source: "webhook",
    });
    expect(response.status).toBe(201);
    expect(json).toEqual({
      success: true,
      data: { leadId: "lead-1", duplicated: false },
      runId: "run-1",
    });
  });
});
