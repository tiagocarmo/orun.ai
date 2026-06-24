import { db } from "@/lib/db";

export interface DashboardMetrics {
  leads: LeadMetrics;
  agents: AgentMetrics;
  workflows: WorkflowMetrics;
  conversations: ConversationMetrics;
  generatedAt: string;
}

export interface LeadMetrics {
  total: number;
  byStatus: Record<string, number>;
  recentCount: number;
}

export interface AgentMetrics {
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  avgDurationMs: number;
  totalTokensConsumed: number;
  runsByAgent: { agentSlug: string; count: number }[];
}

export interface WorkflowMetrics {
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  activeWorkflows: number;
}

export interface ConversationMetrics {
  totalConversations: number;
  activeConversations: number;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const [leads, agentRuns, workflows, conversations] = await Promise.all([
    getLeadMetrics(),
    getAgentMetrics(),
    getWorkflowMetrics(),
    getConversationMetrics(),
  ]);

  return {
    leads,
    agents: agentRuns,
    workflows,
    conversations,
    generatedAt: new Date().toISOString(),
  };
}

export async function getLeadMetrics(): Promise<LeadMetrics> {
  const total = await db.lead.count({ where: { deletedAt: null } });

  const statusGroups = await db.lead.groupBy({
    by: ["status"],
    where: { deletedAt: null },
    _count: true,
  });

  const byStatus: Record<string, number> = {};
  for (const group of statusGroups) {
    byStatus[group.status] = group._count;
  }

  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentCount = await db.lead.count({
    where: { deletedAt: null, createdAt: { gte: oneWeekAgo } },
  });

  return { total, byStatus, recentCount };
}

export async function getAgentMetrics(): Promise<AgentMetrics> {
  const totalRuns = await db.agentRun.count();
  const successfulRuns = await db.agentRun.count({ where: { status: "completed" } });
  const failedRuns = await db.agentRun.count({ where: { status: "failed" } });

  const runsWithDuration = await db.agentRun.findMany({
    where: { durationMs: { not: null } },
    select: { durationMs: true, tokensConsumed: true },
  });

  const avgDurationMs =
    runsWithDuration.length > 0
      ? Math.round(runsWithDuration.reduce((sum, r) => sum + (r.durationMs ?? 0), 0) / runsWithDuration.length)
      : 0;

  const totalTokensConsumed =
    runsWithDuration.reduce((sum, r) => sum + (r.tokensConsumed ?? 0), 0);

  const runsByAgent = await db.agentRun.groupBy({
    by: ["agentId"],
    _count: true,
    orderBy: { _count: { agentId: "desc" } },
  });

  const agentSlugs = await db.agent.findMany({
    select: { id: true, slug: true },
  });

  const slugMap = new Map(agentSlugs.map((a) => [a.id, a.slug]));

  const runsByAgentFormatted = runsByAgent.map((r) => ({
    agentSlug: slugMap.get(r.agentId) ?? r.agentId,
    count: r._count,
  }));

  return {
    totalRuns,
    successfulRuns,
    failedRuns,
    avgDurationMs,
    totalTokensConsumed,
    runsByAgent: runsByAgentFormatted,
  };
}

export async function getWorkflowMetrics(): Promise<WorkflowMetrics> {
  const totalRuns = await db.workflowRun.count();
  const successfulRuns = await db.workflowRun.count({ where: { status: "completed" } });
  const failedRuns = await db.workflowRun.count({ where: { status: "failed" } });
  const activeWorkflows = await db.workflow.count({ where: { isActive: true } });

  return { totalRuns, successfulRuns, failedRuns, activeWorkflows };
}

export async function getConversationMetrics(): Promise<ConversationMetrics> {
  const totalConversations = await db.conversation.count();
  const activeConversations = await db.conversation.count({ where: { status: "active" } });

  return { totalConversations, activeConversations };
}

export async function getRecentAgentRuns(limit = 10) {
  return db.agentRun.findMany({
    include: { agent: true, logs: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getAgentRunsBySlug(slug: string, limit = 10) {
  const agent = await db.agent.findUnique({ where: { slug } });
  if (!agent) return [];

  return db.agentRun.findMany({
    where: { agentId: agent.id },
    include: { logs: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
