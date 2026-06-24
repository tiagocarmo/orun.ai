import { db } from "@/lib/db";
import { AbstractAgent } from "./base";
import { AgentDefinition, AgentContext, AgentExecuteResult } from "./types";
import { webhookLeadSchema } from "@/lib/validators";
import { parseLeadMetadata, stringifyLeadMetadata } from "@/lib/leads/metadata";

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
    context: AgentContext
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
        await db.leadEvent.create({
          data: {
            leadId: existing.id,
            type: "intake_duplicate_detected",
            data: JSON.stringify({
              identifier: "email",
              value: parsed.email,
              runId: context.runId,
            }),
          },
        });
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
        await db.leadEvent.create({
          data: {
            leadId: existing.id,
            type: "intake_duplicate_detected",
            data: JSON.stringify({
              identifier: "phone",
              value: parsed.phone,
              runId: context.runId,
            }),
          },
        });
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
      const candidates = await db.lead.findMany({
        where: { metadata: { not: null } },
        select: { id: true, metadata: true },
      });
      const existing = candidates.find((candidate) => {
        const metadata = parseLeadMetadata(candidate.metadata);
        return metadata.externalId === parsed.externalId;
      });
      if (existing) {
        await db.leadEvent.create({
          data: {
            leadId: existing.id,
            type: "intake_duplicate_detected",
            data: JSON.stringify({
              identifier: "externalId",
              value: parsed.externalId,
              runId: context.runId,
            }),
          },
        });
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
        metadata: stringifyLeadMetadata(
          parsed.externalId
            ? {
              externalId: parsed.externalId,
              ...(((parsed.metadata as Record<string, unknown> | undefined) ?? {})),
            }
            : parsed.metadata
        ),
      },
    });

    await db.leadEvent.create({
      data: {
        leadId: lead.id,
        type: "created",
        data: JSON.stringify({
          source: parsed.source,
          externalId: parsed.externalId,
          metadata: parsed.metadata ?? null,
          runId: context.runId,
          agent: this.getSlug(),
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
