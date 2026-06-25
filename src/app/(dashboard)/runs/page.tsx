"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAgents } from "@/app/actions/agents";
import { getLead, searchLeads } from "@/app/actions/leads";
import { runAgent } from "@/app/actions/runs";
import type { AgentWithVersions } from "@/lib/types";
import { buildLeadRunInput } from "@/lib/runs/manual-input";

interface LeadResult {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  phone: string | null;
}

export default function RunAgentPage() {
  const searchParams = useSearchParams();
  const [agents, setAgents] = useState<AgentWithVersions[]>([]);
  const [agentSlug, setAgentSlug] = useState("");
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "running" | "completed" | "failed">("idle");
  const [result, setResult] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LeadResult[]>([]);
  const [selectedLead, setSelectedLead] = useState<LeadResult | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const res = await getAgents();
      if (res.success) {
        setAgents(res.data);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const leadIdFromQuery = searchParams.get("lead");
    if (!leadIdFromQuery) {
      return;
    }
    const leadId: string = leadIdFromQuery;

    async function loadLeadFromQuery() {
      const res = await getLead(leadId);
      if (!res.success) {
        return;
      }

      const lead = {
        id: res.data.id,
        name: res.data.name,
        email: res.data.email,
        company: res.data.company,
        phone: res.data.phone,
      };

      setSelectedLead(lead);
      setSearchQuery(lead.name);
      setInput(buildLeadRunInput(lead));

      if (!agentSlug && agents.some((agent) => agent.slug === "qualification")) {
        setAgentSlug("qualification");
      }
    }

    void loadLeadFromQuery();
  }, [agentSlug, agents, searchParams]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const doSearch = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    setSearching(true);
    const res = await searchLeads(query);
    setSearching(false);
    if (res.success) {
      setSearchResults(res.data);
      setShowDropdown(true);
    }
  }, []);

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    setSelectedLead(null);
    setInput("");

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      doSearch(value);
    }, 500);
  }

  function selectLead(lead: LeadResult) {
    setSelectedLead(lead);
    setSearchQuery(lead.name);
    setShowDropdown(false);
    setInput(buildLeadRunInput(lead));
  }

  async function handleRun() {
    if (!agentSlug || !input.trim()) return;
    setStatus("running");
    setResult(null);

    let parsedInput: Record<string, unknown>;
    try {
      parsedInput = JSON.parse(input);
    } catch {
      parsedInput = { text: input };
    }

    const res = await runAgent(agentSlug, parsedInput);

    if (res.success) {
      toast.success("Agente executado com sucesso");
      setStatus("completed");
      setResult(JSON.stringify(res.data, null, 2));
    } else {
      toast.error(res.error || "Erro ao executar agente");
      setStatus("failed");
      setResult(JSON.stringify({ error: res.error }, null, 2));
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold text-ink">Executar Agente</h1>
        <p className="text-sm text-muted mt-1">Execute um agente com dados de entrada</p>
      </div>

      <Card>
        <CardTitle>Configuração</CardTitle>
        <div className="mt-4 space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-body">Selecionar Agente</label>
            <select
              className="px-3 py-2 rounded-md border border-hairline bg-canvas text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal"
              value={agentSlug}
              onChange={(e) => setAgentSlug(e.target.value)}
            >
              <option value="">Escolha um agente...</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.slug}>
                  {agent.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex flex-col gap-1.5" ref={dropdownRef}>
            <label className="text-sm font-medium text-body">Buscar Lead</label>
            <input
              type="text"
              className="px-3 py-2 rounded-md border border-hairline bg-canvas text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal"
              placeholder="Digite nome, email ou empresa (min. 3 letras)..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            {searching && searchQuery.length >= 3 && (
              <div className="absolute z-10 mt-1 w-full max-w-md bg-canvas border border-hairline rounded-md shadow-lg px-3 py-2">
                <p className="text-sm text-muted">Buscando...</p>
              </div>
            )}
            {!searching && showDropdown && searchResults.length > 0 && (
              <div className="absolute z-10 mt-1 w-full max-w-md bg-canvas border border-hairline rounded-md shadow-lg">
                {searchResults.map((lead) => (
                  <button
                    key={lead.id}
                    className="w-full px-3 py-2 text-left hover:bg-surface-strong transition-colors border-b border-hairline last:border-0"
                    onClick={() => selectLead(lead)}
                  >
                    <p className="text-sm font-medium text-ink">{lead.name}</p>
                    <p className="text-xs text-muted-soft">
                      {lead.email}{lead.company ? ` · ${lead.company}` : ""}
                    </p>
                  </button>
                ))}
              </div>
            )}
            {!searching && showDropdown && searchResults.length === 0 && searchQuery.length >= 3 && (
              <div className="absolute z-10 mt-1 w-full max-w-md bg-canvas border border-hairline rounded-md shadow-lg px-3 py-2">
                <p className="text-sm text-muted-soft">Nenhum lead encontrado</p>
              </div>
            )}
          </div>

          {selectedLead && (
            <div className="bg-surface-strong rounded-md p-3 border border-hairline">
              <p className="text-xs text-muted-soft mb-1">Lead selecionado:</p>
              <p className="text-sm font-medium text-ink">{selectedLead.name}</p>
              <p className="text-xs text-muted-soft">
                {selectedLead.email}{selectedLead.company ? ` · ${selectedLead.company}` : ""}
              </p>
            </div>
          )}

          {!selectedLead && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-body">Entrada (texto ou JSON)</label>
              <textarea
                className="px-3 py-2 rounded-md border border-hairline bg-canvas text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal min-h-[120px] resize-y font-mono"
                placeholder='{"name": "Joao Silva", "email": "joao@exemplo.com"}'
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button
              onClick={handleRun}
              loading={status === "running"}
              disabled={!agentSlug || (!input.trim() && !selectedLead)}
            >
              Executar Agente
            </Button>
            {status === "running" && (
              <div className="flex items-center gap-2">
                <Badge variant="info">Executando</Badge>
                <span className="text-xs text-muted-soft">Processando...</span>
              </div>
            )}
            {status === "completed" && (
              <>
                <Badge variant="success">Concluido</Badge>
                <Button variant="secondary" onClick={handleRun}>
                  Re-executar
                </Button>
              </>
            )}
            {status === "failed" && (
              <Badge variant="error">Falhou</Badge>
            )}
          </div>
        </div>
      </Card>

      {result && (
        <Card>
          <CardTitle>Resultado</CardTitle>
          <pre className="mt-3 text-sm text-body whitespace-pre-wrap font-mono bg-canvas rounded-md p-4 border border-hairline overflow-x-auto">
            {result}
          </pre>
        </Card>
      )}
    </div>
  );
}
