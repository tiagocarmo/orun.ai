import { describe, expect, it } from "vitest";
import {
  getActionLimits,
  getActionLimit,
  checkActionLimit,
  requiresApproval,
  createApprovalRequest,
  approveRequest,
  denyRequest,
  listPendingApprovals,
  evaluateAction,
  SensitiveAction,
} from "./governance";
import { AuthUser } from "@/lib/auth/types";

describe("Security Governance", () => {
  const adminUser: AuthUser = {
    id: "user-1",
    email: "admin@test.com",
    name: "Admin",
    role: "admin",
  };

  const operatorUser: AuthUser = {
    id: "user-2",
    email: "operator@test.com",
    name: "Operator",
    role: "operator",
  };

  describe("Action Limits", () => {
    it("returns default action limits", () => {
      const limits = getActionLimits();
      expect(limits.length).toBeGreaterThan(0);
      expect(limits.some((l) => l.action === "agent:execute")).toBe(true);
    });

    it("returns limit for specific action", () => {
      const limit = getActionLimit("agent:execute");
      expect(limit).toBeDefined();
      expect(limit?.maxPerHour).toBe(50);
      expect(limit?.maxPerDay).toBe(500);
    });

    it("allows action within limits", () => {
      const result = checkActionLimit("agent:execute");
      expect(result.allowed).toBe(true);
    });

    it("returns limit for all default actions", () => {
      const actions: SensitiveAction[] = [
        "agent:execute", "agent:delete", "lead:delete",
        "workflow:execute", "workflow:delete",
        "integration:create", "integration:update", "integration:delete",
        "document:delete", "user:delete", "settings:update",
      ];
      for (const action of actions) {
        const limit = getActionLimit(action);
        expect(limit).toBeDefined();
        expect(limit?.maxPerHour).toBeGreaterThan(0);
        expect(limit?.maxPerDay).toBeGreaterThan(0);
      }
    });
  });

  describe("Requires Approval", () => {
    it("delete actions require approval", () => {
      expect(requiresApproval("agent:delete")).toBe(true);
      expect(requiresApproval("lead:delete")).toBe(true);
      expect(requiresApproval("workflow:delete")).toBe(true);
      expect(requiresApproval("integration:delete")).toBe(true);
      expect(requiresApproval("user:delete")).toBe(true);
      expect(requiresApproval("settings:update")).toBe(true);
    });

    it("non-delete actions do not require approval", () => {
      expect(requiresApproval("agent:execute")).toBe(false);
      expect(requiresApproval("lead:delete")).toBe(true);
      expect(requiresApproval("integration:create")).toBe(false);
    });
  });

  describe("Approval Requests", () => {
    it("creates an approval request", () => {
      const request = createApprovalRequest("agent:delete", adminUser, "agent", "agent-1", "Testing deletion");
      expect(request.id).toMatch(/^apr_/);
      expect(request.action).toBe("agent:delete");
      expect(request.status).toBe("pending");
      expect(request.requestedBy.id).toBe("user-1");
    });

    it("approves a pending request", () => {
      const request = createApprovalRequest("lead:delete", operatorUser, "lead", "lead-1");
      const approved = approveRequest(request.id, "reviewer-1");
      expect(approved).not.toBeNull();
      expect(approved?.status).toBe("approved");
      expect(approved?.reviewedBy).toBe("reviewer-1");
      expect(approved?.reviewedAt).toBeInstanceOf(Date);
    });

    it("denies a pending request", () => {
      const request = createApprovalRequest("user:delete", adminUser, "user", "user-2");
      const denied = denyRequest(request.id, "reviewer-1");
      expect(denied).not.toBeNull();
      expect(denied?.status).toBe("denied");
    });

    it("returns null for non-existent request", () => {
      expect(approveRequest("apr_nonexistent", "reviewer-1")).toBeNull();
      expect(denyRequest("apr_nonexistent", "reviewer-1")).toBeNull();
    });

    it("lists pending approvals", () => {
      const pending = listPendingApprovals();
      expect(Array.isArray(pending)).toBe(true);
    });
  });

  describe("evaluateAction", () => {
    it("allows non-sensitive actions", () => {
      const result = evaluateAction("agent:execute", operatorUser);
      expect(result.allowed).toBe(true);
      expect(result.requiresApproval).toBe(false);
    });

    it("requires approval for sensitive actions", () => {
      const result = evaluateAction("agent:delete", adminUser);
      expect(result.allowed).toBe(false);
      expect(result.requiresApproval).toBe(true);
      expect(result.approvalRequest).toBeDefined();
      expect(result.approvalRequest?.status).toBe("pending");
    });
  });
});
