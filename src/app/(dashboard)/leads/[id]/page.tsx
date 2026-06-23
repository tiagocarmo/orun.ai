import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LeadDetail } from "@/components/leads/lead-detail";
import { LeadActions } from "@/components/leads/lead-actions";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

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
        </div>
        <div className="flex gap-2">
          <Link href={`/leads/${lead.id}/edit`}>
            <Button variant="secondary" size="sm">Editar</Button>
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
    </div>
  );
}
