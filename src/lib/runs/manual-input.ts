export interface ManualLeadSelection {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  phone: string | null;
}

export function buildLeadRunInput(lead: ManualLeadSelection): string {
  return JSON.stringify(
    {
      leadId: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
    },
    null,
    2
  );
}
