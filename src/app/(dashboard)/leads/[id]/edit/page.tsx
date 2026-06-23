"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LeadForm } from "@/components/leads/lead-form";
import { getLead } from "@/app/actions/leads";

export default function EditLeadPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leadId, setLeadId] = useState("");
  const [initialData, setInitialData] = useState<{
    name: string;
    email: string;
    phone: string;
    company: string;
    source: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    async function load() {
      const { id } = await params;
      const result = await getLead(id);
      if (result.success) {
        const lead = result.data;
        setLeadId(lead.id);
        setInitialData({
          name: lead.name,
          email: lead.email ?? "",
          phone: lead.phone ?? "",
          company: lead.company ?? "",
          source: lead.source ?? "",
          message: lead.message ?? "",
        });
      } else {
        setError(result.error);
      }
      setLoading(false);
    }
    load();
  }, [params, router]);

  if (loading) {
    return <p className="text-sm text-muted">Loading lead...</p>;
  }

  if (error) {
    return (
      <div className="max-w-2xl space-y-6">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold text-ink">Editar Lead</h1>
        <p className="text-sm text-muted mt-1">Atualizar informações do lead</p>
      </div>
      {initialData && <LeadForm initialData={initialData} leadId={leadId} />}
    </div>
  );
}
