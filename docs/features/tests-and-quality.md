# Tests and Quality

## Resumo

Segundo ponto do plano sequencial canonico, focado em transformar os fluxos centrais do MVP em protecoes automatizadas e em estabilizar a estrategia basica de qualidade do repositório.

## Escopo

- testes unitarios para `LeadIntakeAgent` e `QualificationAgent`;
- testes para `runAgent`;
- testes para o webhook de leads;
- testes para actions centrais de leads;
- mocks reutilizaveis para DB e runtime de agentes;
- revisao da estrategia de lint e typecheck.

## Implementado

- Os testes de [lead-intake.test.ts](/home/tiagolocal/POC/orun.ai/src/lib/agents/lead-intake.test.ts) agora cobrem criacao e deduplicacao por `email` e `externalId`.
- Foi criada a suite [qualification.test.ts](/home/tiagolocal/POC/orun.ai/src/lib/agents/qualification.test.ts) cobrindo validacao, `lead` inexistente e persistencia da qualificacao.
- A action [runs.test.ts](/home/tiagolocal/POC/orun.ai/src/app/actions/runs.test.ts) valida o contrato de `runAgent` para sucesso, erro de execucao e erro de schema.
- O webhook [route.test.ts](/home/tiagolocal/POC/orun.ai/src/app/api/webhooks/leads/route.test.ts) cobre assinatura invalida, validacao de payload, falha da pipeline e sucesso auditavel.
- As actions de leads em [leads.test.ts](/home/tiagolocal/POC/orun.ai/src/app/actions/leads.test.ts) cobrem criacao, duplicidade, arquivamento, desarquivamento, busca curta e remocao.
- Foram centralizados mocks em [src/test/mocks](/home/tiagolocal/POC/orun.ai/src/test/mocks/db.ts) para banco, `next/cache` e runtime de agentes.
- `npm run lint` foi migrado para `eslint .` com exclusao de artefatos gerados, e `npm run typecheck` passou a rodar `next typegen` antes do `tsc --noEmit`.

## Validacao

- `npm test`
- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Limites Restantes

- Os testes ainda sao unitarios e de contrato local; nao existe cobertura de integracao com Prisma real nem com provedores LLM.
- O webhook ainda depende de `WEBHOOK_SECRET` configurado no ambiente para exercicio real fora dos mocks.
