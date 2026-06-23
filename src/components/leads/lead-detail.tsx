import { Card, CardTitle } from "@/components/ui/card";
import { LeadStatusBadge } from "@/components/ui/badge";

interface LeadEvent {
  id: string;
  type: string;
  data: string | null;
  createdAt: string;
}

interface LeadDetailProps {
  lead: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    company: string | null;
    source: string | null;
    message: string | null;
    status: string;
    qualificationScore: number | null;
    qualificationReason: string | null;
    createdAt: string;
    events: LeadEvent[];
  };
}

export function LeadDetail({ lead }: LeadDetailProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardTitle>Informações de Contato</CardTitle>
          <div className="mt-3 space-y-2">
            <div>
              <p className="text-xs text-muted">Name</p>
              <p className="text-sm text-ink">{lead.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Email</p>
              <p className="text-sm text-ink">{lead.email || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Phone</p>
              <p className="text-sm text-ink">{lead.phone || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Company</p>
              <p className="text-sm text-ink">{lead.company || "—"}</p>
            </div>
          </div>
        </Card>

        <Card>
          <CardTitle>Detalhes do Lead</CardTitle>
          <div className="mt-3 space-y-2">
            <div>
              <p className="text-xs text-muted">Status</p>
              <LeadStatusBadge status={lead.status} />
            </div>
            <div>
              <p className="text-xs text-muted">Origem</p>
              <p className="text-sm text-ink">{lead.source || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Score</p>
              <p className="text-sm text-ink">{lead.qualificationScore ?? "Sem nota"}</p>
            </div>
            {lead.qualificationReason && (
              <div>
                <p className="text-xs text-muted">Motivo da Qualificação</p>
                <p className="text-sm text-ink">{lead.qualificationReason}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted">Criado em</p>
              <p className="text-sm text-ink">
                {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {lead.message && (
        <Card>
          <CardTitle>Mensagem Inicial</CardTitle>
          <p className="mt-3 text-sm text-body whitespace-pre-wrap">{lead.message}</p>
        </Card>
      )}

      <Card>
          <CardTitle>Histórico de Atividades</CardTitle>
        {lead.events.length === 0 ? (
          <p className="text-sm text-muted mt-3">Nenhum evento registrado ainda.</p>
        ) : (
          <div className="divide-y divide-hairline-soft mt-3">
            {lead.events.map((event) => (
              <div key={event.id} className="py-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-body uppercase">{event.type}</span>
                  <span className="text-xs text-muted-soft">
                    {new Date(event.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                {event.data && (
                  <p className="text-sm text-muted mt-1">{event.data}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
