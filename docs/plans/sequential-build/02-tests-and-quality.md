# 02 — Tests and Quality

## Objetivo

Criar a primeira camada real de testes e padroes de qualidade para impedir regressao dos fluxos centrais.

## Por Que Este Ponto Vem Agora

Sem testes, o projeto continua corrigindo o mesmo tipo de bug manualmente. Depois de estabilizar o MVP, precisamos transformar esse aprendizado em protecao automatica.

## Escopo

* criar testes unitarios para `LeadIntakeAgent` e `QualificationAgent`;
* criar testes para `runAgent`;
* criar testes para o webhook de leads;
* criar testes para actions centrais de leads;
* formalizar mocks de DB/servicos externos;
* revisar a estrategia de lint e typecheck.

## Entradas

* `vitest.config.ts`
* `src/lib/agents/**`
* `src/app/actions/**`
* `src/app/api/webhooks/leads/route.ts`
* `docs/codex-report/04-implementation-audit.md`

## Saidas Esperadas

* suite minima de testes reais;
* padrao de mocks reutilizavel;
* `npm test` deixando de falhar por ausencia de arquivos;
* base de qualidade pronta para os proximos pontos.

## Agente a Spawnar

Um agente de implementacao focado em testes e infraestrutura de qualidade.

## Criterio de Conclusao

* `npm test` executa testes reais;
* cobertura existe para os fluxos centrais do MVP;
* padrao de mock e setup esta documentado.

## Proximo Plano

Depois de concluir este ponto, puxar `03-data-and-persistence.md`.
