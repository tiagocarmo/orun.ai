import { describe, expect, it } from "vitest";

import { buildLeadRunInput } from "./manual-input";

describe("buildLeadRunInput", () => {
  it("includes leadId in the manual agent payload", () => {
    const input = buildLeadRunInput({
      id: "lead-1",
      name: "Joao Silva",
      email: "joao@example.com",
      phone: "+55 11 99999-9999",
      company: "Orun",
    });

    expect(JSON.parse(input)).toEqual({
      leadId: "lead-1",
      name: "Joao Silva",
      email: "joao@example.com",
      phone: "+55 11 99999-9999",
      company: "Orun",
    });
  });
});
