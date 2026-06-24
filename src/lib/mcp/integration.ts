import { db } from "@/lib/db";
import { callTool } from "./client";
import { MCPToolResult } from "./types";

export async function executeToolWithIntegration(
  toolName: string,
  integrationId: string,
  input: Record<string, unknown>
): Promise<MCPToolResult> {
  const integration = await db.integration.findUnique({
    where: { id: integrationId },
  });

  if (!integration) {
    return {
      content: [{ type: "text", text: `Integration '${integrationId}' not found` }],
      isError: true,
    };
  }

  if (!integration.isActive) {
    return {
      content: [{ type: "text", text: `Integration '${integrationId}' is not active` }],
      isError: true,
    };
  }

  const config = integration.config ? JSON.parse(integration.config) : {};
  const enrichedInput = {
    ...input,
    _integration: {
      id: integration.id,
      name: integration.name,
      type: integration.type,
      provider: integration.provider,
      config,
    },
  };

  return callTool(toolName, enrichedInput);
}

export async function getAvailableIntegrations(type?: string) {
  const where = {
    isActive: true,
    ...(type ? { type } : {}),
  };

  return db.integration.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

export async function resolveSecretReference(secretRef: string): Promise<string | null> {
  if (!secretRef) return null;

  if (secretRef.startsWith("env:")) {
    const envVar = secretRef.slice(4);
    return process.env[envVar] ?? null;
  }

  return secretRef;
}
