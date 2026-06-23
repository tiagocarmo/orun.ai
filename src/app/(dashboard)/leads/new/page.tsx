"use client";

import { LeadForm } from "@/components/leads/lead-form";

export default function NewLeadPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold text-ink">Create Lead</h1>
        <p className="text-sm text-muted mt-1">Register a new sales lead</p>
      </div>
      <LeadForm />
    </div>
  );
}
