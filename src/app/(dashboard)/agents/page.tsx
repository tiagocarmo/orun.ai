"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { getAgents } from "@/app/actions/agents";
import type { AgentWithVersions } from "@/lib/types";

type Filter = "all" | "active" | "inactive";

export default function AgentsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [agents, setAgents] = useState<AgentWithVersions[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const result = await getAgents();
      if (result.success) {
        setAgents(result.data);
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = agents.filter((agent) => {
    if (filter === "active") return agent.isActive;
    if (filter === "inactive") return !agent.isActive;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-ink">Agentes</h1>
          <p className="text-sm text-muted mt-1">Gerencie seus agentes de IA</p>
        </div>
        <Link href="/agents/new">
          <Button>Criar Agente</Button>
        </Link>
      </div>

      <div className="flex gap-2">
        {(["all", "active", "inactive"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors cursor-pointer ${
              filter === f
                ? "bg-brand-teal text-on-primary"
                : "bg-surface-card text-muted hover:bg-surface-strong"
            }`}
          >
            {f === "all" ? "Todos" : f === "active" ? "Ativos" : "Inativos"}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-muted">Carregando agentes...</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Nenhum agente encontrado"
          description="Crie seu primeiro agente para começar."
          action={
            <Link href="/agents/new">
              <Button size="sm">Criar Agente</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((agent) => (
            <Link key={agent.id} href={`/agents/${agent.id}`}>
              <Card className="hover:bg-surface-strong transition-colors cursor-pointer h-full">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-ink">{agent.name}</h3>
                  <Badge variant={agent.isActive ? "success" : "neutral"}>
                    {agent.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <p className="text-sm text-muted line-clamp-2 mb-3">{agent.description}</p>
                <p className="text-xs text-muted-soft">Modelo: {agent.model}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
