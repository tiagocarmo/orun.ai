# 04 — Workflow Engine

## Objetivo

Implementar o motor minimo de workflows com estados, historico, pausa, retomada e cancelamento.

## Por Que Este Ponto Vem Agora

Os docs do projeto assumem workflows como unidade operacional. Sem esse motor, o produto continua sendo apenas CRUD + execucao direta de agentes.

## Escopo

* criar executor sequencial inicial;
* modelar estados de `workflow_runs`;
* persistir contexto e logs por step;
* suportar pause, resume e cancel;
* criar actions basicas para iniciar e consultar runs de workflow;
* integrar os primeiros workflows canônicos do MVP.

## Entradas

* `docs/workflows.md`
* `docs/orchestrator.md`
* `prisma/schema.prisma`
* `src/lib/agents/**`

## Saidas Esperadas

* workflow engine funcional minimo;
* `WorkflowRun` deixando de ser apenas schema morto;
* base para o Orchestrator delegar tarefas reais depois.

## Agente a Spawnar

Um agente de implementacao focado em workflow runtime.

## Criterio de Conclusao

* ao menos um workflow central do MVP roda fim a fim pelo engine;
* estados e historico ficam persistidos;
* pause/resume/cancel existem no minimo necessario.

## Proximo Plano

Depois de concluir este ponto, puxar `05-orchestrator-core.md`.
