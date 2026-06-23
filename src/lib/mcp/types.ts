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
