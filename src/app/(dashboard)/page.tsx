import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { LeadsOverTimeChart } from "@/components/dashboard/leads-over-time-chart";
import { AgentPerformanceChart } from "@/components/dashboard/agent-performance-chart";
import { LeadStatusPie } from "@/components/dashboard/lead-status-pie";
import { ActivityFeed } from "@/components/dashboard/activity-feed";

export default async function DashboardPage() {
  const [totalLeads, qualifiedLeads, activeAgents, recentRuns, recentEvents] =
    await Promise.all([
      db.lead.count(),
      db.lead.count({ where: { status: "qualified" } }),
      db.agent.count({ where: { isActive: true } }),
      db.agentRun.count(),
      db.leadEvent.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { lead: { select: { name: true } } },
      }),
    ]);

  const stats = [
    { label: "Total de Leads", value: totalLeads, href: "/leads" },
    { label: "Leads Qualificados", value: qualifiedLeads, href: "/leads?status=qualified" },
    { label: "Agentes Ativos", value: activeAgents, href: "/agents" },
    { label: "Execuções Recentes", value: recentRuns, href: "/runs/history" },
  ];

  const recentActivity = recentEvents.map((event) => ({
    id: event.id,
    type: event.type,
    leadName: event.lead?.name ?? "Desconhecido",
    createdAt: formatRelativeTime(event.createdAt),
  }));

  // Leads over time (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const leadsByDate = await db.lead.groupBy({
    by: ["createdAt"],
    _count: { id: true },
    where: { createdAt: { gte: thirtyDaysAgo } },
    orderBy: { createdAt: "asc" },
  });

  const leadsOverTimeData = leadsByDate.map((item) => ({
    date: new Date(item.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    count: item._count.id,
  }));

  // Agent performance
  const agentRuns = await db.agentRun.groupBy({
    by: ["agentId"],
    _count: { id: true },
  });

  const agentIds = agentRuns.map((ar) => ar.agentId);
  const agents = await db.agent.findMany({ where: { id: { in: agentIds } } });
  const agentMap = new Map(agents.map((a) => [a.id, a.name]));

  const agentPerformanceData = agentRuns.map((ar) => ({
    name: agentMap.get(ar.agentId) ?? "Desconhecido",
    runs: ar._count.id,
  }));

  // Lead status distribution
  const statusCounts = await db.lead.groupBy({
    by: ["status"],
    _count: { id: true },
  });

  const statusData = statusCounts.map((sc) => ({
    name: sc.status ?? "Desconhecido",
    value: sc._count.id,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-ink">Dashboard</h1>
          <p className="text-sm text-muted mt-1">Bem-vindo à Plataforma Orun.AI</p>
        </div>
        <div className="flex gap-2">
          <Link href="/leads/new">
            <Button variant="secondary" size="sm">Criar Lead</Button>
          </Link>
          <Link href="/runs">
            <Button size="sm">Executar Agente</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:bg-surface-strong transition-colors cursor-pointer">
              <p className="text-sm text-muted">{stat.label}</p>
              <p className="text-3xl font-semibold text-ink mt-1">{stat.value}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeadsOverTimeChart data={leadsOverTimeData} />
        <AgentPerformanceChart data={agentPerformanceData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeadStatusPie data={statusData} />
        <ActivityFeed events={recentActivity} />
      </div>
    </div>
  );
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s atrás`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min atrás`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h atrás`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d atrás`;
}
