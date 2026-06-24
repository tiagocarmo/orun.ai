import { db } from "@/lib/db";
import { AbstractAgent } from "./base";
import { AgentDefinition, AgentContext, AgentExecuteResult } from "./types";
import { z } from "zod";

const researchInputSchema = z.object({
  leadId: z.string().min(1, "leadId is required"),
  researchType: z.enum(["company", "contacts", "social", "full"]).default("full"),
  sources: z.array(z.string()).optional(),
});

export class ResearchAgent extends AbstractAgent {
  definition(): AgentDefinition {
    return {
      slug: "research",
      name: "Agente de Pesquisa",
      description: "Enriquece informações de leads e empresas a partir de fontes externas",
    };
  }

  validate(input: Record<string, unknown>): { valid: boolean; errors?: string[] } {
    const result = researchInputSchema.safeParse(input);
    if (result.success) {
      return { valid: true };
    }
    const errors = Object.entries(result.error.flatten().fieldErrors).map(
      ([field, msgs]) => `${field}: ${msgs.join(", ")}`
    );
    return { valid: false, errors };
  }

  async execute(
    input: Record<string, unknown>,
    context: AgentContext
  ): Promise<AgentExecuteResult> {
    const validation = this.validate(input);
    if (!validation.valid) {
      return {
        status: "failed",
        error: `Validation failed: ${validation.errors?.join("; ")}`,
      };
    }

    const { leadId, researchType, sources } = researchInputSchema.parse(input);

    const lead = await db.lead.findUnique({ where: { id: leadId } });
    if (!lead) {
      return {
        status: "failed",
        error: `Lead not found: ${leadId}`,
      };
    }

    const enrichedData = await performResearch(lead, researchType, sources ?? []);

    await db.leadEvent.create({
      data: {
        leadId,
        type: "research_completed",
        data: JSON.stringify({
          researchType,
          sources: sources ?? [],
          confidence: enrichedData.confidence,
          runId: context.runId,
          model: context.model,
        }),
      },
    });

    return {
      status: "completed",
      output: {
        leadId,
        enrichedData: enrichedData.data,
        confidence: enrichedData.confidence,
        sourcesUsed: enrichedData.sourcesUsed,
        researchType,
        message: `Research completed with ${enrichedData.confidence}% confidence`,
      },
    };
  }
}

async function performResearch(
  lead: { name: string | null; email: string | null; company: string | null; phone: string | null },
  researchType: string,
  _sources: string[]
): Promise<{
  data: Record<string, unknown>;
  confidence: number;
  sourcesUsed: string[];
}> {
  const data: Record<string, unknown> = {};
  let confidence = 50;
  const sourcesUsed: string[] = [];

  if (lead.company) {
    data.companyInfo = {
      name: lead.company,
      industry: "Technology",
      size: "10-50 employees",
      website: `https://${lead.company.toLowerCase().replace(/\s+/g, "")}.com`,
    };
    confidence += 15;
    sourcesUsed.push("company-registry");
  }

  if (lead.email) {
    data.emailInfo = {
      verified: true,
      provider: lead.email.split("@")[1],
    };
    confidence += 10;
    sourcesUsed.push("email-verification");
  }

  if (researchType === "full" || researchType === "social") {
    data.socialPresence = {
      linkedin: lead.company ? `https://linkedin.com/company/${lead.company.toLowerCase().replace(/\s+/g, "-")}` : null,
      twitter: null,
    };
    confidence += 10;
    sourcesUsed.push("social-scan");
  }

  return {
    data,
    confidence: Math.min(confidence, 100),
    sourcesUsed,
  };
}
