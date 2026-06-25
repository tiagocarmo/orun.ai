"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { getAllIntegrations, toggleIntegration } from "@/app/actions/integrations";
import type { IntegrationData } from "@/app/actions/integrations";

const typeLabels: Record<string, string> = {
  mcp: "MCP",
  webhook: "Webhook",
  api: "API",
};

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const result = await getAllIntegrations();
      if (result.success) {
        setIntegrations(result.data);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleToggle(id: string, currentIsActive: boolean) {
    setToggling(id);
    const result = await toggleIntegration(id, !currentIsActive);
    setToggling(null);
    if (result.success) {
      setIntegrations((prev) =>
        prev.map((i) => (i.id === id ? { ...i, isActive: !currentIsActive } : i))
      );
      toast.success(
        currentIsActive ? "Integração desativada" : "Integração ativada"
      );
    } else {
      toast.error(result.error);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-semibold text-ink">Integrações</h1>
          <p className="text-sm text-muted mt-1">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold text-ink">Integrações</h1>
        <p className="text-sm text-muted mt-1">Gerencie integrações externas</p>
      </div>

      {integrations.length === 0 ? (
        <EmptyState
          title="Nenhuma integração encontrada"
          description="Integrações com MCP, webhooks e APIs aparecerão aqui."
        />
      ) : (
        <div className="space-y-3">
          {integrations.map((integration) => (
            <Card key={integration.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="font-medium text-ink">{integration.name}</h3>
                  <p className="text-sm text-muted">
                    {typeLabels[integration.type] || integration.type}
                    {integration.provider && ` — ${integration.provider}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={integration.isActive ? "success" : "neutral"}>
                  {integration.isActive ? "Ativa" : "Inativa"}
                </Badge>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleToggle(integration.id, integration.isActive)}
                  loading={toggling === integration.id}
                >
                  {integration.isActive ? "Desativar" : "Ativar"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
