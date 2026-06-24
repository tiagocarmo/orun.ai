import { db } from "@/lib/db";
import { AbstractAgent } from "./base";
import { AgentDefinition, AgentContext, AgentExecuteResult } from "./types";
import { z } from "zod";

const followUpInputSchema = z.object({
  leadId: z.string().min(1, "leadId is required"),
  actionType: z.enum(["email", "whatsapp", "sms", "call"]),
  message: z.string().min(1, "message is required"),
  channel: z.string().optional(),
});

const MAX_FOLLOW_UP_ATTEMPTS = 5;

export class FollowUpAgent extends AbstractAgent {
  definition(): AgentDefinition {
    return {
      slug: "follow-up",
      name: "Agente de Follow-up",
      description: "Executa lembretes, cobranças educadas e reativações de leads",
    };
  }

  validate(input: Record<string, unknown>): { valid: boolean; errors?: string[] } {
    const result = followUpInputSchema.safeParse(input);
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

    const { leadId, actionType, message, channel } = followUpInputSchema.parse(input);

    const lead = await db.lead.findUnique({ where: { id: leadId } });
    if (!lead) {
      return {
        status: "failed",
        error: `Lead not found: ${leadId}`,
      };
    }

    const followUpEvents = await db.leadEvent.findMany({
      where: {
        leadId,
        type: "follow_up_sent",
      },
    });

    if (followUpEvents.length >= MAX_FOLLOW_UP_ATTEMPTS) {
      return {
        status: "completed",
        output: {
          leadId,
          actionExecuted: false,
          reason: "Maximum follow-up attempts reached",
          attempts: followUpEvents.length,
          message: `Lead has reached maximum follow-up attempts (${MAX_FOLLOW_UP_ATTEMPTS})`,
        },
      };
    }

    await db.leadEvent.create({
      data: {
        leadId,
        type: "follow_up_sent",
        data: JSON.stringify({
          actionType,
          channel: channel ?? actionType,
          message,
          attemptNumber: followUpEvents.length + 1,
          runId: context.runId,
          model: context.model,
        }),
      },
    });

    const nextFollowUp = calculateNextFollowUp(followUpEvents.length + 1);

    return {
      status: "completed",
      output: {
        leadId,
        actionExecuted: true,
        actionType,
        channel: channel ?? actionType,
        attemptNumber: followUpEvents.length + 1,
        nextFollowUp,
        message: `Follow-up sent via ${actionType}`,
      },
    };
  }
}

function calculateNextFollowUp(attemptNumber: number): string {
  const days = attemptNumber === 1 ? 1 : attemptNumber === 2 ? 3 : 7;
  const next = new Date();
  next.setDate(next.getDate() + days);
  return next.toISOString();
}
