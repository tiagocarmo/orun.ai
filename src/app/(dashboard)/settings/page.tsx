"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSettings, updateSettings } from "@/app/actions/settings";
import type { SettingData } from "@/app/actions/settings";

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  useEffect(() => {
    async function load() {
      const result = await getSettings();
      if (result.success) {
        setSettings(result.data);
        const values: Record<string, string> = {};
        for (const s of result.data) {
          values[s.key] = s.value;
        }
        setFormValues(values);
      }
      setLoading(false);
    }
    load();
  }, []);

  function handleChange(key: string, value: string) {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    const entries = settings.map((s) => ({
      key: s.key,
      value: formValues[s.key] ?? s.value,
    }));
    const result = await updateSettings(entries);
    setSaving(false);
    if (result.success) {
      toast.success("Configurações salvas com sucesso");
    } else {
      toast.error(result.error);
    }
  }

  const generalSettings = settings.filter((s) => s.group === "general");
  const agentSettings = settings.filter((s) => s.group === "agents");
  const leadSettings = settings.filter((s) => s.group === "leads");

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-semibold text-ink">Configurações</h1>
          <p className="text-sm text-muted mt-1">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-ink">Configurações</h1>
          <p className="text-sm text-muted mt-1">Gerencie as configurações da plataforma</p>
        </div>
        <Button onClick={handleSave} loading={saving}>
          Salvar
        </Button>
      </div>

      {generalSettings.length > 0 && (
        <Card>
          <h2 className="text-lg font-semibold text-ink mb-4">Plataforma</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generalSettings.map((s) => (
              <div key={s.key}>
                <Input
                  label={s.label}
                  value={formValues[s.key] ?? ""}
                  onChange={(e) => handleChange(s.key, e.target.value)}
                />
                {s.helpText && (
                  <p className="text-xs text-muted mt-1">{s.helpText}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {agentSettings.length > 0 && (
        <Card>
          <h2 className="text-lg font-semibold text-ink mb-4">Agentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agentSettings.map((s) => (
              <div key={s.key}>
                <Input
                  label={s.label}
                  type={s.type === "number" ? "number" : "text"}
                  value={formValues[s.key] ?? ""}
                  onChange={(e) => handleChange(s.key, e.target.value)}
                />
                {s.helpText && (
                  <p className="text-xs text-muted mt-1">{s.helpText}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {leadSettings.length > 0 && (
        <Card>
          <h2 className="text-lg font-semibold text-ink mb-4">Leads</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leadSettings.map((s) => (
              <div key={s.key}>
                {s.type === "boolean" ? (
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formValues[s.key] === "true"}
                      onChange={(e) =>
                        handleChange(s.key, e.target.checked ? "true" : "false")
                      }
                      className="w-4 h-4 rounded border-hairline text-brand-teal focus:ring-brand-teal/30"
                    />
                    <span className="text-sm font-medium text-body">{s.label}</span>
                  </label>
                ) : (
                  <Input
                    label={s.label}
                    type={s.type === "number" ? "number" : "text"}
                    value={formValues[s.key] ?? ""}
                    onChange={(e) => handleChange(s.key, e.target.value)}
                  />
                )}
                {s.helpText && (
                  <p className="text-xs text-muted mt-1">{s.helpText}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
