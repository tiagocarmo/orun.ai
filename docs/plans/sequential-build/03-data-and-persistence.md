# 03 — Data and Persistence

## Objetivo

Fortalecer o modelo de dados, migracoes e politicas de persistencia para sustentar evolucao segura do produto.

## Por Que Este Ponto Vem Agora

Antes de workflow engine, orchestrator e integracoes, precisamos de uma base de dados com menos ambiguidade operacional.

## Escopo

* introduzir migrations formais no Prisma;
* revisar uso de JSON serializado em `String`;
* tratar `externalId` de lead de forma robusta;
* revisar soft delete vs delete fisico;
* revisar armazenamento de credenciais de integracao;
* definir estrategia de evolucao SQLite -> PostgreSQL sem quebrar o MVP.

## Entradas

* `prisma/schema.prisma`
* `prisma/seed.ts`
* `src/lib/types.ts`
* `src/lib/validators.ts`
* `docs/codex-report/04-implementation-audit.md`

## Saidas Esperadas

* camada de persistencia menos fragil;
* regras claras de identificadores externos;
* caminho de migracao mais previsivel;
* politica explicita para segredos e dados sensiveis.

## Agente a Spawnar

Um agente de implementacao focado em banco, schema e persistencia.

## Criterio de Conclusao

* schema e dados centrais ficaram consistentes com o estado desejado do MVP;
* migracoes/seed/constraints estao coerentes;
* riscos de dados conhecidos foram reduzidos ou documentados.

## Proximo Plano

Depois de concluir este ponto, puxar `04-workflow-engine.md`.
