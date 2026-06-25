# AGENTS.md

## Project overview

Orun.AI is a Next.js + TypeScript test project for an AI workforce platform focused on commercial operations. Treat the codebase as the source of truth when documentation and implementation diverge.

## Canonical files

- `README.md`: human-facing overview and local setup.
- `prd.md`: product scope, users and current MVP boundaries.
- `DESIGN.md`: visual system in Google Stitch compatible format.
- `.mimocode/learning.md`: preserved historical memory; never edit or delete it.

## Setup commands

- Install dependencies: `npm install`
- Generate Prisma client: `npm run db:generate`
- Apply local migrations: `npm run db:migrate`
- Seed local data: `npm run db:seed`
- Start development server: `npm run dev`

## Verification commands

- Run tests: `npm test`
- Run lint: `npm run lint`
- Run typecheck: `npm run typecheck`
- Run build: `npm run build`

## Working agreements

- Prefer the existing Next.js, React and Prisma patterns already present in `src/` and `prisma/`.
- Keep TypeScript strict and favor small, testable server-side functions.
- Use mocks for external systems, database access and async boundaries in tests.
- Update `README.md` when the developer workflow changes.
- Update `prd.md` when product scope or user-facing behavior changes.
- Update `DESIGN.md` when visual rules, tokens or component behavior change.
- If you change or add a UI route, update `src/lib/help-content.tsx`.

## Documentation rules

- Keep `AGENTS.md` operational, short and agent-focused.
- Keep `README.md` for humans; do not turn it into a PRD.
- Keep `prd.md` product-focused; do not use it as a setup guide.
- Keep `CLAUDE.md` as a thin wrapper that points back to this file.

## Editing constraints

- Never edit `.mimocode/learning.md`.
- Do not reintroduce large documentation trees under `docs/`, `.specs/` or `.mimocode/session`.
- Prefer root-level canonical docs over duplicated variants or aliases.
- Preserve canonical filenames: `README.md`, `AGENTS.md`, `CLAUDE.md`, `DESIGN.md`, `prd.md`, `llms.txt`.

## Codebase notes

- Agents are registered in `src/lib/agents/index.ts`.
- Workflow execution lives in `src/lib/workflows/engine.ts`.
- Orchestration lives in `src/lib/orchestrator/`.
- Product metrics are computed in `src/lib/metrics/dashboard.ts`.
- The data model is defined in `prisma/schema.prisma`.

## Done criteria

- Changes are reflected in the correct canonical document.
- `npm test`, `npm run lint`, `npm run typecheck` and `npm run build` pass when the task changes code or executable behavior.
- Any new or changed UI help text is updated in `src/lib/help-content.tsx`.
- `.mimocode/learning.md` remains untouched.

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
<!-- SPECKIT END -->
