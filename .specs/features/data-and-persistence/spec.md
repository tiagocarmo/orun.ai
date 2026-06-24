# Data and Persistence

## Contexto

O ponto canonico `docs/plans/sequential-build/03-data-and-persistence.md` vem apos a estabilizacao do MVP e da primeira camada de testes. Agora precisamos reduzir fragilidade estrutural no schema, nas regras de identificadores externos e nas politicas de armazenamento antes de abrir workflow engine e orchestrator.

## Complexidade

Medium.

Justificativa:
- envolve schema Prisma, seed, validacoes e algumas regras de dominio persistido;
- exige migracoes formais e decisoes de armazenamento;
- ainda e um escopo concentrado em persistencia, sem exigir arquitetura distribuida nova.

## Objetivo

Fortalecer o modelo de dados, migracoes e politicas de persistencia para sustentar a evolucao segura do produto.

## Requisitos

- DP-01: introduzir migracoes formais no Prisma para o estado atual do schema.
- DP-02: tratar `externalId` de lead de forma robusta no banco, sem depender de JSON serializado em `metadata`.
- DP-03: revisar o uso atual de JSON serializado em `String` e reduzir a fragilidade onde o MVP mais depende disso.
- DP-04: revisar a politica de soft delete vs delete fisico para os dados centrais do MVP.
- DP-05: alinhar o armazenamento de credenciais de integracao com a regra de nao salvar segredos no banco.
- DP-06: documentar uma estrategia de evolucao SQLite -> PostgreSQL sem quebrar o MVP atual.

## Verificacao

- Schema, seed e constraints precisam ficar coerentes com o estado desejado do MVP.
- As migracoes Prisma devem existir e ser reproduziveis.
- Os riscos de dados mais graves devem ser reduzidos ou explicitamente documentados.
- Rodar `npm test`, `npm run build`, `npm run lint` e `npm run typecheck` antes de concluir.
