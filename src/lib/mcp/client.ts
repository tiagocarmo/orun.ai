import { mcpRegistry } from "./registry";
import { MCPToolResult, MCPToolExecutionLog, MCPToolOptions } from "./types";

const executionLogs: MCPToolExecutionLog[] = [];

export async function callTool(
  name: string,
  input: Record<string, unknown>
): Promise<MCPToolResult> {
  const tool = mcpRegistry.get(name);
  if (!tool) {
    return {
      content: [{ type: "text", text: `Tool '${name}' not found` }],
      isError: true,
    };
  }

  const startTime = Date.now();
  const log: MCPToolExecutionLog = {
    toolName: name,
    input,
    durationMs: 0,
    timestamp: new Date().toISOString(),
    retries: 0,
  };

  try {
    const result = await tool.execute(input);
    log.output = result;
    log.durationMs = Date.now() - startTime;
    executionLogs.push(log);
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log.error = errorMessage;
    log.durationMs = Date.now() - startTime;
    executionLogs.push(log);
    return {
      content: [{ type: "text", text: `Error executing tool '${name}': ${errorMessage}` }],
      isError: true,
    };
  }
}

export async function callToolWithRetry(
  name: string,
  input: Record<string, unknown>,
  options: MCPToolOptions = {}
): Promise<MCPToolResult> {
  const { maxRetries = 0, retryDelayMs = 1000 } = options;

  let lastError: string | undefined;
  let retries = 0;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const result = await callTool(name, input);

    if (!result.isError) {
      return result;
    }

    lastError = result.content[0]?.text ?? "Unknown error";
    retries = attempt;

    if (attempt < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
    }
  }

  return {
    content: [{ type: "text", text: `Tool '${name}' failed after ${retries + 1} attempts: ${lastError}` }],
    isError: true,
  };
}

export function getExecutionLogs(toolName?: string): MCPToolExecutionLog[] {
  if (toolName) {
    return executionLogs.filter((log) => log.toolName === toolName);
  }
  return [...executionLogs];
}

export function clearExecutionLogs(): void {
  executionLogs.length = 0;
}
