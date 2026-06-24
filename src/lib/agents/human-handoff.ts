import { db } from "@/lib/db";
import { AbstractAgent } from "./base";
import { AgentDefinition, AgentContext, AgentExecuteResult } from "./types";
import { z } from "zod";

const humanHandoffInputSchema = z.object({
  leadId: z.string().min(1, "leadId is required"),
  reason: z.string().min(1, "reason is required"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  conversationContext: z.string().optional(),
  assignedTo: z.string().optional(),
});

const LOW_CONFIDENCE_THRESHOLD = 30;
const HIGH_PRIORITY_REASONS = ["legal", "financial", "contract", "complaint"];

export class HumanHandoffAgent extends AbstractAgent {
  definition(): AgentDefinition {
    return {
      slug: "human-handoff",
      name: "Agente de Escalação Humana",
      description: "Identifica quando a automação deve ser interrompida e transferida para uma pessoa",
    };
  }

  validate(input: Record<string, unknown>): { valid: boolean; errors?: string[] } {
    const result = humanHandoffInputSchema.safeParse(input);
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

    const { leadId, reason, priority, conversationContext, assignedTo } =
      humanHandoffInputSchema.parse(input);

    const lead = await db.lead.findUnique({ where: { id: leadId } });
    if (!lead) {
      return {
        status: "failed",
        error: `Lead not found: ${leadId}`,
      };
    }

    const autoPriority = determinePriority(reason, lead.qualificationScore);
    const finalPriority = priority === "medium" ? autoPriority : priority;
    const finalAssignedTo = assignedTo ?? selectAssignee(finalPriority);

    await db.leadEvent.create({
      data: {
        leadId,
        type: "human_handoff",
        data: JSON.stringify({
          reason,
          priority: finalPriority,
          assignedTo: finalAssignedTo,
          conversationContext,
          qualificationScore: lead.qualificationScore,
          runId: context.runId,
          model: context.model,
        }),
      },
    });

    if (lead.status !== "escalated") {
      await db.lead.update({
        where: { id: leadId },
        data: { status: "escalated" },
      });
    }

    return {
      status: "completed",
      output: {
        leadId,
        escalated: true,
        reason,
        priority: finalPriority,
        assignedTo: finalAssignedTo,
        summary: `Lead escalated to human (${finalPriority} priority): ${reason}`,
      },
    };
  }
}

function determinePriority(
  reason: string,
  qualificationScore: number | null
): "low" | "medium" | "high" | "urgent" {
  const lowerReason = reason.toLowerCase();

  for (const highPriorityReason of HIGH_PRIORITY_REASONS) {
    if (lowerReason.includes(highPriorityReason)) {
      return "high";
    }
  }

  if (qualificationScore !== null && qualificationScore >= 80) {
    return "high";
  }

  if (qualificationScore !== null && qualificationScore < LOW_CONFIDENCE_THRESHOLD) {
    return "medium";
  }

  return "low";
}

function selectAssignee(priority: string): string {
  const assignees: Record<string, string> = {
    urgent: "sales-director",
    high: "senior-sales",
    medium: "sales-team",
    low: "sales-queue",
  };
  return assignees[priority] ?? "sales-queue";
}
