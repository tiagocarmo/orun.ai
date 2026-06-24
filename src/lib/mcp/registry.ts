import { db } from "@/lib/db";
import { MCPTool, MCPToolDefinition, MCPServerInfo } from "./types";

class MCPToolRegistry {
  private tools = new Map<string, MCPTool>();

  register(tool: MCPTool): void {
    const def = tool.definition();
    this.tools.set(def.name, tool);
  }

  get(name: string): MCPTool | undefined {
    return this.tools.get(name);
  }

  has(name: string): boolean {
    return this.tools.has(name);
  }

  list(): MCPToolDefinition[] {
    return Array.from(this.tools.values()).map((t) => t.definition());
  }

  serverInfo(): MCPServerInfo {
    return {
      name: "orun-ai-mcp",
      version: "1.0.0",
      tools: this.list(),
    };
  }
}

export const mcpRegistry = new MCPToolRegistry();

export async function getIntegrations() {
  return db.integration.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createIntegration(data: {
  name: string;
  type: string;
  provider?: string;
  config?: Record<string, unknown>;
  secretRef?: string;
}) {
  return db.integration.create({
    data: {
      name: data.name,
      type: data.type,
      provider: data.provider ?? null,
      config: data.config ? JSON.stringify(data.config) : null,
      secretRef: data.secretRef ?? null,
      isActive: true,
    },
  });
}

export async function updateIntegration(
  id: string,
  data: {
    name?: string;
    isActive?: boolean;
    config?: Record<string, unknown>;
  }
) {
  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;
  if (data.config !== undefined) updateData.config = JSON.stringify(data.config);

  return db.integration.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteIntegration(id: string) {
  return db.integration.delete({ where: { id } });
}
