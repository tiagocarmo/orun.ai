# 02 — Ultimas Tarefas e O Que Foi Realizado

## Fonte: `.mimocode/learning.md`

O historico registra seis sessoes principais.

### Sessao MVP Orun.AI

Declarado:

- projeto criado manualmente;
- Next.js + TS + Tailwind;
- Prisma/SQLite;
- 14 tabelas;
- server actions;
- UI de dashboard;
- Lead Intake Agent;
- Qualification Agent;
- estrutura MCP stub;
- build/typecheck/lint passando na epoca.

Confirmado no codigo:

- estrutura existe;
- schema Prisma tem 14 models;
- agentes lead-intake e qualification existem;
- actions e paginas existem;
- MCP registry existe como stub.

Nao confirmado ou incompleto:

- nao existem testes unitarios reais, apesar do plano inicial prever testes;
- nao existem migrations;
- integracao real com LLM nao e usada pelos agentes atuais;
- workflows existem apenas como tabelas/seed, sem engine.

### Sessao MiMo Code / CLAUDE.md

Declarado:

- `CLAUDE.md` criado;
- `AGENTS.md` e `README.md` atualizados;
- regras de autoload, commits, semver, testes, docs e checklist.

Confirmado:

- arquivos existem com essas regras.

Observacao:

- as regras sao mais rigorosas do que a pratica atual do repo: testes ausentes, lockfile com versao diferente do package, e `npm run lint` usa `next lint`, que nao existe mais no Next 15.

### Sessao UI Feedback

Declarado inicialmente:

- sidebar fixa;
- traducao PT-BR;
- CRUD completo de leads;
- run agent com busca de leads;
- conversas enriquecidas.

Historico posterior diz que o commit anterior nao implementou tudo.

Confirmado hoje:

- sidebar desktop esta fixa (`lg:fixed`);
- run agent tem busca de leads;
- conversas mostram lead/email/empresa e ultima mensagem;
- lead actions existem com modal;
- idioma ainda esta misto em varios pontos.

Divergencias:

- `LeadActions` mostra "Desarquivar", mas chama `updateLead(..., { status: "archived" })` tanto para arquivar quanto para desarquivar;
- run agent seleciona lead, mas nao envia `leadId`, quebrando o fluxo do agente de qualificacao;
- varias telas ainda exibem ingles: dashboard stats, history, sidebar labels, run history.

### Sessao UX 15 Rodadas

Planejado:

- skeletons;
- toasts;
- error boundary/404;
- breadcrumbs/topbar;
- command palette;
- charts;
- activity feed;
- validacao de formularios;
- messaging UI;
- settings;
- pagination;
- lead detail enhancements;
- polish.

Confirmado parcial:

- skeleton existe;
- loading dashboard existe;
- Toaster existe;
- error boundary e 404 existem;
- breadcrumb/topbar existem;
- command palette existe para leads/agentes;
- charts existem;
- activity feed existe;
- lead form tem validacao basica;
- conversa tem input de mensagem;
- settings existe como placeholder;
- pagination existe em leads.

Nao completo:

- toasts nao cobrem todas as acoes;
- command palette nao busca conversas;
- activity feed nao inclui runs/conversas;
- settings nao configura nada;
- pagination nao esta em todas as listas;
- lead detail nao tem botao executar agente, barra de score ou conversas relacionadas;
- polish/idioma ainda incompleto.

### Sessoes Codex VS Code

As ultimas duas sessoes sao fora do produto Orun:

- correcao de manifesto de plugin local com `defaultPrompt` maior que 128 chars;
- patch local no bundle da extensao VS Code para silenciar warning IPC `client-status-changed`.

Confirmado:

- docs de feature registram essas correcoes.

Impacto no produto:

- nenhum impacto funcional direto na plataforma Orun.AI;
- aumentam ruído no historico do repo porque tarefas de ambiente foram documentadas dentro do projeto.
