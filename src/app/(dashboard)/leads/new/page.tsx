"use client";

import { LeadForm } from "@/components/leads/lead-form";

export default function NewLeadPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold text-ink">Criar Lead</h1>
        <p className="text-sm text-muted mt-1">Registre um novo lead comercial</p>
      </div>
      <LeadForm />
    </div>
  );
}
