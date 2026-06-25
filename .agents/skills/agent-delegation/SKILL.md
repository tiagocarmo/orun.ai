---
name: agent-delegation
description: >
  Correct invocation of tools: actor, task, workflow. Prevents schema errors
  when delegating to subagents, managing tasks, or running workflows.
  Triggers on: delegate, delegation, tool, tools, actor, subagent, sub-agent,
  spawn, task, workflow, run agent, invoke, chamada, ferramenta.
  Specific to: MiMo, MiMoCode, .mimo, .mimocode, .opencode, Xiaomi MiMo.
---

# Agent Delegation & Tool Invocation

> This skill is specific to the MiMo / MiMoCode / .mimo / .mimocode / .opencode / Xiaomi MiMo environment.

---

## ⛔ CRITICAL: Schema Reference (READ FIRST)

The `actor` and `task` tools accept a single parameter `operation` that is **ALWAYS an object with an `action` field**.

### `actor` tool — full schema

```json
{
  "operation": {
    "action": "run" | "spawn" | "status" | "wait" | "cancel" | "send",
    "subagent_type": "explore" | "general",
    "description": "short label 3-5 words",
    "prompt": "instructions for the subagent",
    "timeout_ms": 600000,
    "context": "none" | "state" | "full",
    "task_id": "T1",
    "model": "model-name",
    "actor_id": "existing-actor-id",
    "to_actor_id": "target-actor-id",
    "content": "message content"
  }
}
```

**Required fields for `run`/`spawn`:** `action`, `subagent_type`, `description`, `prompt`
**All other fields (`timeout_ms`, `context`, `task_id`, `model`):** go INSIDE `operation`, NEVER at root.

### `task` tool — full schema

```json
{
  "operation": {
    "action": "create" | "list" | "get" | "start" | "done" | "block" | "unblock" | "abandon" | "rename",
    "summary": "task description",
    "id": "T1",
    "event_summary": "short note",
    "parent_id": "T1",
    "session_id": "session-id",
    "status": "open" | "in_progress" | "blocked" | "done" | "abandoned",
    "include_terminal": true,
    "include_archived": false
  }
}
```

**Required fields for `create`:** `action`, `summary`
**All fields go INSIDE `operation`**, NEVER at root.

### `workflow` tool — EXCEPTION

```json
{ "operation": "run", "name": "workflow-name", "args": {} }
{ "operation": "status", "run_id": "..." }
{ "operation": "wait", "run_id": "..." }
```

> **Note:** `workflow` uses flat `operation` string — this is the ONLY exception.

---

## Copy-Paste Templates

### actor — Run (blocking)

```json
{
  "operation": {
    "action": "run",
    "subagent_type": "explore",
    "description": "find error recovery",
    "prompt": "Search parser.ts for error recovery patterns. Return file:line and description."
  }
}
```

### actor — Run with timeout

```json
{
  "operation": {
    "action": "run",
    "subagent_type": "explore",
    "description": "deep code analysis",
    "prompt": "Analyze the full authentication module...",
    "timeout_ms": 300000
  }
}
```

### actor — Run with context and task binding

```json
{
  "operation": {
    "action": "run",
    "subagent_type": "general",
    "description": "implement auth module",
    "prompt": "Implement the login flow with JWT...",
    "context": "full",
    "task_id": "T4"
  }
}
```

### actor — Spawn (background)

```json
{
  "operation": {
    "action": "spawn",
    "subagent_type": "general",
    "description": "long running analysis",
    "prompt": "Analyze the entire codebase for security vulnerabilities..."
  }
}
```

### actor — Status / Wait / Cancel

```json
{ "operation": { "action": "status", "actor_id": "explore-1" } }
{ "operation": { "action": "wait", "actor_id": "explore-1" } }
{ "operation": { "action": "cancel", "actor_id": "explore-1" } }
```

### actor — Send message

```json
{ "operation": { "action": "send", "to_actor_id": "explore-1", "content": "Focus on the auth module only." } }
```

### task — Create

```json
{ "operation": { "action": "create", "summary": "Implement user authentication" } }
```

### task — Create subtask

```json
{ "operation": { "action": "create", "summary": "Add JWT validation", "parent_id": "T1" } }
```

### task — Start / Done / Block / Unblock

```json
{ "operation": { "action": "start", "id": "T1", "event_summary": "starting work" } }
{ "operation": { "action": "done", "id": "T1", "event_summary": "completed" } }
{ "operation": { "action": "block", "id": "T1", "event_summary": "waiting on spec" } }
{ "operation": { "action": "unblock", "id": "T1", "event_summary": "spec resolved" } }
```

### task — List / Get / Abandon / Rename

```json
{ "operation": { "action": "list" } }
{ "operation": { "action": "get", "id": "T1" } }
{ "operation": { "action": "abandon", "id": "T1", "event_summary": "out of scope" } }
{ "operation": { "action": "rename", "id": "T1", "summary": "New title" } }
```

---

## Golden Rule

**`operation` is ALWAYS an object `{}` with an `action` field. NEVER a string.**

WRONG (never do this):
```
actor({ operation: "run", subagent_type: "explore" })          // ❌ operation is string
actor({ operation: "run", timeout_ms: 5000 })                  // ❌ timeout_ms at root
task({ operation: "create", summary: "..." })                  // ❌ operation is string
task({ operation: "create", summary: "...", id: "T1" })        // ❌ id at root
```

CORRECT (always do this):
```
actor({ operation: { action: "run", subagent_type: "explore" } })                    // ✅
actor({ operation: { action: "run", timeout_ms: 5000 } })                            // ✅ timeout inside
task({ operation: { action: "create", summary: "..." } })                             // ✅
task({ operation: { action: "start", id: "T1", event_summary: "starting" } })         // ✅ id inside
```

---

## Tool 1: `actor` — Subagent Delegation

Spawns subagents (explore or general) for parallel/long tasks.

### When to use

| Scenario | Action |
|----------|--------|
| Parallel search/investigation | `run` with `explore` subagent |
| Complex multi-step task | `spawn` with `general` subagent |
| Check if agent finished | `status` with `actor_id` |
| Wait for agent result | `wait` with `actor_id` |
| Stop an agent | `cancel` with `actor_id` |
| Send message to running agent | `send` with `to_actor_id` |

### Field reference (all inside `operation`)

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `action` | YES | string | `run`, `spawn`, `status`, `wait`, `cancel`, `send` |
| `subagent_type` | YES (run/spawn) | string | `explore` or `general` |
| `description` | YES (run/spawn) | string | Short label, max 5 words |
| `prompt` | YES (run/spawn) | string | Full instructions — subagent has no prior context |
| `timeout_ms` | no | number | Timeout in ms (default 600000) |
| `context` | no | string | `none`, `state`, or `full` |
| `task_id` | no | string | Bind to a task tracker ID |
| `model` | no | string | Override model |
| `actor_id` | status/wait/cancel | string | Target actor session id |
| `to_actor_id` | send | string | Target actor to message |
| `content` | send | string | Message content |

---

## Tool 2: `task` — Work Item Tracker

Persistent task management. ALL calls use `operation` as an object with `action` field.

### Field reference (all inside `operation`)

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `action` | YES | string | `create`, `list`, `get`, `start`, `done`, `block`, `unblock`, `abandon`, `rename` |
| `summary` | YES (create/rename) | string | Task description or new title |
| `id` | get/start/done/block/unblock/abandon/rename | string | Task ID (e.g. `T1`) |
| `event_summary` | start/done/block/unblock/abandon | string | Short note about the event |
| `parent_id` | no (create) | string | Parent task ID for subtasks |
| `session_id` | no | string | Session scope (default: current) |
| `status` | no (list) | string | Filter: open, in_progress, blocked, done, abandoned |
| `include_terminal` | no (list) | boolean | Include done/abandoned |
| `include_archived` | no (list) | boolean | Include archived tasks |

---

## Tool 3: `workflow` — Workflow Orchestrator

**EXCEPTION:** `workflow` uses flat `operation` string, NOT nested object.

```json
{ "operation": "run", "name": "workflow-name", "args": {} }
{ "operation": "status", "run_id": "..." }
{ "operation": "wait", "run_id": "..." }
{ "operation": "cancel", "run_id": "..." }
{ "operation": "resume", "run_id": "..." }
```

---

## Tool 4: `memory` — Search Memory

```json
{ "operation": "search", "query": "search terms", "scope": "global|projects|sessions" }
```

---

## Tool 5: `skill` — Load Skill

```json
{ "name": "skill-name" }
```

---

## Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `expected object, received string` | `operation` sent as string | Wrap in `{}` with `action` field |
| `unrecognized_keys: timeout_ms` | `timeout_ms` at root level | Move inside `operation` |
| `unrecognized_keys: summary` | `summary` at root level (task tool) | Move inside `operation` object |
| `unrecognized_keys: id` | `id` at root level (task tool) | Move inside `operation` object |
| Missing `action` field | `operation` without `action` | Always include `action` inside `operation` |
| Missing `subagent_type` | actor run/spawn without type | Add `subagent_type` inside `operation` |

---

## Pre-flight Checklist

Before ANY tool call with `operation` (actor or task):

1. Is `operation` an **object** `{}` with an `action` field? → Must be, always.
2. Are ALL extra keys (`timeout_ms`, `summary`, `id`, `event_summary`, `context`, `task_id`) **inside** `operation`? → Yes, never at root.
3. For `actor` run/spawn: is `subagent_type` included? → Required.
4. For `actor` run/spawn: is `description` under 5 words? → Required.
5. For `actor` run/spawn: is `prompt` complete? → Subagent has no prior context.

---

## ⛔ On Error: DO NOT RETRY

If you receive `expected object, received string`:

1. **STOP** — Do not retry with the same format
2. **READ** the "CRITICAL: Schema Reference" section above
3. **COMPARE** your call with the Copy-Paste Templates
4. **FIX** the format: `operation` must be `{ action: "...", ... }`
5. **RETRY** with the corrected format
