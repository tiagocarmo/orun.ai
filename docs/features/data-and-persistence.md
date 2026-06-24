# Data and Persistence

## Resumo

Terceiro ponto do plano sequencial canonico, focado em reduzir fragilidade do schema Prisma e tornar as regras de persistencia do MVP mais previsiveis antes da entrada de workflow engine e integracoes mais profundas.

## Escopo Implementado

- migration formal inicial do Prisma adicionada em `prisma/migrations/`;
- `Lead.externalId` promovido para coluna dedicada com unicidade no banco;
- exclusao de lead trocada de delete fisico para soft delete com `deletedAt`;
- `Integration.credentials` removido do schema em favor de `secretRef`;
- regras minimas de documentacao para evolucao SQLite -> PostgreSQL.

## Decisoes

- O MVP continua em SQLite, mas sai de `db push` como caminho principal e passa a usar `prisma migrate`.
- `externalId` deixa de morar em `metadata`, mas a aplicacao ainda faz fallback de leitura para registros legados que tenham esse valor apenas no JSON serializado.
- O banco preserva leads removidos para auditoria; consultas operacionais ignoram `deletedAt != null`.
- Segredos de integracao nao devem ser persistidos em texto. O banco guarda apenas uma referencia (`secretRef`), por exemplo `env:HUBSPOT_API_KEY`.
- Campos polimorficos como `metadata`, `config`, `steps`, `input`, `output` e `context` continuam como `String` serializada no SQLite. Isso evita dependencias em recursos que o Prisma ainda nao suporta para SQLite e mantém o contrato do MVP estavel.

## Estrategia SQLite -> PostgreSQL

1. Manter IDs, enums informais e contratos de aplicacao compativeis com ambos os providers.
2. Concentrar consultas criticas em colunas dedicadas (`externalId`, `deletedAt`, `status`) em vez de depender de chaves dentro de blobs serializados.
3. Quando o provider mudar para PostgreSQL, migrar gradualmente os blobs mais importantes para `Json/JsonB`, preservando o contrato de leitura/escrita por helpers de aplicacao.
4. Executar migracao em duas etapas: primeiro provider + schema compativel, depois otimizacoes especificas de PostgreSQL como `JsonB`, indices por caminho e constraints adicionais.

## Validacao

- `npm test`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npx prisma validate`
- `npx prisma generate`
- `DATABASE_URL='file:./sql-verify.db' npx prisma db execute --file prisma/migrations/20260624084500_data_persistence_foundation/migration.sql --schema prisma/schema.prisma`
- `DATABASE_URL='file:./sql-verify.db' npx prisma db seed`

## Limites Restantes

- O engine de migrations do Prisma falhou neste ambiente tanto em `prisma migrate dev` quanto em `prisma migrate deploy` com a mensagem opaca `Schema engine error:`. Como contorno, a migration formal foi gerada com `prisma migrate diff` e o SQL resultante foi validado com `prisma db execute`.
- Os blobs JSON continuam serializados como `String` no SQLite. Isso e intencional no MVP atual e deve ser reavaliado na migracao para PostgreSQL.
