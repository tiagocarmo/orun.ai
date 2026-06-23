"use client";

import { useState, useEffect } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAgents } from "@/app/actions/agents";
import { runAgent } from "@/app/actions/runs";
import type { AgentWithVersions } from "@/lib/types";

export default function RunAgentPage() {
  const [agents, setAgents] = useState<AgentWithVersions[]>([]);
  const [agentSlug, setAgentSlug] = useState("");
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "running" | "completed" | "failed">("idle");
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const res = await getAgents();
      if (res.success) {
        setAgents(res.data);
      }
    }
    load();
  }, []);

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
      setStatus("completed");
      setResult(JSON.stringify(res.data, null, 2));
    } else {
      setStatus("failed");
      setResult(JSON.stringify({ error: res.error }, null, 2));
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold text-ink">Run Agent</h1>
        <p className="text-sm text-muted mt-1">Execute an agent with custom input</p>
      </div>

      <Card>
        <CardTitle>Configuration</CardTitle>
        <div className="mt-4 space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-body">Select Agent</label>
            <select
              className="px-3 py-2 rounded-md border border-hairline bg-canvas text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal"
              value={agentSlug}
              onChange={(e) => setAgentSlug(e.target.value)}
            >
              <option value="">Choose an agent...</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.slug}>
                  {agent.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-body">Input (text or JSON)</label>
            <textarea
              className="px-3 py-2 rounded-md border border-hairline bg-canvas text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal min-h-[160px] resize-y font-mono"
              placeholder='{"name": "John Doe", "email": "john@example.com", "company": "Acme Inc"}'
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleRun}
              loading={status === "running"}
              disabled={!agentSlug || !input.trim()}
            >
              Run Agent
            </Button>
            {status === "running" && (
              <div className="flex items-center gap-2">
                <Badge variant="info">Running</Badge>
                <span className="text-xs text-muted-soft">Processing...</span>
              </div>
            )}
            {status === "completed" && (
              <Badge variant="success">Completed</Badge>
            )}
            {status === "failed" && (
              <Badge variant="error">Failed</Badge>
            )}
          </div>
        </div>
      </Card>

      {result && (
        <Card>
          <CardTitle>Result</CardTitle>
          <pre className="mt-3 text-sm text-body whitespace-pre-wrap font-mono bg-canvas rounded-md p-4 border border-hairline overflow-x-auto">
            {result}
          </pre>
        </Card>
      )}
    </div>
  );
}
