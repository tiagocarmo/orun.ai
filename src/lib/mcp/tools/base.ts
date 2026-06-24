import { MCPTool, MCPToolDefinition, MCPToolResult, MCPToolOptions } from "../types";

export abstract class BaseMCPTool implements MCPTool {
  abstract definition(): MCPToolDefinition;
  abstract execute(input: Record<string, unknown>): Promise<MCPToolResult>;

  getOptions(): MCPToolOptions {
    return {
      maxRetries: 0,
      retryDelayMs: 1000,
      timeoutMs: 30000,
      requiredPermissions: [],
    };
  }

  protected createSuccessResult(text: string): MCPToolResult {
    return {
      content: [{ type: "text", text }],
      isError: false,
    };
  }

  protected createErrorResult(error: string): MCPToolResult {
    return {
      content: [{ type: "text", text: `Error: ${error}` }],
      isError: true,
    };
  }

  protected createPermissionsResult(action: string, resource: string): MCPToolResult {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            requiresApproval: true,
            action,
            resource,
          }),
        },
      ],
      isError: false,
    };
  }
}
