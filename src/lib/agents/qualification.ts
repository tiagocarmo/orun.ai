import { db } from "@/lib/db";
import { AbstractAgent } from "./base";
import { AgentDefinition, AgentContext, AgentExecuteResult } from "./types";
import { z } from "zod";

const qualificationInputSchema = z.object({
  leadId: z.string().min(1, "leadId is required"),
});

export class QualificationAgent extends AbstractAgent {
  definition(): AgentDefinition {
    return {
      slug: "qualification",
      name: "Agente de Qualificação",
      description: "Qualifica leads com base em critérios e análise opcional por LLM",
    };
  }

  validate(input: Record<string, unknown>): { valid: boolean; errors?: string[] } {
    const result = qualificationInputSchema.safeParse(input);
    if (result.success) {
      return { valid: true };
    }
    const errors = Object.entries(result.error.flatten().fieldErrors).map(
      ([field, msgs]) => `${field}: ${msgs.join(", ")}`
    );
    return { valid: false, errors };
  }

  private calculateBaseScore(lead: {
    name: string | null;
    email: string | null;
    phone: string | null;
    company: string | null;
    message: string | null;
    source: string | null;
  }): { score: number; reasoning: string[] } {
    let score = 0;
    const reasoning: string[] = [];

    if (lead.name && lead.name.length > 2) {
      score += 10;
      reasoning.push("Valid name provided");
    }

    if (lead.email) {
      score += 15;
      reasoning.push("Email provided");
    }

    if (lead.phone) {
      score += 15;
      reasoning.push("Phone provided");
    }

    if (lead.company) {
      score += 20;
      reasoning.push("Company provided");
    }

    if (lead.message && lead.message.length > 10) {
      score += 20;
      reasoning.push("Detailed message provided");
    }

    if (lead.source) {
      score += 10;
      reasoning.push(`Lead from source: ${lead.source}`);
    }

    if (lead.company && lead.email && lead.phone) {
      score += 10;
      reasoning.push("Full contact information available");
    }

    return { score: Math.min(score, 100), reasoning };
  }

  private classify(score: number): "qualified" | "nurturing" | "disqualified" {
    if (score >= 60) return "qualified";
    if (score >= 30) return "nurturing";
    return "disqualified";
  }

  private suggestNextAction(
    classification: "qualified" | "nurturing" | "disqualified"
  ): string {
    switch (classification) {
      case "qualified":
        return "schedule-meeting";
      case "nurturing":
        return "follow-up";
      case "disqualified":
        return "no-action";
    }
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

    const { leadId } = qualificationInputSchema.parse(input);

    const lead = await db.lead.findUnique({ where: { id: leadId } });
    if (!lead) {
      return {
        status: "failed",
        error: `Lead not found: ${leadId}`,
      };
    }

    const { score, reasoning } = this.calculateBaseScore(lead);
    const classification = this.classify(score);
    const nextAction = this.suggestNextAction(classification);

    await db.lead.update({
      where: { id: leadId },
      data: {
        qualificationScore: score,
        qualificationReason: reasoning.join("; "),
        status: classification,
      },
    });

    await db.leadEvent.create({
      data: {
        leadId,
        type: "qualified",
        data: JSON.stringify({
          score,
          classification,
          reasoning,
          nextAction,
          model: context.model,
        }),
      },
    });

    return {
      status: "completed",
      output: {
        leadId,
        score,
        classification,
        reasoning,
        nextAction,
      },
    };
  }
}
