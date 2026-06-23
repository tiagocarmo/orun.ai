"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { searchLeads } from "@/app/actions/leads";
import { getAgents } from "@/app/actions/agents";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

interface LeadResult {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
}

interface AgentResult {
  slug: string;
  name: string;
  description: string | null;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [leads, setLeads] = useState<LeadResult[]>([]);
  const [agents, setAgents] = useState<AgentResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setLeads([]);
      setAgents([]);
      return;
    }

    setLoading(true);
    try {
      const [leadsRes, agentsRes] = await Promise.all([
        searchLeads(q),
        getAgents(),
      ]);

      if (leadsRes.success && leadsRes.data) {
        setLeads(leadsRes.data);
      }
      if (agentsRes.success && agentsRes.data) {
        const filtered = agentsRes.data.filter(
          (a) =>
            a.name.toLowerCase().includes(q.toLowerCase()) ||
            a.description?.toLowerCase().includes(q.toLowerCase())
        );
        setAgents(filtered);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setLeads([]);
      setAgents([]);
    }
  }, [open]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) {
          onClose();
        } else {
          document.dispatchEvent(new CustomEvent("open-command-palette"));
        }
      }
      if (e.key === "Escape" && open) {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div className="fixed inset-0 bg-ink/50" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-canvas border border-hairline rounded-xl shadow-xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 border-b border-hairline">
          <svg className="w-5 h-5 text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar leads, agentes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 py-3 text-sm bg-transparent text-ink placeholder:text-muted outline-none"
            autoFocus
          />
          <kbd className="text-xs text-muted-soft border border-hairline rounded px-1.5 py-0.5 font-mono">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {loading && (
            <div className="py-8 text-center text-sm text-muted">Buscando...</div>
          )}

          {!loading && query.length < 2 && (
            <div className="py-8 text-center text-sm text-muted">
              Digite pelo menos 2 caracteres para buscar
            </div>
          )}

          {!loading && query.length >= 2 && leads.length === 0 && agents.length === 0 && (
            <div className="py-8 text-center text-sm text-muted">
              Nenhum resultado encontrado
            </div>
          )}

          {leads.length > 0 && (
            <div className="mb-2">
              <div className="px-2 py-1 text-xs font-medium text-muted uppercase">Leads</div>
              {leads.map((lead) => (
                <button
                  key={lead.id}
                  type="button"
                  onClick={() => {
                    router.push(`/leads/${lead.id}`);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left hover:bg-surface-soft transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-lavender/20 flex items-center justify-center text-xs font-medium text-brand-lavender">
                    {lead.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-ink truncate">{lead.name}</div>
                    <div className="text-xs text-muted truncate">
                      {lead.company || lead.email || "Sem informações"}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {agents.length > 0 && (
            <div>
              <div className="px-2 py-1 text-xs font-medium text-muted uppercase">Agentes</div>
              {agents.map((agent) => (
                <button
                  key={agent.slug}
                  type="button"
                  onClick={() => {
                    router.push(`/agents/${agent.slug}`);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left hover:bg-surface-soft transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-teal/20 flex items-center justify-center text-xs font-medium text-brand-teal">
                    {agent.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-ink truncate">{agent.name}</div>
                    <div className="text-xs text-muted truncate">
                      {agent.description || "Sem descrição"}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
