import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", async () => {
  const { mockDb } = await import("../../test/mocks/db");
  return { db: mockDb };
});

vi.mock("@/lib/agents", async () => {
  const { executeAgentMock } = await import("../../test/mocks/agent-runtime");
  const { agentRegistry } = await import("../../lib/agents/registry");
  return { executeAgent: executeAgentMock, agentRegistry };
});

import { resetDbMocks } from "../../test/mocks/db";
import { executeAgentMock, resetAgentRuntimeMocks } from "../../test/mocks/agent-runtime";
import { agentRegistry } from "../../lib/agents/registry";
import { orchestrate } from "./orchestrator";
import { createPlan } from "./planner";
import { createContext, resolveInput } from "./context";
import { executePlan } from "./executor";
import { consolidateResults } from "./consolidator";

describe("Orchestrator", () => {
  beforeEach(() => {
    resetDbMocks();
    resetAgentRuntimeMocks();
  });

  const mockAgentDef = {
    slug: "qualification",
    name: "Qualification Agent",
    description: "Qualifies leads",
  };

  describe("createPlan", () => {
    it("creates a plan with steps based on objective", () => {
      const plan = createPlan("Qualify the lead", [mockAgentDef], { leadId: "lead-1" });

      expect(plan.objective).toBe("Qualify the lead");
      expect(plan.steps.length).toBeGreaterThan(0);
      expect(plan.steps[0].agentSlug).toBe("qualification");
    });

    it("creates empty plan when no matching agents", () => {
      const plan = createPlan("Do something unrelated", [], {});

      expect(plan.steps.length).toBe(0);
    });
  });

  describe("resolveInput", () => {
    it("resolves $input references", () => {
      const context = createContext({ leadId: "lead-123" });
      const resolved = resolveInput({ leadId: "$input.leadId" }, context);

      expect(resolved.leadId).toBe("lead-123");
    });

    it("resolves static values", () => {
      const context = createContext({});
      const resolved = resolveInput({ name: "test" }, context);

      expect(resolved.name).toBe("test");
    });
  });

  describe("executePlan", () => {
    it("executes steps sequentially", async () => {
      executeAgentMock.mockResolvedValue({
        runId: "agent-run-1",
        result: {
          status: "completed",
          output: { score: 85 },
        },
      });

      const plan = createPlan("Qualify the lead", [mockAgentDef], { leadId: "lead-1" });
      const context = createContext({ leadId: "lead-1" });

      const { stepResults } = await executePlan(plan, context);

      expect(stepResults.length).toBeGreaterThan(0);
      expect(stepResults[0].status).toBe("completed");
      expect(executeAgentMock).toHaveBeenCalled();
    });

    it("stops on required step failure", async () => {
      executeAgentMock.mockResolvedValue({
        runId: "agent-run-1",
        result: {
          status: "failed",
          error: "Agent failed",
        },
      });

      const plan = createPlan("Qualify the lead", [mockAgentDef], { leadId: "lead-1" });
      const context = createContext({ leadId: "lead-1" });

      const { stepResults } = await executePlan(plan, context);

      expect(stepResults[0].status).toBe("failed");
    });
  });

  describe("consolidateResults", () => {
    it("consolidates completed steps", () => {
      const plan = createPlan("Qualify the lead", [mockAgentDef], { leadId: "lead-1" });
      const stepResults = [
        {
          stepId: plan.steps[0].id,
          status: "completed" as const,
          input: {},
          output: { score: 85 },
        },
      ];

      const result = consolidateResults(plan, stepResults, 1000);

      expect(result.status).toBe("completed");
      expect(result.output).toBeDefined();
      expect(result.summary).toContain("1 completed");
    });

    it("handles partial failures", () => {
      const plan = createPlan("Qualify the lead", [mockAgentDef], { leadId: "lead-1" });
      const stepResults = [
        {
          stepId: plan.steps[0].id,
          status: "failed" as const,
          input: {},
          error: "Failed",
        },
      ];

      const result = consolidateResults(plan, stepResults, 1000);

      expect(result.status).toBe("failed");
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe("orchestrate", () => {
    it("orchestrates a complete execution", async () => {
      agentRegistry.register({
        definition: () => mockAgentDef,
        validate: () => ({ valid: true }),
        execute: async () => ({
          status: "completed",
          output: { score: 85, classification: "qualified" },
        }),
      } as unknown as Parameters<typeof agentRegistry.register>[0]);

      executeAgentMock.mockResolvedValue({
        runId: "agent-run-1",
        result: {
          status: "completed",
          output: { score: 85, classification: "qualified" },
        },
      });

      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const result = await orchestrate("Qualify the lead", { leadId: "lead-1" });

      expect(result.status).toBe("completed");
      expect(result.stepResults.length).toBeGreaterThan(0);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
