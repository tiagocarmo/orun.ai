# Operations and Security

## Overview

Point 08 of the Orun.AI sequential build plan adds authentication, data masking, governance controls, RBAC, and dashboard metrics.

## Components

### Auth (`src/lib/auth/`)

- **types.ts** — AuthUser, AuthSession, AuthResult, APIKeyConfig types
- **session.ts** — API key generation/validation, session token creation/verification (HMAC-SHA256 signed)
- **middleware.ts** — `authenticate()` extracts credentials from `x-api-key`, `Authorization: Bearer`, or session cookie; `withAuth()` wrapper for route handlers

### RBAC (`src/lib/rbac/`)

- **roles.ts** — Three roles (admin, operator, viewer) with granular permissions (20 permission types)
- **middleware.ts** — `requirePermission()`, `requireAnyPermission()`, `withPermission()` for route-level access control

### Security (`src/lib/security/`)

- **masking.ts** — PII masking strategies (full, partial, hash, redact) for names, emails, phones, and arbitrary objects
- **governance.ts** — Action rate limits (hourly/daily), approval workflows for sensitive actions (delete, settings update)
- **secrets.ts** — Secrets policy management, secret reference validation, secret redaction in logs

### Metrics (`src/lib/metrics/`)

- **dashboard.ts** — Dashboard metrics aggregation: lead counts/status, agent run stats (success/fail/duration/tokens), workflow metrics, conversation metrics

## Usage Examples

### Authentication

```typescript
import { authenticate } from "@/lib/auth/middleware";

const auth = authenticate(request);
if (!auth.authenticated) return unauthorized();
// auth.user is now available
```

### RBAC

```typescript
import { withPermission } from "@/lib/rbac/middleware";

export const GET = withPermission("agents:read")(async (request, user) => {
  return Response.json({ data: agents });
});
```

### Data Masking

```typescript
import { maskPII, maskLogData } from "@/lib/security/masking";

// Mask PII before logging
const safeLog = maskLogData({ name: "Maria", email: "maria@test.com" });
console.log(safeLog); // { name: "M***a", email: "m***a@test.com" }
```

### Governance

```typescript
import { evaluateAction } from "@/lib/security/governance";

const result = evaluateAction("agent:delete", user);
if (result.requiresApproval) {
  // Notify reviewer
}
if (!result.allowed && !result.requiresApproval) {
  // Rate limited
}
```

### Dashboard Metrics

```typescript
import { getDashboardMetrics } from "@/lib/metrics/dashboard";

const metrics = await getDashboardMetrics();
// { leads: {...}, agents: {...}, workflows: {...}, conversations: {...} }
```

## Test Coverage

- `src/lib/auth/session.test.ts` — 12 tests
- `src/lib/rbac/roles.test.ts` — 13 tests
- `src/lib/security/masking.test.ts` — 23 tests
- `src/lib/security/governance.test.ts` — 13 tests
- `src/lib/security/secrets.test.ts` — 12 tests
- `src/lib/metrics/dashboard.test.ts` — 5 tests
