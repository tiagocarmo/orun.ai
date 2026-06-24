import { describe, expect, it } from "vitest";
import {
  getRolePermissions,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
} from "./roles";

describe("RBAC Roles", () => {
  describe("getRolePermissions", () => {
    it("returns all permissions for admin", () => {
      const perms = getRolePermissions("admin");
      expect(perms).toContain("agents:read");
      expect(perms).toContain("agents:write");
      expect(perms).toContain("agents:execute");
      expect(perms).toContain("leads:read");
      expect(perms).toContain("leads:write");
      expect(perms).toContain("leads:delete");
      expect(perms).toContain("settings:read");
      expect(perms).toContain("settings:write");
      expect(perms).toContain("users:read");
      expect(perms).toContain("users:write");
      expect(perms).toContain("audit:read");
    });

    it("returns limited permissions for operator", () => {
      const perms = getRolePermissions("operator");
      expect(perms).toContain("agents:read");
      expect(perms).toContain("agents:execute");
      expect(perms).toContain("leads:read");
      expect(perms).toContain("leads:write");
      expect(perms).not.toContain("leads:delete");
      expect(perms).not.toContain("settings:write");
      expect(perms).not.toContain("users:write");
    });

    it("returns read-only permissions for viewer", () => {
      const perms = getRolePermissions("viewer");
      expect(perms).toContain("agents:read");
      expect(perms).toContain("leads:read");
      expect(perms).toContain("metrics:read");
      expect(perms).not.toContain("agents:execute");
      expect(perms).not.toContain("leads:write");
      expect(perms).not.toContain("leads:delete");
    });
  });

  describe("hasPermission", () => {
    it("admin has agents:write", () => {
      expect(hasPermission("admin", "agents:write")).toBe(true);
    });

    it("operator does not have leads:delete", () => {
      expect(hasPermission("operator", "leads:delete")).toBe(false);
    });

    it("viewer does not have agents:execute", () => {
      expect(hasPermission("viewer", "agents:execute")).toBe(false);
    });

    it("viewer has metrics:read", () => {
      expect(hasPermission("viewer", "metrics:read")).toBe(true);
    });
  });

  describe("hasAnyPermission", () => {
    it("admin has any permission", () => {
      expect(hasAnyPermission("admin", ["leads:delete", "settings:write"])).toBe(true);
    });

    it("operator has at least one of the two", () => {
      expect(hasAnyPermission("operator", ["leads:write", "leads:delete"])).toBe(true);
    });

    it("viewer has none of write permissions", () => {
      expect(hasAnyPermission("viewer", ["leads:write", "agents:execute"])).toBe(false);
    });
  });

  describe("hasAllPermissions", () => {
    it("admin has all permissions", () => {
      expect(hasAllPermissions("admin", ["leads:read", "leads:write", "leads:delete"])).toBe(true);
    });

    it("operator missing leads:delete fails all check", () => {
      expect(hasAllPermissions("operator", ["leads:read", "leads:delete"])).toBe(false);
    });

    it("viewer has all read permissions", () => {
      expect(hasAllPermissions("viewer", ["agents:read", "leads:read", "workflows:read"])).toBe(true);
    });
  });
});
