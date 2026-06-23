# 01 — Entendimento do Projeto

## Produto Pretendido

O Orun.AI Workforce Platform pretende ser uma plataforma de automacao comercial com agentes de IA especializados. A visao nos documentos cobre todo o ciclo de pre-vendas:

- entrada e deduplicacao de leads;
- qualificacao;
- agendamento;
- follow-up;
- conhecimento/RAG;
- geracao documental;
- sincronizacao com CRM;
- handoff humano;
- monitoramento e observabilidade;
- orquestracao multiagente;
- camada MCP para ferramentas externas.

O principio norteador registrado em `AGENTS.md` e confiabilidade/auditabilidade, com agentes especializados e limites claros de autonomia.

## Stack Documentada

- Next.js 15;
- TypeScript;
- React 19;
- Tailwind CSS v4;
- SQLite com Prisma;
- Vitest;
- OpenAI como provider inicial;
- MCP como protocolo preparado.

## Estado Real Observado

A aplicacao existe e tem estrutura real em `src/**`:

- rotas de dashboard em `src/app/(dashboard)`;
- server actions em `src/app/actions`;
- webhook de lead em `src/app/api/webhooks/leads/route.ts`;
- agentes em `src/lib/agents`;
- provider de IA em `src/lib/ai`;
- registry MCP basico em `src/lib/mcp`;
- schema Prisma com 14 models em `prisma/schema.prisma`;
- componentes de UI e dashboard.

## Design

`DESIGN.md` descreve uma linguagem visual inspirada em Clay, com tokens de cor, tipografia, componentes e superficies. O codigo aplica parte desses tokens no Tailwind/global CSS e na UI, mas o documento e mais uma referencia visual do que uma especificacao funcional do produto.

## Modelo de Dados

O schema atual cobre as tabelas recomendadas:

- `Agent`, `AgentVersion`, `AgentRun`, `AgentLog`;
- `Lead`, `LeadEvent`;
- `Conversation`, `Message`;
- `Workflow`, `WorkflowRun`;
- `Document`, `DocumentChunk`;
- `Integration`;
- `ScheduledTask`.

Observacao importante: nao ha pasta `prisma/migrations`. O banco atual usa `db push` e `prisma/dev.db`, o que e aceitavel para prova de conceito, mas diverge do cuidado documentado de usar migrations.

## Produto Implementado Hoje

O produto real e um MVP de administracao/execucao:

- criar/listar/editar agentes;
- criar/listar/editar/arquivar/excluir leads;
- executar agentes manualmente;
- visualizar historico de execucoes;
- visualizar e enviar mensagens em conversas;
- dashboard com contadores e charts simples;
- settings placeholder;
- command palette para leads/agentes;
- webhook assinado para entrada de leads.

## Produto Ainda Aspiracional

Ainda nao ha implementacao funcional de:

- orchestrator;
- workflow engine;
- scheduling;
- follow-up automatico;
- knowledge/RAG;
- document/PDF generation;
- CRM sync;
- human handoff;
- monitoring agent;
- integracoes WhatsApp, Calendar, Drive, CRM;
- MCP tool execution real;
- autenticacao/autorizacao;
- controle multi-organizacao;
- SLAs ou disponibilidade.
