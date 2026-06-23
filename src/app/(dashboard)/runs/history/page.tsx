"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { RunStatusBadge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Fragment } from "react";
import { getRuns } from "@/app/actions/runs";
import type { AgentRunWithLogs } from "@/lib/types";

type StatusFilter = "all" | "pending" | "running" | "completed" | "failed";

function formatDuration(ms: number | null) {
  if (ms === null) return "—";
  if (ms < 1000) return `${ms}ms`;
  const seconds = Math.floor(ms / 1000);
  return `${seconds}s`;
}

export default function RunsHistoryPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [runs, setRuns] = useState<AgentRunWithLogs[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const result = await getRuns();
      if (result.success) {
        setRuns(result.data.data);
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = runs.filter(
    (run) => statusFilter === "all" || run.status === statusFilter
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold text-ink">Execution History</h1>
        <p className="text-sm text-muted mt-1">View all agent run executions</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "completed", "running", "failed"] as StatusFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors cursor-pointer ${
              statusFilter === f
                ? "bg-brand-teal text-on-primary"
                : "bg-surface-card text-muted hover:bg-surface-strong"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-muted">Loading runs...</p>
      ) : (
        <Card className="p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Tokens</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Time</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((run) => (
                <Fragment key={run.id}>
                  <TableRow>
                    <TableCell className="font-medium">{run.agent.name}</TableCell>
                    <TableCell>
                      <RunStatusBadge status={run.status} />
                    </TableCell>
                    <TableCell>{formatDuration(run.durationMs)}</TableCell>
                    <TableCell>{run.tokensConsumed ?? "—"}</TableCell>
                    <TableCell className="text-muted">{run.model ?? run.agent.model}</TableCell>
                    <TableCell className="text-muted">
                      {new Date(run.createdAt).toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedId(expandedId === run.id ? null : run.id)}
                      >
                        {expandedId === run.id ? "Hide" : "Details"}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expandedId === run.id && (
                    <TableRow key={`${run.id}-detail`}>
                      <TableCell colSpan={7} className="bg-surface-soft">
                        <div className="py-2 space-y-2">
                          <div>
                            <p className="text-xs font-medium text-muted uppercase">Input</p>
                            <pre className="text-sm text-body whitespace-pre-wrap font-mono mt-1">
                              {run.input}
                            </pre>
                          </div>
                          {run.output && (
                            <div>
                              <p className="text-xs font-medium text-muted uppercase">Output</p>
                              <pre className="text-sm text-body whitespace-pre-wrap font-mono mt-1">
                                {run.output}
                              </pre>
                            </div>
                          )}
                          {run.error && (
                            <div>
                              <p className="text-xs font-medium text-red-500 uppercase">Error</p>
                              <pre className="text-sm text-red-600 whitespace-pre-wrap font-mono mt-1">
                                {run.error}
                              </pre>
                            </div>
                          )}
                          {run.logs.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-muted uppercase">Logs</p>
                              <div className="mt-1 space-y-1">
                                {run.logs.map((log) => (
                                  <div key={log.id} className="text-xs text-muted">
                                    <span className="font-mono">[{log.level}]</span> {log.message}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-sm text-muted py-8">
                    No runs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
