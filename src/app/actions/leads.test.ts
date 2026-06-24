import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", async () => {
  const { mockDb } = await import("../../test/mocks/db");
  return { db: mockDb };
});

vi.mock("next/cache", async () => {
  const { revalidatePath } = await import("../../test/mocks/next-cache");
  return { revalidatePath };
});

import { createLead, deleteLead, searchLeads, updateLead } from "./leads";
import { mockDb, resetDbMocks } from "../../test/mocks/db";
import { revalidatePath, resetNextCacheMocks } from "../../test/mocks/next-cache";

describe("lead actions", () => {
  beforeEach(() => {
    resetDbMocks();
    resetNextCacheMocks();
  });

  it("creates a lead, persists metadata and emits the created event", async () => {
    mockDb.lead.findFirst.mockResolvedValue(null);
    mockDb.lead.create.mockResolvedValue({ id: "lead-create" });

    const result = await createLead({
      name: "Lead Novo",
      email: "novo@example.com",
      source: "site",
      metadata: { campaign: "launch" },
    });

    expect(mockDb.lead.create).toHaveBeenCalledWith({
      data: {
        name: "Lead Novo",
        email: "novo@example.com",
        phone: null,
        company: null,
        source: "site",
        externalId: null,
        message: null,
        status: "new",
        metadata: JSON.stringify({ campaign: "launch" }),
      },
    });
    expect(mockDb.leadEvent.create).toHaveBeenCalledWith({
      data: {
        leadId: "lead-create",
        type: "created",
        data: JSON.stringify({ source: "site", externalId: null }),
      },
    });
    expect(revalidatePath).toHaveBeenCalledWith("/");
    expect(result).toEqual({ success: true, data: { id: "lead-create" } });
  });

  it("blocks duplicate emails during lead creation", async () => {
    mockDb.lead.findFirst.mockResolvedValueOnce({ id: "lead-existing" });

    const result = await createLead({
      name: "Duplicado",
      email: "duplicado@example.com",
    });

    expect(mockDb.lead.create).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      error: "A lead with this email already exists",
    });
  });

  it("stores externalId in its own column and strips it from metadata", async () => {
    mockDb.lead.findFirst.mockResolvedValue(null);
    mockDb.lead.create.mockResolvedValue({ id: "lead-external" });

    const result = await createLead({
      name: "Lead Externo",
      externalId: "crm-123",
      metadata: { externalId: "legacy-123", campaign: "launch" },
    });

    expect(mockDb.lead.create).toHaveBeenCalledWith({
      data: {
        name: "Lead Externo",
        email: null,
        phone: null,
        company: null,
        source: null,
        externalId: "crm-123",
        message: null,
        status: "new",
        metadata: JSON.stringify({ campaign: "launch" }),
      },
    });
    expect(result).toEqual({ success: true, data: { id: "lead-external" } });
  });

  it("stores the last active status when archiving a lead", async () => {
    mockDb.lead.findFirst.mockResolvedValue({
      id: "lead-1",
      status: "qualified",
      metadata: JSON.stringify({ source: "site" }),
    });
    mockDb.lead.update.mockResolvedValue({ id: "lead-1" });

    const result = await updateLead("lead-1", { status: "archived" });

    expect(mockDb.lead.update).toHaveBeenCalledWith({
      where: { id: "lead-1" },
      data: {
        status: "archived",
        metadata: JSON.stringify({ source: "site", lastActiveStatus: "qualified" }),
      },
    });
    expect(mockDb.leadEvent.create).toHaveBeenCalledWith({
      data: {
        leadId: "lead-1",
        type: "archived",
        data: JSON.stringify({ from: "qualified", to: "archived" }),
      },
    });
    expect(revalidatePath).toHaveBeenCalledWith("/");
    expect(result).toEqual({ success: true, data: { id: "lead-1" } });
  });

  it("clears the stored active status when unarchiving a lead", async () => {
    mockDb.lead.findFirst.mockResolvedValue({
      id: "lead-2",
      status: "archived",
      metadata: JSON.stringify({ source: "site", lastActiveStatus: "nurturing" }),
    });
    mockDb.lead.update.mockResolvedValue({ id: "lead-2" });

    const result = await updateLead("lead-2", { status: "nurturing" });

    expect(mockDb.lead.update).toHaveBeenCalledWith({
      where: { id: "lead-2" },
      data: {
        status: "nurturing",
        metadata: JSON.stringify({ source: "site" }),
      },
    });
    expect(mockDb.leadEvent.create).toHaveBeenCalledWith({
      data: {
        leadId: "lead-2",
        type: "unarchived",
        data: JSON.stringify({ from: "archived", to: "nurturing" }),
      },
    });
    expect(result).toEqual({ success: true, data: { id: "lead-2" } });
  });

  it("short-circuits search when the query is too short", async () => {
    const result = await searchLeads("ab");

    expect(mockDb.lead.findMany).not.toHaveBeenCalled();
    expect(result).toEqual({ success: true, data: [] });
  });

  it("deletes an existing lead and revalidates the dashboard", async () => {
    mockDb.lead.findFirst.mockResolvedValue({ id: "lead-delete", status: "qualified" });
    mockDb.lead.update.mockResolvedValue({ id: "lead-delete" });

    const result = await deleteLead("lead-delete");

    expect(mockDb.lead.update).toHaveBeenCalledWith({
      where: { id: "lead-delete" },
      data: { deletedAt: expect.any(Date) },
    });
    expect(mockDb.leadEvent.create).toHaveBeenCalledWith({
      data: {
        leadId: "lead-delete",
        type: "deleted",
        data: JSON.stringify({ status: "qualified" }),
      },
    });
    expect(revalidatePath).toHaveBeenCalledWith("/");
    expect(result).toEqual({
      success: true,
      data: { deleted: true },
    });
  });
});
