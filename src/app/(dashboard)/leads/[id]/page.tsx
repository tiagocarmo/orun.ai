import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LeadDetail } from "@/components/leads/lead-detail";
import { LeadActions } from "@/components/leads/lead-actions";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "agora";
  if (diffMin < 60) return `${diffMin}m atrás`;
  if (diffHr < 24) return `${diffHr}h atrás`;
  if (diffDay < 30) return `${diffDay}d atrás`;
  return date.toLocaleDateString("pt-BR");
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const lead = await db.lead.findUnique({
    where: { id },
    include: { events: { orderBy: { createdAt: "desc" } } },
  });

  if (!lead) {
    notFound();
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-ink">{lead.name}</h1>
          <p className="text-sm text-muted mt-1">{lead.company || "Sem empresa"}</p>
          {lead.qualificationScore !== null && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-muted mb-1">
                <span>Score de Qualificação</span>
                <span>{lead.qualificationScore}/100</span>
              </div>
              <div className="h-2 bg-surface-strong rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-teal transition-all"
                  style={{ width: `${lead.qualificationScore}%` }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Link href={`/leads/${lead.id}/edit`}>
            <Button variant="secondary" size="sm">Editar</Button>
          </Link>
          <Link href={`/runs?lead=${lead.id}`}>
            <Button size="sm">Executar Agente</Button>
          </Link>
          <LeadActions leadId={lead.id} currentStatus={lead.status} />
          <Link href="/leads">
            <Button variant="ghost" size="sm">Voltar</Button>
          </Link>
        </div>
      </div>

      <LeadDetail lead={{
        id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        source: lead.source,
        message: lead.message,
        status: lead.status,
        qualificationScore: lead.qualificationScore,
        qualificationReason: lead.qualificationReason,
        createdAt: lead.createdAt.toISOString(),
        events: lead.events.map((e) => ({
          id: e.id,
          type: e.type,
          data: e.data,
          createdAt: e.createdAt.toISOString(),
        })),
      }} />

      {lead.events.length > 0 && (
        <Card>
          <p className="text-xs text-muted">Eventos (tempo relativo)</p>
          <div className="mt-2 space-y-1">
            {lead.events.map((e) => (
              <div key={e.id} className="flex justify-between text-xs">
                <span className="text-body">{e.type}</span>
                <span className="text-muted">{formatRelativeTime(e.createdAt.toISOString())}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
