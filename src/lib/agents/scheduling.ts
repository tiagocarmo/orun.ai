import { db } from "@/lib/db";
import { AbstractAgent } from "./base";
import { AgentDefinition, AgentContext, AgentExecuteResult } from "./types";
import { z } from "zod";

const schedulingInputSchema = z.object({
  leadId: z.string().min(1, "leadId is required"),
  preferredTime: z.string().optional(),
  duration: z.number().min(15).max(480).default(30),
  notes: z.string().optional(),
});

export class SchedulingAgent extends AbstractAgent {
  definition(): AgentDefinition {
    return {
      slug: "scheduling",
      name: "Agente de Agendamento",
      description: "Agenda reuniões com leads qualificados",
    };
  }

  validate(input: Record<string, unknown>): { valid: boolean; errors?: string[] } {
    const result = schedulingInputSchema.safeParse(input);
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

    const { leadId, preferredTime, duration, notes } = schedulingInputSchema.parse(input);

    const lead = await db.lead.findUnique({ where: { id: leadId } });
    if (!lead) {
      return {
        status: "failed",
        error: `Lead not found: ${leadId}`,
      };
    }

    const scheduledTime = preferredTime ?? generateDefaultTime();
    const meetingId = `mtg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    await db.leadEvent.create({
      data: {
        leadId,
        type: "meeting_scheduled",
        data: JSON.stringify({
          meetingId,
          scheduledTime,
          duration,
          notes,
          runId: context.runId,
          model: context.model,
        }),
      },
    });

    return {
      status: "completed",
      output: {
        leadId,
        meetingId,
        scheduledTime,
        duration,
        meetingScheduled: true,
        message: `Meeting scheduled for ${scheduledTime}`,
      },
    };
  }
}

function generateDefaultTime(): string {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  now.setHours(10, 0, 0, 0);
  return now.toISOString();
}
