import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";

export default async function DashboardPage() {
  const [totalLeads, qualifiedLeads, activeAgents, recentRuns, recentEvents] =
    await Promise.all([
      db.lead.count(),
      db.lead.count({ where: { status: "qualified" } }),
      db.agent.count({ where: { isActive: true } }),
      db.agentRun.count(),
      db.leadEvent.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { lead: { select: { name: true } } },
      }),
    ]);

  const stats = [
    { label: "Total Leads", value: totalLeads, href: "/leads" },
    { label: "Qualified Leads", value: qualifiedLeads, href: "/leads?status=qualified" },
    { label: "Active Agents", value: activeAgents, href: "/agents" },
    { label: "Recent Runs", value: recentRuns, href: "/runs/history" },
  ];

  const recentActivity = recentEvents.map((event) => ({
    id: event.id,
    text: `${event.lead?.name ?? "Unknown"} — ${event.type}`,
    time: formatRelativeTime(event.createdAt),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-ink">Dashboard</h1>
          <p className="text-sm text-muted mt-1">Welcome to Orun.AI Workforce Platform</p>
        </div>
        <div className="flex gap-2">
          <Link href="/leads/new">
            <Button variant="secondary" size="sm">Create Lead</Button>
          </Link>
          <Link href="/runs">
            <Button size="sm">Run Agent</Button>
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

      <Card>
        <CardTitle>Recent Activity</CardTitle>
        <div className="divide-y divide-hairline-soft mt-2">
          {recentActivity.length === 0 ? (
            <p className="text-sm text-muted py-3">No recent activity.</p>
          ) : (
            recentActivity.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3">
                <p className="text-sm text-body">{item.text}</p>
                <span className="text-xs text-muted-soft whitespace-nowrap ml-4">{item.time}</span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}
