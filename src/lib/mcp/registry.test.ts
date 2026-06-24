import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", async () => {
  const { mockDb } = await import("../../test/mocks/db");
  return { db: mockDb };
});

import { createIntegration, getIntegrations, updateIntegration } from "./registry";
import { mockDb, resetDbMocks } from "../../test/mocks/db";

describe("mcp registry persistence", () => {
  beforeEach(() => {
    resetDbMocks();
  });

  it("stores secret references instead of raw credentials", async () => {
    mockDb.integration.create.mockResolvedValue({ id: "integration-1" });

    await createIntegration({
      name: "HubSpot",
      type: "crm",
      provider: "hubspot",
      config: { portalId: "123" },
      secretRef: "env:HUBSPOT_API_KEY",
    });

    expect(mockDb.integration.create).toHaveBeenCalledWith({
      data: {
        name: "HubSpot",
        type: "crm",
        provider: "hubspot",
        config: JSON.stringify({ portalId: "123" }),
        secretRef: "env:HUBSPOT_API_KEY",
        isActive: true,
      },
    });
  });

  it("lists only active integrations ordered by recency", async () => {
    mockDb.integration.findMany.mockResolvedValue([]);

    await getIntegrations();

    expect(mockDb.integration.findMany).toHaveBeenCalledWith({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
  });

  it("serializes config updates without touching secret references", async () => {
    mockDb.integration.update.mockResolvedValue({ id: "integration-2" });

    await updateIntegration("integration-2", {
      name: "Salesforce",
      isActive: false,
      config: { sandbox: true },
    });

    expect(mockDb.integration.update).toHaveBeenCalledWith({
      where: { id: "integration-2" },
      data: {
        name: "Salesforce",
        isActive: false,
        config: JSON.stringify({ sandbox: true }),
      },
    });
  });
});
