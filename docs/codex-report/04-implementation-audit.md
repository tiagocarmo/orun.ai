# 04 — Auditoria Tecnica e Achados

## Achados Criticos

### A1 — Execucao de qualificacao por lead esta quebrada

Evidencia:

- `src/lib/agents/qualification.ts` exige `{ leadId: string }`.
- `src/app/(dashboard)/runs/page.tsx` monta o input do lead selecionado com `name`, `email`, `phone`, `company`, mas sem `leadId`.

Impacto:

- O fluxo principal do MVP, "selecionar lead e executar agente de qualificacao", deve falhar com erro de validacao.

Melhoria:

- Ao selecionar lead, enviar `{ leadId: lead.id }` para o `qualification`.
- Se o agente selecionado for `lead-intake`, montar payload diferente.
- Criar camada de schema/input por agente para a UI nao adivinhar payload.

### A2 — Desarquivar lead promete uma coisa e executa outra

Evidencia:

- `src/components/leads/lead-actions.tsx` mostra label "Desarquivar" quando `currentStatus === "archived"`.
- `handleArchive()` sempre chama `updateLead(leadId, { status: "archived" })`.

Impacto:

- Lead arquivado nao volta para ativo pela UI, apesar do texto prometer restauracao.

Melhoria:

- Para `isArchived`, enviar status anterior guardado ou status padrao `"new"`.
- Registrar evento `unarchived`.

### A3 — Auditoria de webhook e incompleta

Evidencia:

- `src/app/api/webhooks/leads/route.ts` chama `leadAgent.execute(...)` diretamente com `runId: "webhook"`.
- Nao usa `executeAgent`, portanto nao cria `AgentRun`/`AgentLog`.

Impacto:

- Leads criados por webhook nao entram no historico de execucoes, contrariando o requisito de auditabilidade.

Melhoria:

- Registrar webhook como `AgentRun` real ou criar tabela/evento especifico de webhook com correlacao.

### A4 — Deduplicacao por externalId e fragil

Evidencia:

- `LeadIntakeAgent` procura `metadata: JSON.stringify({ externalId: parsed.externalId })`.
- Na criacao, `metadata` pode virar `JSON.stringify({ externalId, ...metadata })`.

Impacto:

- Se houver qualquer metadata adicional, a busca por igualdade exata nao encontra o lead existente.

Melhoria:

- Criar coluna `externalId` unica opcional ou tabela de identidades externas.

### A5 — Testes prometidos nao existem

Evidencia:

- `vitest.config.ts` existe.
- Nao foram encontrados `*.test.*` ou `*.spec.*` em `src`.
- `.mimocode` registra que testes unitarios ficaram fora do escopo do MVP.

Impacto:

- Bugs centrais passaram sem barreira automatica.
- O checklist do projeto esta sendo violado.

Melhoria:

- Comecar por testes de `QualificationAgent`, `LeadIntakeAgent`, `runAgent`, `LeadActions`, webhook e validators.

## Achados de Arquitetura

### B1 — Orchestrator esta apenas documentado

`docs/orchestrator.md` descreve planner, executor, context, memory, registry e MCP layer. O codigo nao tem `src/lib/orchestrator/**`.

Consequencia: o projeto ainda e um CRUD + execucao direta de agentes, nao uma workforce multiagente.

### B2 — Workflow engine nao existe

`Workflow` e `WorkflowRun` existem no schema, mas nao ha actions, UI ou executor.

Consequencia: workflows oficiais nao podem ser pausados, retomados, cancelados ou auditados.

### B3 — MCP registry nao executa ferramentas reais

`src/lib/mcp/registry.ts` define um registry e CRUD de integrations, mas nao ha tools, client MCP, permissao, retry ou ligacao com agentes.

Consequencia: "MCP-ready" e correto como estrutura inicial, mas ainda nao como funcionalidade.

### B4 — Provider LLM existe, mas agentes atuais nao usam IA

`OpenAIProvider` existe, mas `QualificationAgent` e heuristico. O produto diz "IA via LLM externa"; a qualificacao atual nao depende de LLM.

Isso pode ser bom para MVP deterministico, mas precisa estar claro nos docs.

## Achados de Dados e Persistencia

### C1 — Sem migrations Prisma

Existe `prisma/schema.prisma` e `prisma/dev.db`, mas nao existe `prisma/migrations`.

Risco:

- historico de schema nao auditavel;
- ambiente novo depende de `db push`;
- migracao futura para PostgreSQL fica menos controlada.

### C2 — JSON serializado em string

Campos como `metadata`, `config`, `steps`, `input`, `output`, `context` sao strings. Isso foi uma decisao registrada por limitacao SQLite.

Risco:

- consultas por chaves internas sao dificeis;
- deduplicacao por dados internos e fragil;
- validacao de formato depende do codigo consumidor.

### C3 — Credenciais podem ser salvas no banco

`Integration.credentials` existe como `String?`.

Risco:

- contraria a regra "Nunca salvar chaves de API no banco", se usado literalmente.

Melhoria:

- armazenar referencias a secrets em env/secret manager; nunca credenciais em texto.

## Achados de UI/UX

### D1 — Idioma ainda esta misto

Exemplos:

- dashboard: "Total Leads", "Qualified Leads", "Active Agents", "Recent Runs";
- run history: "Execution History", "View all agent run executions", "Hide", "Details";
- sidebar: "Agents", "Runs", "Conversations", "Settings";
- lead detail: "Name", "Phone", "Company".

Impacto:

- contradiz sessoes que indicam traducao PT-BR completa.

### D2 — Settings e placeholder

As rotas `settings`, `settings/profile` e `settings/integrations` existem, mas mostram "em breve".

Impacto:

- atende navegacao, nao atende configuracao real.

### D3 — Command palette incompleto

Busca leads e agentes, mas o plano prometia conversas tambem.

### D4 — Pagination incompleta

Leads tem `Pagination`. Runs history carrega `getRuns()` sem paginacao UI; conversations lista tudo nao arquivado.

### D5 — Lead detail nao recebeu enhancements prometidos

Nao ha botao "Executar Agente", barra de score ou conversas relacionadas.

## Achados de Qualidade e Tooling

### E1 — `package.json` e `package-lock.json` estao desalinhados

No momento da auditoria:

- `package.json` versao `1.0.2`;
- `package-lock.json` versao raiz `0.3.0`.

Impacto:

- semver historico fica inconsistente;
- releases ficam dificeis de auditar.

### E2 — `npm run lint` usa comando obsoleto

`package.json` define `"lint": "next lint"`. Na validacao desta auditoria, o comando passou, mas exibiu aviso de depreciacao informando migracao futura para ESLint CLI.

- Impacto:

- o checklist ainda passa hoje, mas esta em caminho de quebra em versoes futuras do Next.

Melhoria:

- trocar para `eslint .` com config apropriada.

### E3 — Versionamento visual hardcoded

Sidebar exibe `Orun.AI v1.0.0`, enquanto package esta em versao diferente.

Impacto:

- usuario ve versao incorreta na UI.

### E4 — Typecheck depende de artefatos `.next`

Na validacao desta auditoria, `npm run typecheck` falhou antes do build porque `tsconfig.json` inclui `.next/types/**/*.ts` e alguns arquivos nao existiam. Apos `npm run build`, o typecheck passou.

Impacto:

- em CI, a ordem `typecheck` antes de `build` pode falhar em workspace limpo.

Melhoria:

- ajustar `tsconfig.json`, gerar tipos antes do typecheck ou padronizar a ordem de comandos.

## Achados de Seguranca e Privacidade

### F1 — Logs podem capturar PII bruta

`executeAgent` grava metadata com input completo. Lead intake grava `rawInput`.

Risco:

- PII como nome, email, telefone e mensagem podem ficar em logs sem mascaramento.

### F2 — Sem autenticacao/autorizacao

Nao ha auth, RBAC, organizacao, permissoes ou protecao de rotas.

Impacto:

- qualquer deploy exporia dados sensiveis.

### F3 — Webhook depende de secret global

Se `WEBHOOK_SECRET` nao estiver configurado, todo webhook e rejeitado. Isso e seguro por padrao, mas precisa estar explicitado no README/ops.

## Conclusao Tecnica

O projeto tem uma base promissora e editavel, mas ainda esta em maturidade POC/MVP inicial. O maior risco nao e falta de codigo; e a distancia entre documentacao aspiracional, sessoes marcadas como concluídas e comportamento real dos fluxos essenciais.
