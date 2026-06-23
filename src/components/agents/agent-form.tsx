"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AgentFormData {
  name: string;
  description: string;
  prompt: string;
  model: string;
  maxTokens: string;
  temperature: string;
}

interface AgentFormProps {
  initialData?: Partial<AgentFormData>;
  agentId?: string;
}

const defaultData: AgentFormData = {
  name: "",
  description: "",
  prompt: "",
  model: "gpt-4o",
  maxTokens: "4096",
  temperature: "0.7",
};

export function AgentForm({ initialData, agentId }: AgentFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<AgentFormData>({
    ...defaultData,
    ...initialData,
  });

  function updateField(key: keyof AgentFormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      router.push(agentId ? `/agents/${agentId}` : "/agents");
    }, 500);
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <CardTitle>{agentId ? "Edit Agent" : "Create Agent"}</CardTitle>

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
            {agentId ? "Save Changes" : "Create Agent"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
