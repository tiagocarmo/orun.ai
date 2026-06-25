import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const agent = await db.agent.findUnique({
    where: { id },
    include: {
      _count: { select: { runs: true, versions: true } },
    },
  });

  if (!agent) {
    notFound();
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-ink">{agent.name}</h1>
          <p className="text-sm text-muted mt-1">{agent.description}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/agents/${agent.id}/edit`}>
            <Button variant="secondary" size="sm">Editar</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-xs text-muted">Status</p>
          <Badge variant={agent.isActive ? "success" : "neutral"} className="mt-1">
            {agent.isActive ? "Ativo" : "Inativo"}
          </Badge>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-muted">Total de Execuções</p>
          <p className="text-xl font-semibold text-ink mt-1">{agent._count.runs}</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-muted">Versões</p>
          <p className="text-xl font-semibold text-ink mt-1">{agent._count.versions}</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-muted">Modelo</p>
          <p className="text-sm font-medium text-ink mt-1">{agent.model}</p>
        </Card>
      </div>

      <Card>
        <CardTitle>Prompt do Sistema</CardTitle>
        <pre className="mt-3 text-sm text-body whitespace-pre-wrap font-body bg-canvas rounded-md p-4 border border-hairline">
          {agent.prompt}
        </pre>
      </Card>

      <Card>
        <CardTitle>Configuração</CardTitle>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <p className="text-xs text-muted">Modelo</p>
            <p className="text-sm text-ink">{agent.model}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Máximo de Tokens</p>
            <p className="text-sm text-ink">{agent.maxTokens}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Temperatura</p>
            <p className="text-sm text-ink">{agent.temperature}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Criado em</p>
            <p className="text-sm text-ink">
              {new Date(agent.createdAt).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>
      </Card>

      <div className="flex gap-2">
        <Link href={`/runs?agent=${agent.id}`}>
          <Button>Executar Agente</Button>
        </Link>
        <Link href="/agents">
          <Button variant="destructive">Voltar aos Agentes</Button>
        </Link>
      </div>
    </div>
  );
}
