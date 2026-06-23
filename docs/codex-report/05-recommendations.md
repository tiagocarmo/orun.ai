# 05 — Recomendacoes e Backlog Priorizado

## Prioridade 0 — Corrigir o MVP que ja existe

1. Corrigir input da execucao manual:
   - se agente `qualification`, enviar `{ leadId }`;
   - manter payload completo apenas para `lead-intake` ou input manual;
   - mostrar preview do payload por agente.

2. Corrigir desarquivamento:
   - `archived -> new` ou restaurar status anterior;
   - adicionar teste de UI/action.

3. Corrigir auditabilidade do webhook:
   - usar `executeAgent("lead-intake", body)` ou criar `WebhookEvent` + `AgentRun`;
   - garantir que entradas, saidas e falhas aparecam no historico.

4. Criar testes minimos:
   - `LeadIntakeAgent`;
   - `QualificationAgent`;
   - `runAgent`;
   - `POST /api/webhooks/leads`;
   - `LeadActions`/archive logic;
   - validators.

## Prioridade 1 — Alinhar fundacao de projeto

1. Ajustar lint:
   - trocar `next lint` por `eslint .`;
   - validar config com Next 15.

2. Alinhar versionamento:
   - sincronizar `package.json`, `package-lock.json` e versao exibida na UI;
   - criar criterio de bump por tipo de tarefa.

3. Criar migrations:
   - gerar migration inicial;
   - remover dependencia de `prisma/dev.db` como fonte de verdade.

4. Normalizar idioma:
   - definir PT-BR como padrao;
   - revisar sidebar, dashboard, runs history, lead detail e mensagens.

5. Mascarar PII em logs:
   - email, telefone, mensagem bruta e metadados sensiveis;
   - guardar raw payload apenas quando necessario e com politica clara.

## Prioridade 2 — Entregar o "MVP oficial" de ponta a ponta

1. Workflow engine minimo:
   - `WorkflowRun` com estados `pending/running/paused/completed/failed/cancelled`;
   - executor sequencial;
   - logs por step;
   - pause/resume/cancel.

2. Orchestrator minimo:
   - planner simples;
   - selecao de agente;
   - consolidacao de resultado;
   - contexto compartilhado por run.

3. Qualification v2:
   - criterios configuraveis;
   - historico de mensagens;
   - limiar de baixa confianca;
   - handoff quando criterio insuficiente.

4. Conversas integradas:
   - execucoes de agentes geram mensagens/eventos quando aplicavel;
   - command palette busca conversas;
   - conversas relacionadas aparecem no lead detail.

## Prioridade 3 — Comecar integracoes reais com baixo risco

1. MCP tool stub executavel:
   - uma tool local simples, sem credenciais externas;
   - registry + permissao + log + resultado.

2. Calendar stub:
   - simular disponibilidade;
   - validar conflito antes de criar eventos locais.

3. Document stub:
   - gerar documento Markdown/HTML primeiro;
   - PDF depois com aprovacao humana.

4. Integration secrets:
   - substituir `credentials` por referencia a env/secret;
   - validar nunca persistir API keys.

## Prioridade 4 — UX profissional

1. Completar as 15 rodadas:
   - toasts em todas acoes;
   - pagination em conversations/runs;
   - lead detail enriquecido;
   - settings funcional;
   - polish de acentos e labels.

2. Estados vazios e erros:
   - mensagens especificas por entidade;
   - error boundaries com caminho de recuperacao.

3. Dashboard:
   - activity feed incluindo runs/conversas;
   - metricas de conversao;
   - tempos medios;
   - taxa de erro por agente.

## Roadmap Sugerido

### Sprint 1 — Estabilizacao

- Corrigir bugs A1/A2/A3.
- Adicionar testes essenciais.
- Corrigir lint/versionamento.

### Sprint 2 — Auditabilidade

- Migrations.
- PII masking.
- Historico unificado de eventos.
- Webhook/runs rastreaveis.

### Sprint 3 — Workflow MVP

- Executor sequencial.
- Pause/resume/cancel.
- UI basica de workflow runs.

### Sprint 4 — Orchestrator e Handoff

- Planner simples.
- Context engine.
- Human handoff minimo.

### Sprint 5 — Primeira Integracao Real

- MCP tool real ou calendario stub com contrato.
- Retry/error handling.
- Permissao explicita antes de acoes sensiveis.
