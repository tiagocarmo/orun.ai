export const AGENT_STATUSES = ["active", "inactive"] as const;
export type AgentStatus = (typeof AGENT_STATUSES)[number];

export const LEAD_STATUSES = ["new", "qualified", "nurturing", "disqualified", "converted"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const RUN_STATUSES = ["pending", "running", "completed", "failed"] as const;
export type RunStatus = (typeof RUN_STATUSES)[number];

export const LOG_LEVELS = ["info", "warn", "error", "debug"] as const;
export type LogLevel = (typeof LOG_LEVELS)[number];

export const MESSAGE_ROLES = ["user", "assistant", "system"] as const;
export type MessageRole = (typeof MESSAGE_ROLES)[number];

export const CONVERSATION_STATUSES = ["active", "closed", "archived"] as const;
export type ConversationStatus = (typeof CONVERSATION_STATUSES)[number];

export const WORKFLOW_STATUSES = ["pending", "running", "paused", "completed", "failed", "cancelled"] as const;
export type WorkflowStatus = (typeof WORKFLOW_STATUSES)[number];

export const DOCUMENT_TYPES = ["proposal", "contract", "minutes", "other"] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const INTEGRATION_TYPES = ["mcp", "webhook", "api"] as const;
export type IntegrationType = (typeof INTEGRATION_TYPES)[number];

export const TASK_STATUSES = ["pending", "running", "completed", "failed", "cancelled"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const LEAD_EVENT_TYPES = [
  "created",
  "qualified",
  "status_changed",
  "archived",
  "unarchived",
  "intake_duplicate_detected",
  "note",
  "enriched",
  "contacted",
] as const;
export type LeadEventType = (typeof LEAD_EVENT_TYPES)[number];
