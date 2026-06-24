import { createHmac } from "crypto";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

process.env.WEBHOOK_SECRET = "test-secret";

vi.mock("@/lib/agents", async () => {
  const { executeAgentMock, getAgentMock } = await import("../../../../test/mocks/agent-runtime");
  return {
    agentRegistry: { get: getAgentMock },
    executeAgent: executeAgentMock,
  };
});

import {
  executeAgentMock,
  getAgentMock,
  resetAgentRuntimeMocks,
  validateAgentInputMock,
} from "../../../../test/mocks/agent-runtime";

async function loadRoute() {
  return import("./route");
}

describe("POST /api/webhooks/leads", () => {
  beforeEach(() => {
    resetAgentRuntimeMocks();
    validateAgentInputMock.mockReturnValue({ valid: true });
    getAgentMock.mockReturnValue({ validate: validateAgentInputMock });
    executeAgentMock.mockResolvedValue({
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

    const { POST } = await loadRoute();
    const response = await POST(request);
    const json = await response.json();

    expect(executeAgentMock).toHaveBeenCalledWith("lead-intake", {
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

  it("rejects requests with invalid signatures", async () => {
    const request = new NextRequest("http://localhost/api/webhooks/leads", {
      method: "POST",
      body: JSON.stringify({ name: "Lead" }),
      headers: { "x-webhook-signature": "bad-signature" },
    });

    const { POST } = await loadRoute();
    const response = await POST(request);

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      success: false,
      error: "Invalid webhook signature",
    });
  });

  it("returns validation errors before executing the pipeline", async () => {
    const body = JSON.stringify({ email: "sem-nome@example.com" });
    const signature = createHmac("sha256", "test-secret")
      .update(body, "utf8")
      .digest("hex");
    validateAgentInputMock.mockReturnValue({
      valid: false,
      errors: ["name: Required"],
    });

    const request = new NextRequest("http://localhost/api/webhooks/leads", {
      method: "POST",
      body,
      headers: { "x-webhook-signature": signature },
    });

    const { POST } = await loadRoute();
    const response = await POST(request);

    expect(executeAgentMock).not.toHaveBeenCalled();
    expect(response.status).toBe(422);
    expect(await response.json()).toEqual({
      success: false,
      error: "Validation failed",
      details: ["name: Required"],
    });
  });

  it("returns execution failures from the standard pipeline", async () => {
    const body = JSON.stringify({ name: "Maria Silva" });
    const signature = createHmac("sha256", "test-secret")
      .update(body, "utf8")
      .digest("hex");
    executeAgentMock.mockResolvedValue({
      runId: "run-2",
      result: {
        status: "failed",
        error: "Validation failed in agent execution",
      },
    });

    const request = new NextRequest("http://localhost/api/webhooks/leads", {
      method: "POST",
      body,
      headers: { "x-webhook-signature": signature },
    });

    const { POST } = await loadRoute();
    const response = await POST(request);

    expect(response.status).toBe(422);
    expect(await response.json()).toEqual({
      success: false,
      error: "Validation failed in agent execution",
      runId: "run-2",
    });
  });
});
