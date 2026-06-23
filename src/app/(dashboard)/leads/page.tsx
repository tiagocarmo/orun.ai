"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LeadStatusBadge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { getLeads } from "@/app/actions/leads";
import type { LeadWithEvents } from "@/lib/types";

type StatusFilter = "all" | "new" | "qualified" | "nurturing" | "disqualified" | "converted" | "archived";
type SortField = "name" | "company" | "status" | "qualificationScore" | "createdAt";

const PAGE_SIZE = 20;

export default function LeadsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [leads, setLeads] = useState<LeadWithEvents[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const status = statusFilter === "all" ? undefined : statusFilter;
      const result = await getLeads(page, PAGE_SIZE, status);
      if (result.success) {
        setLeads(result.data.data);
        setTotalPages(result.data.totalPages);
      }
      setLoading(false);
    }
    load();
  }, [page, statusFilter]);

  const sorted = [...leads].sort((a, b) => {
    const aVal = a[sortField] ?? "";
    const bVal = b[sortField] ?? "";
    const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
    return sortDir === "asc" ? cmp : -cmp;
  });

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  const sortIndicator = (field: SortField) =>
    sortField === field ? (sortDir === "asc" ? " ↑" : " ↓") : "";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-ink">Leads</h1>
          <p className="text-sm text-muted mt-1">Gerencie seus leads comerciais</p>
        </div>
        <Link href="/leads/new">
          <Button>Criar Lead</Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "new", "qualified", "nurturing", "disqualified", "converted", "archived"] as StatusFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors cursor-pointer ${
              statusFilter === f
                ? "bg-brand-teal text-on-primary"
                : "bg-surface-card text-muted hover:bg-surface-strong"
            }`}
          >
            {f === "all" ? "Todos" : f === "new" ? "Novo" : f === "qualified" ? "Qualificado" : f === "nurturing" ? "Nutrição" : f === "disqualified" ? "Desqualificado" : f === "converted" ? "Convertido" : "Arquivados"}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-muted">Carregando leads...</p>
      ) : sorted.length === 0 ? (
        <EmptyState
          title="Nenhum lead encontrado"
          description="Crie seu primeiro lead para começar."
          action={
            <Link href="/leads/new">
              <Button size="sm">Criar Lead</Button>
            </Link>
          }
        />
      ) : (
        <Card className="p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("name")}>
                  Nome{sortIndicator("name")}
                </TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("company")}>
                  Empresa{sortIndicator("company")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("status")}>
                  Status{sortIndicator("status")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("qualificationScore")}>
                  Nota{sortIndicator("qualificationScore")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("createdAt")}>
                  Criado em{sortIndicator("createdAt")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <Link href={`/leads/${lead.id}`} className="font-medium text-ink hover:underline">
                      {lead.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted">{lead.email ?? "—"}</TableCell>
                  <TableCell>{lead.company ?? "—"}</TableCell>
                  <TableCell>
                    <LeadStatusBadge status={lead.status} />
                  </TableCell>
                  <TableCell>{lead.qualificationScore ?? "—"}</TableCell>
                  <TableCell className="text-muted">
                    {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {!loading && leads.length > 0 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}
