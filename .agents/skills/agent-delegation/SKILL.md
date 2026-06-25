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

## Golden Rule

**Every tool that accepts an `operation` parameter requires it to be an OBJECT, never a string.**

Wrong:
```js
task({ operation: "create", summary: "..." })        // ❌ string
actor({ operation: "run", subagent_type: "..." })    // ❌ missing nested object
```

Correct:
```js
task({ operation: { action: "create", summary: "..." } })     // ✅ object
actor({ operation: { action: "run", subagent_type: "..." } }) // ✅ object
```

---

## Tool 1: `actor` — Subagent Delegation

Spawns subagents (explore or general) for parallel/long tasks.

### Run (blocking — waits for result)

```json
{
  "operation": {
    "action": "run",
    "subagent_type": "explore",
    "description": "short 3-5 word label",
    "prompt": "full task instructions for the subagent"
  }
}
```

### Spawn (background — returns actor_id immediately)

```json
{
  "operation": {
    "action": "spawn",
    "subagent_type": "general",
    "description": "long running search",
    "prompt": "full task instructions"
  }
}
```

### Status / Wait / Cancel / Send

```json
{ "operation": { "action": "status", "actor_id": "..." } }
{ "operation": { "action": "wait", "actor_id": "..." } }
{ "operation": { "action": "cancel", "actor_id": "..." } }
{ "operation": { "action": "send", "to_actor_id": "...", "content": "..." } }
```

### Optional fields (inside `operation`)

| Field | Type | Description |
|-------|------|-------------|
| `timeout_ms` | number | Timeout in ms (default 600000) |
| `context` | `"none"` \| `"state"` \| `"full"` | Context inheritance |
| `task_id` | string | Bind to a task tracker ID |
| `model` | string | Override model |

---

## Tool 2: `task` — Work Item Tracker

Persistent task management. ALL calls use `operation` as an object with `action` field.

### Create

```json
{ "operation": { "action": "create", "summary": "Task description" } }
```

### List / Get / Start / Done / Block / Unblock / Abandon / Rename

```json
{ "operation": { "action": "list" } }
{ "operation": { "action": "get", "id": "T1" } }
{ "operation": { "action": "start", "id": "T1", "event_summary": "starting work" } }
{ "operation": { "action": "done", "id": "T1", "event_summary": "completed" } }
{ "operation": { "action": "block", "id": "T1", "event_summary": "waiting on spec" } }
{ "operation": { "action": "unblock", "id": "T1", "event_summary": "spec resolved" } }
{ "operation": { "action": "abandon", "id": "T1", "event_summary": "out of scope" } }
{ "operation": { "action": "rename", "id": "T1", "summary": "New title" } }
```

### Optional fields

| Field | Type | Description |
|-------|------|-------------|
| `parent_id` | string | Parent task ID for subtasks |
| `session_id` | string | Session scope (default: current) |
| `status` | string | Filter: open, in_progress, blocked, done, abandoned |
| `include_terminal` | boolean | Include done/abandoned in list |

---

## Tool 3: `workflow` — Workflow Orchestrator

Runs deterministic multi-agent workflow scripts.

### Run

```json
{ "operation": "run", "name": "workflow-name", "args": {} }
```

### Status / Wait / Cancel / Resume

```json
{ "operation": "status", "run_id": "..." }
{ "operation": "wait", "run_id": "..." }
{ "operation": "cancel", "run_id": "..." }
{ "operation": "resume", "run_id": "..." }
```

> Note: `workflow` uses flat `operation` string, NOT nested object. This is the EXCEPTION.

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
| `unrecognized_keys: summary` | `summary` at root level | Move inside `operation` object |
| Missing `action` field | `operation` without `action` | Always include `action` inside `operation` |

## Pre-flight Checklist

Before ANY tool call with `operation`:

1. Is `operation` an **object** `{}`? → Must be, always.
2. Does it have an `action` field? → Required.
3. Are extra keys (`timeout_ms`, `summary`) **inside** `operation`? → Yes, never at root.
4. For `actor`: is `subagent_type` included? → Required for run/spawn.
5. For `actor`: is `description` under 5 words? → Required.
