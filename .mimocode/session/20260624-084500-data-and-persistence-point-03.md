# Sessao 20260624-084500 — Data and Persistence Point 03

## Plano Executado

- Arquivo do plano: `docs/plans/sequential-build/03-data-and-persistence.md`
- Motivo da ordem: terceiro ponto do plano sequencial, antes de workflow engine e integracoes mais profundas
- Criterio de conclusao: schema, seed, constraints, regras de persistencia e documentacao minima coerentes com o MVP desejado

## Resumo do Objetivo

Fortalecer a camada de dados do MVP com migrations formais, deduplicacao robusta por `externalId`, politica explicita de soft delete para leads, remocao de segredos em texto do schema e uma estrategia segura de evolucao de SQLite para PostgreSQL.

## Implementado

- `Lead.externalId` promovido para coluna dedicada com unicidade no schema Prisma
- `Lead.deletedAt` adicionado e `deleteLead` convertido para soft delete
- `Integration.credentials` substituido por `secretRef`
- helpers de leads atualizados para separar `externalId` de `metadata`
- `LeadIntakeAgent` atualizado para gravar `externalId` na coluna propria e manter fallback de leitura para registros legados
- actions de leads atualizadas para filtrar registros removidos e emitir evento `deleted`
- seed ajustado com `externalId` e metadata coerente com o novo contrato
- migration formal criada em `prisma/migrations/20260624084500_data_persistence_foundation/migration.sql`
- documentacao da feature adicionada em `docs/features/data-and-persistence.md`
- versao do projeto atualizada para `1.0.8`

## Validacao

- `npm test` ✅ 7 arquivos, 25 testes
- `npm run lint` ✅
- `npm run build` ✅
- `npm run typecheck` ✅ apos o build
- `npx prisma validate` ✅
- `npx prisma generate` ✅
- `DATABASE_URL='file:./sql-verify.db' npx prisma db execute --file prisma/migrations/20260624084500_data_persistence_foundation/migration.sql --schema prisma/schema.prisma` ✅
- `DATABASE_URL='file:./sql-verify.db' npx prisma db seed` ✅

## Observacoes

- `prisma migrate dev` e `prisma migrate deploy` falharam neste ambiente com `Schema engine error:` apesar de schema e client validos. A migration foi gerada via `prisma migrate diff` e o SQL foi validado por execucao direta no SQLite temporario.
- O primeiro `npm run typecheck` falhou no problema ja conhecido de `.next/types` em workspace limpo; apos `npm run build`, o mesmo comando passou sem ajustes adicionais de codigo.
