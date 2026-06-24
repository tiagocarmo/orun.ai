import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/agents/engine", async () => {
  const { executeAgentMock } = await import("../../test/mocks/agent-runtime");
  return { executeAgent: executeAgentMock };
});

vi.mock("next/cache", async () => {
  const { revalidatePath } = await import("../../test/mocks/next-cache");
  return { revalidatePath };
});

import { runAgent } from "./runs";
import { executeAgentMock, resetAgentRuntimeMocks } from "../../test/mocks/agent-runtime";
import { revalidatePath, resetNextCacheMocks } from "../../test/mocks/next-cache";

describe("runAgent", () => {
  beforeEach(() => {
    resetAgentRuntimeMocks();
    resetNextCacheMocks();
  });

  it("returns validation details when input is invalid", async () => {
    const result = await runAgent("qualification", [] as unknown as Record<string, unknown>);

    expect(executeAgentMock).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      error: "Validation failed",
      details: {
        input: expect.any(Array),
      },
    });
  });

  it("executes the agent and normalizes the response payload", async () => {
    executeAgentMock.mockResolvedValue({
      runId: "run-1",
      result: {
        status: "completed",
        output: { leadId: "lead-1" },
        durationMs: 321,
        tokensConsumed: 123,
      },
    });

    const result = await runAgent("qualification", { leadId: "lead-1" });

    expect(executeAgentMock).toHaveBeenCalledWith("qualification", {
      leadId: "lead-1",
    });
    expect(revalidatePath).toHaveBeenCalledWith("/");
    expect(result).toEqual({
      success: true,
      data: {
        runId: "run-1",
        status: "completed",
        output: { leadId: "lead-1" },
        error: undefined,
        durationMs: 321,
        tokensConsumed: 123,
      },
    });
  });

  it("returns execution errors without revalidating the UI", async () => {
    executeAgentMock.mockRejectedValue(new Error("engine failure"));

    const result = await runAgent("qualification", { leadId: "lead-1" });

    expect(revalidatePath).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      error: "engine failure",
    });
  });
});
