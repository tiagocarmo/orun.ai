import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockDb, revalidatePath } = vi.hoisted(() => ({
  mockDb: {
    lead: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    leadEvent: {
      create: vi.fn(),
    },
  },
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  db: mockDb,
}));

vi.mock("next/cache", () => ({
  revalidatePath,
}));

import { updateLead } from "./leads";

describe("updateLead", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("stores the last active status when archiving a lead", async () => {
    mockDb.lead.findUnique.mockResolvedValue({
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
    mockDb.lead.findUnique.mockResolvedValue({
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
});
