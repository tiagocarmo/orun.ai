# Spec — Auditoria e Relatorio Codex do Projeto Orun.AI

## Contexto

O usuario solicitou uma auditoria ampla do projeto Orun.AI:

- entender o projeto por README, AGENTS, CLAUDE, DESIGN e docs;
- entender as ultimas tarefas registradas em `.mimocode`;
- listar requisitos do projeto e comparar com o que foi teoricamente realizado;
- verificar requisito a requisito o que realmente foi implementado, divergencias e melhorias;
- gravar um relatorio complexo em `docs/codex-report`.

## Escopo

Produzir documentacao de auditoria, sem alterar comportamento da aplicacao.

## Requisitos

### CR-001 — Fontes do Projeto

O relatorio deve considerar `README.md`, `AGENTS.md`, `CLAUDE.md`, `DESIGN.md`, `docs/prd.md`, `docs/orchestrator.md`, `docs/workflows.md`, `docs/compose/**`, `.mimocode/**` e o codigo em `src/**`/`prisma/**`.

### CR-002 — Requisitos vs Implementacao

O relatorio deve conter matriz de requisitos com status factual: implementado, parcial, nao implementado ou divergente.

### CR-003 — Ultimas Tarefas

O relatorio deve resumir o que as sessoes e planos recentes afirmam ter feito, e confrontar com evidencias atuais.

### CR-004 — Lacunas e Riscos

O relatorio deve apontar bugs, inconsistencias, riscos de produto, seguranca, observabilidade, testes, versionamento e maturidade arquitetural.

### CR-005 — Proximos Passos

O relatorio deve priorizar melhorias recomendadas em uma ordem executavel.

## Fora do Escopo

- Corrigir os bugs encontrados.
- Criar novos agentes, workflows ou integracoes.
- Criar testes para as funcionalidades auditadas.

## Criterios de Aceite

- Arquivos criados em `docs/codex-report`.
- README e docs/features atualizados com ponteiro para a auditoria.
- Aprendizado e sessao registrados em `.mimocode`.
- Verificacoes finais executadas ou falhas documentadas.
