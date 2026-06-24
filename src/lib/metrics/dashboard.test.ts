import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", async () => {
  const { mockDb } = await import("../../test/mocks/db");
  return { db: mockDb };
});

import { mockDb, resetDbMocks } from "../../test/mocks/db";
import {
  getDashboardMetrics,
  getLeadMetrics,
  getAgentMetrics,
  getWorkflowMetrics,
  getConversationMetrics,
} from "./dashboard";

describe("Dashboard Metrics", () => {
  beforeEach(() => {
    resetDbMocks();
  });

  describe("getLeadMetrics", () => {
    it("returns lead metrics with status breakdown", async () => {
      mockDb.lead.count.mockResolvedValueOnce(42);
      mockDb.lead.groupBy.mockResolvedValue([
        { status: "new", _count: 10 },
        { status: "qualified", _count: 20 },
        { status: "disqualified", _count: 12 },
      ]);
      mockDb.lead.count.mockResolvedValueOnce(5);

      const metrics = await getLeadMetrics();
      expect(metrics.total).toBe(42);
      expect(metrics.byStatus).toEqual({ new: 10, qualified: 20, disqualified: 12 });
      expect(metrics.recentCount).toBe(5);
    });
  });

  describe("getAgentMetrics", () => {
    it("returns agent run metrics", async () => {
      mockDb.agentRun.count
        .mockResolvedValueOnce(100)
        .mockResolvedValueOnce(85)
        .mockResolvedValueOnce(15);

      mockDb.agentRun.findMany.mockResolvedValue([
        { durationMs: 1000, tokensConsumed: 500 },
        { durationMs: 2000, tokensConsumed: 1000 },
      ]);

      mockDb.agentRun.groupBy.mockResolvedValue([
        { agentId: "agent-1", _count: 60 },
        { agentId: "agent-2", _count: 40 },
      ]);

      mockDb.agent.findMany.mockResolvedValue([
        { id: "agent-1", slug: "qualification" },
        { id: "agent-2", slug: "scheduling" },
      ]);

      const metrics = await getAgentMetrics();
      expect(metrics.totalRuns).toBe(100);
      expect(metrics.successfulRuns).toBe(85);
      expect(metrics.failedRuns).toBe(15);
      expect(metrics.avgDurationMs).toBe(1500);
      expect(metrics.totalTokensConsumed).toBe(1500);
      expect(metrics.runsByAgent).toEqual([
        { agentSlug: "qualification", count: 60 },
        { agentSlug: "scheduling", count: 40 },
      ]);
    });
  });

  describe("getWorkflowMetrics", () => {
    it("returns workflow run metrics", async () => {
      mockDb.workflowRun.count
        .mockResolvedValueOnce(50)
        .mockResolvedValueOnce(45)
        .mockResolvedValueOnce(5);
      mockDb.workflow.count.mockResolvedValue(3);

      const metrics = await getWorkflowMetrics();
      expect(metrics.totalRuns).toBe(50);
      expect(metrics.successfulRuns).toBe(45);
      expect(metrics.failedRuns).toBe(5);
      expect(metrics.activeWorkflows).toBe(3);
    });
  });

  describe("getConversationMetrics", () => {
    it("returns conversation metrics", async () => {
      mockDb.conversation.count
        .mockResolvedValueOnce(30)
        .mockResolvedValueOnce(12);

      const metrics = await getConversationMetrics();
      expect(metrics.totalConversations).toBe(30);
      expect(metrics.activeConversations).toBe(12);
    });
  });

  describe("getDashboardMetrics", () => {
    it("aggregates all metrics", async () => {
      mockDb.lead.count.mockResolvedValue(10);
      mockDb.lead.groupBy.mockResolvedValue([]);
      mockDb.lead.count.mockResolvedValue(2);
      mockDb.agentRun.count.mockResolvedValue(0);
      mockDb.agentRun.findMany.mockResolvedValue([]);
      mockDb.agentRun.groupBy.mockResolvedValue([]);
      mockDb.agent.findMany.mockResolvedValue([]);
      mockDb.workflowRun.count.mockResolvedValue(0);
      mockDb.workflow.count.mockResolvedValue(0);
      mockDb.conversation.count.mockResolvedValue(0);

      const metrics = await getDashboardMetrics();
      expect(metrics).toHaveProperty("leads");
      expect(metrics).toHaveProperty("agents");
      expect(metrics).toHaveProperty("workflows");
      expect(metrics).toHaveProperty("conversations");
      expect(metrics).toHaveProperty("generatedAt");
    });
  });
});
