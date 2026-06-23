"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createAgent } from "@/app/actions/agents";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function NewAgentPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    prompt: "",
    model: "gpt-4o",
    maxTokens: "4096",
    temperature: "0.7",
  });

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const result = await createAgent({
      name: form.name,
      slug: slugify(form.name),
      description: form.description || undefined,
      prompt: form.prompt,
      model: form.model,
      maxTokens: parseInt(form.maxTokens, 10),
      temperature: parseFloat(form.temperature),
    });

    if (result.success) {
      toast.success("Agente criado com sucesso");
      router.push("/agents");
    } else {
      toast.error(result.error || "Erro ao criar agente");
      setError(result.error);
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold text-ink">Create Agent</h1>
        <p className="text-sm text-muted mt-1">Define a new AI agent configuration</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <CardTitle>Agent Details</CardTitle>

          <Input
            label="Name"
            placeholder="e.g. Lead Intake Agent"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            required
          />

          <Input
            label="Description"
            placeholder="What does this agent do?"
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-body">System Prompt</label>
            <textarea
              className="px-3 py-2 rounded-md border border-hairline bg-canvas text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal min-h-[160px] resize-y"
              placeholder="Enter the system prompt for this agent..."
              value={form.prompt}
              onChange={(e) => updateField("prompt", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-body">Model</label>
              <select
                className="px-3 py-2 rounded-md border border-hairline bg-canvas text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal"
                value={form.model}
                onChange={(e) => updateField("model", e.target.value)}
              >
                <option value="gpt-4o">GPT-4o</option>
                <option value="gpt-4o-mini">GPT-4o Mini</option>
                <option value="claude-sonnet-4-20250514">Claude Sonnet 4</option>
              </select>
            </div>

            <Input
              label="Max Tokens"
              type="number"
              value={form.maxTokens}
              onChange={(e) => updateField("maxTokens", e.target.value)}
            />

            <Input
              label="Temperature"
              type="number"
              step="0.1"
              min="0"
              max="2"
              value={form.temperature}
              onChange={(e) => updateField("temperature", e.target.value)}
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="ghost" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Create Agent
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
