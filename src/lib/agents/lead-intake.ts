import { db } from "@/lib/db";
import { AbstractAgent } from "./base";
import { AgentDefinition, AgentContext, AgentExecuteResult } from "./types";
import { webhookLeadSchema } from "@/lib/validators";

export class LeadIntakeAgent extends AbstractAgent {
  definition(): AgentDefinition {
    return {
      slug: "lead-intake",
      name: "Agente de Captação de Leads",
      description: "Recebe e valida novos leads de fontes externas",
    };
  }

  validate(input: Record<string, unknown>): { valid: boolean; errors?: string[] } {
    const result = webhookLeadSchema.safeParse(input);
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
    _context: AgentContext
  ): Promise<AgentExecuteResult> {
    const validation = this.validate(input);
    if (!validation.valid) {
      return {
        status: "failed",
        error: `Validation failed: ${validation.errors?.join("; ")}`,
      };
    }

    const parsed = webhookLeadSchema.parse(input);

    // Deduplication
    if (parsed.email) {
      const existing = await db.lead.findFirst({ where: { email: parsed.email } });
      if (existing) {
        return {
          status: "completed",
          output: {
            leadId: existing.id,
            duplicated: true,
            message: "Lead already exists with this email",
          },
        };
      }
    }

    if (parsed.phone) {
      const existing = await db.lead.findFirst({ where: { phone: parsed.phone } });
      if (existing) {
        return {
          status: "completed",
          output: {
            leadId: existing.id,
            duplicated: true,
            message: "Lead already exists with this phone",
          },
        };
      }
    }

    if (parsed.externalId) {
      const existing = await db.lead.findFirst({
        where: { metadata: JSON.stringify({ externalId: parsed.externalId }) },
      });
      if (existing) {
        return {
          status: "completed",
          output: {
            leadId: existing.id,
            duplicated: true,
            message: "Lead already exists with this external ID",
          },
        };
      }
    }

    const lead = await db.lead.create({
      data: {
        name: parsed.name,
        email: parsed.email ?? null,
        phone: parsed.phone ?? null,
        company: parsed.company ?? null,
        source: parsed.source ?? null,
        message: parsed.message ?? null,
        status: "new",
        metadata: parsed.externalId
          ? JSON.stringify({ externalId: parsed.externalId, ...(parsed.metadata as Record<string, unknown> ?? {}) })
          : parsed.metadata
            ? JSON.stringify(parsed.metadata)
            : null,
      },
    });

    await db.leadEvent.create({
      data: {
        leadId: lead.id,
        type: "created",
        data: JSON.stringify({
          source: parsed.source,
          channel: parsed.metadata,
          rawInput: parsed,
        }),
      },
    });

    return {
      status: "completed",
      output: {
        leadId: lead.id,
        duplicated: false,
        nextAction: "qualification",
        message: "Lead created successfully",
      },
    };
  }
}
