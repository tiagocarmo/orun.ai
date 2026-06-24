import { BaseMCPTool } from "./base";
import { MCPToolDefinition, MCPToolResult, MCPToolOptions } from "../types";

export class CheckAvailabilityTool extends BaseMCPTool {
  definition(): MCPToolDefinition {
    return {
      name: "calendar-check-availability",
      description: "Check meeting availability for a given date and time range",
      inputSchema: {
        type: "object",
        properties: {
          date: { type: "string", description: "Date in YYYY-MM-DD format" },
          startTime: { type: "string", description: "Start time in HH:MM format" },
          endTime: { type: "string", description: "End time in HH:MM format" },
          durationMinutes: { type: "number", description: "Meeting duration in minutes" },
        },
        required: ["date", "startTime", "endTime"],
      },
    };
  }

  getOptions(): MCPToolOptions {
    return {
      maxRetries: 0,
      timeoutMs: 5000,
      requiredPermissions: [
        { action: "read", resource: "calendar" },
      ],
    };
  }

  async execute(input: Record<string, unknown>): Promise<MCPToolResult> {
    const { date, startTime, endTime, durationMinutes } = input as {
      date: string;
      startTime: string;
      endTime: string;
      durationMinutes?: number;
    };

    if (!date || !startTime || !endTime) {
      return this.createErrorResult("Missing required fields: date, startTime, endTime");
    }

    const duration = durationMinutes ?? 30;
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return this.createErrorResult("Invalid date or time format");
    }

    if (start >= end) {
      return this.createErrorResult("startTime must be before endTime");
    }

    const slots = generateTimeSlots(start, end, duration);
    const availableSlots = slots.filter(() => Math.random() > 0.3);

    return this.createSuccessResult(
      JSON.stringify({
        date,
        requestedRange: { startTime, endTime },
        durationMinutes: duration,
        availableSlots: availableSlots.map((s) => ({
          startTime: s.start,
          endTime: s.end,
          available: true,
        })),
        totalSlots: slots.length,
        availableCount: availableSlots.length,
      })
    );
  }
}

function generateTimeSlots(
  start: Date,
  end: Date,
  durationMinutes: number
): Array<{ start: string; end: string }> {
  const slots: Array<{ start: string; end: string }> = [];
  const current = new Date(start);

  while (current.getTime() + durationMinutes * 60000 <= end.getTime()) {
    const slotEnd = new Date(current.getTime() + durationMinutes * 60000);
    slots.push({
      start: current.toTimeString().slice(0, 5),
      end: slotEnd.toTimeString().slice(0, 5),
    });
    current.setTime(slotEnd.getTime());
  }

  return slots;
}

export class CreateEventTool extends BaseMCPTool {
  definition(): MCPToolDefinition {
    return {
      name: "calendar-create-event",
      description: "Create a calendar event (stub implementation)",
      inputSchema: {
        type: "object",
        properties: {
          title: { type: "string", description: "Event title" },
          date: { type: "string", description: "Date in YYYY-MM-DD format" },
          startTime: { type: "string", description: "Start time in HH:MM format" },
          endTime: { type: "string", description: "End time in HH:MM format" },
          description: { type: "string", description: "Event description" },
          attendees: { type: "array", items: { type: "string" }, description: "Attendee emails" },
        },
        required: ["title", "date", "startTime", "endTime"],
      },
    };
  }

  getOptions(): MCPToolOptions {
    return {
      maxRetries: 0,
      timeoutMs: 5000,
      requiredPermissions: [
        { action: "write", resource: "calendar", requiresApproval: true },
      ],
    };
  }

  async execute(input: Record<string, unknown>): Promise<MCPToolResult> {
    const { title, date, startTime, endTime, description, attendees } = input as {
      title: string;
      date: string;
      startTime: string;
      endTime: string;
      description?: string;
      attendees?: string[];
    };

    if (!title || !date || !startTime || !endTime) {
      return this.createErrorResult("Missing required fields: title, date, startTime, endTime");
    }

    const eventId = `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    return this.createSuccessResult(
      JSON.stringify({
        eventId,
        title,
        date,
        startTime,
        endTime,
        description: description ?? "",
        attendees: attendees ?? [],
        status: "created",
        isStub: true,
        message: "Event created (stub implementation - no real calendar API connected)",
      })
    );
  }
}
