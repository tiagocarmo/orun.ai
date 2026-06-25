"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSettings, updateSettings } from "@/app/actions/settings";
import type { SettingData } from "@/app/actions/settings";

export default function ProfilePage() {
  const [settings, setSettings] = useState<SettingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  useEffect(() => {
    async function load() {
      const result = await getSettings("profile");
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
      toast.success("Perfil salvo com sucesso");
    } else {
      toast.error(result.error);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-semibold text-ink">Perfil</h1>
          <p className="text-sm text-muted mt-1">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-ink">Perfil</h1>
          <p className="text-sm text-muted mt-1">Gerencie seu perfil</p>
        </div>
        <Button onClick={handleSave} loading={saving}>
          Salvar
        </Button>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-ink mb-4">Dados Pessoais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {settings.filter((s) => s.key !== "profile.email_notifications" && s.key !== "profile.role").map((s) => (
            <div key={s.key}>
              <Input
                label={s.label}
                type={s.key === "profile.email" ? "email" : "text"}
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

      <Card>
        <h2 className="text-lg font-semibold text-ink mb-4">Preferências</h2>
        <div className="space-y-4">
          {settings.filter((s) => s.key === "profile.email_notifications").map((s) => (
            <div key={s.key}>
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
              {s.helpText && (
                <p className="text-xs text-muted mt-1 ml-7">{s.helpText}</p>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-ink mb-4">Papel</h2>
        <div className="space-y-4">
          {settings.filter((s) => s.key === "profile.role").map((s) => (
            <div key={s.key}>
              <Input
                label={s.label}
                value={formValues[s.key] ?? ""}
                onChange={(e) => handleChange(s.key, e.target.value)}
                disabled
              />
              {s.helpText && (
                <p className="text-xs text-muted mt-1">{s.helpText}</p>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
