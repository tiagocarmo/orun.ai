# Orun.AI

Plataforma experimental de AI workforce para operacoes comerciais. O produto combina agentes especializados, workflows auditaveis, integracoes MCP e uma interface Next.js para operar leads, conversas, execucoes e configuracoes.

## O que existe hoje

- Dashboard com metricas de leads, agentes, workflows e atividade recente.
- Cadastro e acompanhamento de leads com eventos, score e historico.
- Conversas vinculadas a leads.
- Execucao manual e historico de runs de agentes.
- Workflow engine com execucao sequencial, pausa, retomada e cancelamento.
- Orchestrator que planeja, executa e consolida tarefas entre agentes.
- Integracoes MCP, configuracoes, auth, RBAC, mascaramento de PII e governanca.

## Agentes implementados

- Lead Intake
- Qualification
- Scheduling
- Follow-up
- Research
- Document
- Human Handoff

## Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma
- SQLite
- Vitest

## Como rodar

```bash
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

## Comandos principais

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

## Spec Kit

O projeto agora tambem esta preparado para Spec-Driven Development com GitHub Spec Kit em `codex` e `claude`.

- Codex usa skills em `.agents/skills` com comandos como `$speckit-specify`, `$speckit-plan` e `$speckit-implement`.
- Claude usa skills em `.claude/skills`.
- A infraestrutura do Spec Kit fica em `.specify/`.

## Estrutura essencial

```txt
src/app           rotas e server actions
src/components    UI e telas
src/lib           agentes, workflows, orchestrator, seguranca e utilitarios
prisma            schema, migrations e seed
```

## Documentacao canonica

- `README.md`: visao geral e operacao local.
- `prd.md`: documento de produto e escopo do MVP.
- `AGENTS.md`: instrucoes canonicas para agentes de codigo.
- `CLAUDE.md`: ponte curta para `AGENTS.md`.
- `DESIGN.md`: identidade visual em formato compativel com Google Stitch.
- `llms.txt`: indice enxuto para consumidores LLM.

## Estado do repositorio

Este repositorio foi consolidado para manter apenas a documentacao canonica e `.mimocode/learning.md` como memoria historica preservada.
