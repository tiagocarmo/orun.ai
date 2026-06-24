import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", async () => {
  const { mockDb } = await import("../../test/mocks/db");
  return { db: mockDb };
});

vi.mock("@/lib/agents", async () => {
  const { executeAgentMock } = await import("../../test/mocks/agent-runtime");
  return { executeAgent: executeAgentMock };
});

import { mockDb, resetDbMocks } from "../../test/mocks/db";
import { executeAgentMock, resetAgentRuntimeMocks } from "../../test/mocks/agent-runtime";
import {
  startWorkflow,
  pauseWorkflow,
  resumeWorkflow,
  cancelWorkflow,
  getWorkflowRun,
} from "./engine";

describe("WorkflowEngine", () => {
  beforeEach(() => {
    resetDbMocks();
    resetAgentRuntimeMocks();
  });

  const mockWorkflow = {
    id: "wf-1",
    name: "Lead Qualification",
    slug: "lead-qualification",
    description: "Qualify a lead",
    steps: JSON.stringify([
      {
        id: "step-1",
        agentSlug: "qualification",
        inputMapping: { leadId: "$input.leadId" },
      },
    ]),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRun = {
    id: "run-1",
    workflowId: "wf-1",
    status: "running",
    input: JSON.stringify({ leadId: "lead-1" }),
    output: null,
    error: null,
    context: "[]",
    startedAt: new Date(),
    completedAt: null,
    createdAt: new Date(),
  };

  describe("startWorkflow", () => {
    it("creates a run and executes steps", async () => {
      mockDb.workflow.findUnique.mockResolvedValue(mockWorkflow);
      mockDb.workflowRun.create.mockResolvedValue(mockRun);
      mockDb.workflowRun.findUnique.mockResolvedValue(mockRun);
      mockDb.workflowRun.update.mockResolvedValue({ ...mockRun, status: "completed" });
      executeAgentMock.mockResolvedValue({
        runId: "agent-run-1",
        result: {
          status: "completed",
          output: { score: 85, classification: "qualified" },
        },
      });

      const result = await startWorkflow("wf-1", { leadId: "lead-1" });

      expect(result.status).toBe("completed");
      expect(result.output).toEqual({ score: 85, classification: "qualified" });
      expect(result.stepLogs).toHaveLength(1);
      expect(result.stepLogs[0].status).toBe("completed");
      expect(executeAgentMock).toHaveBeenCalledWith("qualification", { leadId: "lead-1" });
    });

    it("returns failed status when agent fails", async () => {
      mockDb.workflow.findUnique.mockResolvedValue(mockWorkflow);
      mockDb.workflowRun.create.mockResolvedValue(mockRun);
      mockDb.workflowRun.findUnique.mockResolvedValue(mockRun);
      mockDb.workflowRun.update.mockResolvedValue({ ...mockRun, status: "failed" });
      executeAgentMock.mockResolvedValue({
        runId: "agent-run-1",
        result: {
          status: "failed",
          error: "Agent error",
        },
      });

      const result = await startWorkflow("wf-1", { leadId: "lead-1" });

      expect(result.status).toBe("failed");
      expect(result.error).toBe("Agent error");
    });

    it("throws when workflow not found", async () => {
      mockDb.workflow.findUnique.mockResolvedValue(null);

      await expect(startWorkflow("wf-missing", {})).rejects.toThrow(
        "Workflow 'wf-missing' not found"
      );
    });

    it("throws when workflow is inactive", async () => {
      mockDb.workflow.findUnique.mockResolvedValue({ ...mockWorkflow, isActive: false });

      await expect(startWorkflow("wf-1", {})).rejects.toThrow(
        "Workflow 'wf-1' is not active"
      );
    });
  });

  describe("pauseWorkflow", () => {
    it("pauses a running workflow", async () => {
      mockDb.workflowRun.findUnique.mockResolvedValue(mockRun);
      mockDb.workflowRun.update.mockResolvedValue({ ...mockRun, status: "paused" });

      await pauseWorkflow("run-1");

      expect(mockDb.workflowRun.update).toHaveBeenCalledWith({
        where: { id: "run-1" },
        data: { status: "paused" },
      });
    });

    it("throws when workflow is not running", async () => {
      mockDb.workflowRun.findUnique.mockResolvedValue({ ...mockRun, status: "completed" });

      await expect(pauseWorkflow("run-1")).rejects.toThrow(
        "Cannot pause workflow in status 'completed'"
      );
    });

    it("throws when run not found", async () => {
      mockDb.workflowRun.findUnique.mockResolvedValue(null);

      await expect(pauseWorkflow("run-missing")).rejects.toThrow(
        "WorkflowRun 'run-missing' not found"
      );
    });
  });

  describe("resumeWorkflow", () => {
    it("resumes a paused workflow", async () => {
      mockDb.workflowRun.findUnique
        .mockResolvedValueOnce({ ...mockRun, status: "paused" })
        .mockResolvedValueOnce({ ...mockRun, status: "running" });
      mockDb.workflow.findUnique.mockResolvedValue(mockWorkflow);
      mockDb.workflowRun.update.mockResolvedValue({ ...mockRun, status: "completed" });
      executeAgentMock.mockResolvedValue({
        runId: "agent-run-1",
        result: {
          status: "completed",
          output: { score: 70, classification: "qualified" },
        },
      });

      const result = await resumeWorkflow("run-1");

      expect(result.status).toBe("completed");
      expect(executeAgentMock).toHaveBeenCalled();
    });

    it("throws when workflow is not paused", async () => {
      mockDb.workflowRun.findUnique.mockResolvedValue({ ...mockRun, status: "running" });

      await expect(resumeWorkflow("run-1")).rejects.toThrow(
        "Cannot resume workflow in status 'running'"
      );
    });
  });

  describe("cancelWorkflow", () => {
    it("cancels a running workflow", async () => {
      mockDb.workflowRun.findUnique.mockResolvedValue(mockRun);
      mockDb.workflowRun.update.mockResolvedValue({ ...mockRun, status: "cancelled" });

      await cancelWorkflow("run-1");

      expect(mockDb.workflowRun.update).toHaveBeenCalledWith({
        where: { id: "run-1" },
        data: { status: "cancelled" },
      });
    });

    it("throws when workflow is already completed", async () => {
      mockDb.workflowRun.findUnique.mockResolvedValue({ ...mockRun, status: "completed" });

      await expect(cancelWorkflow("run-1")).rejects.toThrow(
        "Cannot cancel workflow in status 'completed'"
      );
    });
  });

  describe("getWorkflowRun", () => {
    it("returns run details", async () => {
      mockDb.workflowRun.findUnique.mockResolvedValue({
        ...mockRun,
        status: "completed",
        output: JSON.stringify({ score: 85 }),
        context: JSON.stringify([
          { stepId: "step-1", agentSlug: "qualification", status: "completed" },
        ]),
      });

      const result = await getWorkflowRun("run-1");

      expect(result).not.toBeNull();
      expect(result!.status).toBe("completed");
      expect(result!.output).toEqual({ score: 85 });
      expect(result!.stepLogs).toHaveLength(1);
    });

    it("returns null when run not found", async () => {
      mockDb.workflowRun.findUnique.mockResolvedValue(null);

      const result = await getWorkflowRun("run-missing");

      expect(result).toBeNull();
    });
  });
});
