export interface MCPToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export interface MCPTool {
  definition(): MCPToolDefinition;
  execute(input: Record<string, unknown>): Promise<MCPToolResult>;
}

export interface MCPToolResult {
  content: MCPToolContent[];
  isError?: boolean;
}

export interface MCPToolContent {
  type: "text" | "image" | "resource";
  text?: string;
  mimeType?: string;
  data?: string;
  uri?: string;
}

export interface MCPServerInfo {
  name: string;
  version: string;
  tools: MCPToolDefinition[];
}

export interface MCPToolOptions {
  maxRetries?: number;
  retryDelayMs?: number;
  timeoutMs?: number;
  requiredPermissions?: MCPToolPermission[];
}

export interface MCPToolPermission {
  action: string;
  resource: string;
  requiresApproval?: boolean;
}

export interface MCPToolExecutionLog {
  toolName: string;
  input: Record<string, unknown>;
  output?: MCPToolResult;
  error?: string;
  durationMs: number;
  timestamp: string;
  integrationId?: string;
  retries: number;
}
