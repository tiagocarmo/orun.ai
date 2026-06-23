import { z } from "zod";

// Agent schemas
export const createAgentSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  prompt: z.string().min(1),
  model: z.string().default("gpt-4o"),
  maxTokens: z.number().int().min(1).max(128000).default(4096),
  temperature: z.number().min(0).max(2).default(0.7),
  config: z.record(z.unknown()).optional(),
});

export const updateAgentSchema = createAgentSchema.partial().extend({
  isActive: z.boolean().optional(),
});

// Lead schemas
export const createLeadSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(50).optional().or(z.literal("")),
  company: z.string().max(200).optional().or(z.literal("")),
  source: z.string().max(100).optional().or(z.literal("")),
  message: z.string().max(5000).optional().or(z.literal("")),
  metadata: z.record(z.unknown()).optional(),
});

export const updateLeadSchema = createLeadSchema.partial().extend({
  status: z.enum(["new", "qualified", "nurturing", "disqualified", "converted", "archived"]).optional(),
  qualificationScore: z.number().int().min(0).max(100).optional(),
  qualificationReason: z.string().optional(),
});

// Conversation schemas
export const createConversationSchema = z.object({
  leadId: z.string().optional(),
  title: z.string().max(200).optional(),
});

export const addMessageSchema = z.object({
  conversationId: z.string(),
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1),
  metadata: z.record(z.unknown()).optional(),
});

// Agent Run schemas
export const runAgentSchema = z.object({
  agentSlug: z.string(),
  input: z.record(z.unknown()),
});

// Workflow schemas
export const createWorkflowSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  steps: z.array(z.record(z.unknown())),
});

// Document schemas
export const createDocumentSchema = z.object({
  name: z.string().min(1).max(200),
  type: z.enum(["proposal", "contract", "minutes", "other"]),
  content: z.record(z.unknown()),
  templateId: z.string().optional(),
  leadId: z.string().optional(),
});

// Webhook schemas
export const webhookLeadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  source: z.string().optional(),
  message: z.string().optional(),
  externalId: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

// Types inferred from schemas
export type CreateAgentInput = z.infer<typeof createAgentSchema>;
export type UpdateAgentInput = z.infer<typeof updateAgentSchema>;
export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type CreateConversationInput = z.infer<typeof createConversationSchema>;
export type AddMessageInput = z.infer<typeof addMessageSchema>;
export type RunAgentInput = z.infer<typeof runAgentSchema>;
export type CreateWorkflowInput = z.infer<typeof createWorkflowSchema>;
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type WebhookLeadInput = z.infer<typeof webhookLeadSchema>;
