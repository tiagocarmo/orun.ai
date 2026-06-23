"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createLead, updateLead } from "@/app/actions/leads";

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  message: string;
}

interface LeadFormProps {
  initialData?: Partial<LeadFormData>;
  leadId?: string;
}

const defaultData: LeadFormData = {
  name: "",
  email: "",
  phone: "",
  company: "",
  source: "",
  message: "",
};

export function LeadForm({ initialData, leadId }: LeadFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState(false);
  const isEdit = !!leadId;
  const [form, setForm] = useState<LeadFormData>({
    ...defaultData,
    ...initialData,
  });

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Nome é obrigatório";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Email inválido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function updateField(key: keyof LeadFormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);

    if (!validate()) return;

    setSaving(true);
    setError(null);

    const payload = {
      name: form.name,
      email: form.email || undefined,
      phone: form.phone || undefined,
      company: form.company || undefined,
      source: form.source || undefined,
      message: form.message || undefined,
    };

    let result;
    if (leadId) {
      result = await updateLead(leadId, payload);
    } else {
      result = await createLead(payload);
    }

    if (result.success) {
      toast.success(leadId ? "Lead atualizado com sucesso" : "Lead criado com sucesso");
      router.push(leadId ? `/leads/${leadId}` : "/leads");
      router.refresh();
    } else {
      toast.error(result.error || "Erro ao salvar lead");
      setError(result.error);
      setSaving(false);
    }
  }

  return (
    <Card>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <CardTitle>{isEdit ? "Editar Lead" : "Criar Lead"}</CardTitle>

        <Input
          label="Nome"
          placeholder="Nome completo"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          error={touched ? errors.name : undefined}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="email@exemplo.com"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            error={touched ? errors.email : undefined}
          />
          <Input
            label="Telefone"
            type="tel"
            placeholder="+55 11 99999-0000"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Empresa"
            placeholder="Nome da empresa"
            value={form.company}
            onChange={(e) => updateField("company", e.target.value)}
          />
          <Input
            label="Origem"
            placeholder="ex. webhook, indicação, site"
            value={form.source}
            onChange={(e) => updateField("source", e.target.value)}
          />
        </div>

        {isEdit && (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-body">Mensagem</label>
            <textarea
              className="px-3 py-2 rounded-md border border-hairline bg-canvas text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal min-h-[100px] resize-y"
              placeholder="Mensagem inicial do lead..."
              value={form.message}
              onChange={(e) => updateField("message", e.target.value)}
            />
          </div>
        )}

        <div className="flex gap-2 justify-end pt-2">
          <Button variant="ghost" type="button" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            {isEdit ? "Salvar Alterações" : "Criar Lead"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
