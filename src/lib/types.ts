import type {
  Agent,
  AgentVersion,
  AgentRun,
  AgentLog,
  Lead,
  LeadEvent,
  Conversation,
  Message,
  Workflow,
  WorkflowRun,
  Document,
  DocumentChunk,
  Integration,
  ScheduledTask,
} from "@prisma/client";

// Re-export Prisma types
export type {
  Agent,
  AgentVersion,
  AgentRun,
  AgentLog,
  Lead,
  LeadEvent,
  Conversation,
  Message,
  Workflow,
  WorkflowRun,
  Document,
  DocumentChunk,
  Integration,
  ScheduledTask,
};

// API Response types
export type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
  details?: Record<string, string[]>;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

// Agent with relations
export type AgentWithVersions = Agent & {
  versions: AgentVersion[];
};

export type AgentRunWithLogs = AgentRun & {
  agent: Agent;
  logs: AgentLog[];
};

// Lead with relations
export type LeadWithEvents = Lead & {
  events: LeadEvent[];
};

export type LeadWithConversations = Lead & {
  conversations: Conversation[];
};

// Conversation with relations
export type ConversationWithMessages = Conversation & {
  messages: Message[];
  lead?: Lead | null;
};

// Workflow with relations
export type WorkflowWithRuns = Workflow & {
  runs: WorkflowRun[];
};

// Document with relations
export type DocumentWithChunks = Document & {
  chunks: DocumentChunk[];
};

// LLM types
export type LLMProvider = "openai" | "anthropic" | "deepseek";

export type LLMCompletionOptions = {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
};

export type LLMCompletionResult = {
  text: string;
  tokens: {
    prompt: number;
    completion: number;
    total: number;
  };
  model: string;
  durationMs: number;
};

// Agent execution types
export type AgentExecutionResult = {
  runId: string;
  status: "completed" | "failed";
  output?: unknown;
  error?: string;
  durationMs: number;
  tokensConsumed: number;
};
