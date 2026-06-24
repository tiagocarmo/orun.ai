# 01 — Stabilize MVP

## Objetivo

Corrigir os fluxos centrais ja existentes para que o MVP atual funcione de forma coerente antes de qualquer expansao.

## Por Que Este Ponto Vem Primeiro

O projeto ja tem interface, agentes basicos, runs, conversas e dashboard. Hoje o maior risco nao e "falta de feature", e sim divergencia entre o que a UI promete e o que o backend realmente aceita.

## Escopo

* corrigir execucao manual do `QualificationAgent` para usar `leadId`;
* corrigir arquivar/desarquivar lead;
* garantir que webhook de lead gere trilha auditavel coerente;
* revisar divergencias mais graves do MVP apontadas na auditoria;
* ajustar detalhes minimos que impedem o fluxo principal de ponta a ponta.

## Entradas

* `docs/codex-report/03-requirements-matrix.md`
* `docs/codex-report/04-implementation-audit.md`
* `src/app/(dashboard)/runs/page.tsx`
* `src/components/leads/lead-actions.tsx`
* `src/app/api/webhooks/leads/route.ts`
* `src/lib/agents/qualification.ts`

## Saidas Esperadas

* fluxo "selecionar lead -> qualificar" funcionando;
* comportamento de arquivar e desarquivar coerente;
* trilha de execucao mais consistente para intake via webhook;
* MVP atual menos enganoso e mais estavel.

## Agente a Spawnar

Um agente de implementacao focado em bugs e consistencia do MVP.

## Criterio de Conclusao

* os bugs criticos do MVP atual estao corrigidos;
* as principais divergencias documentadas foram revisitadas;
* build, lint e typecheck passam;
* os limites restantes ficam documentados antes de seguir.

## Proximo Plano

Depois de concluir este ponto, puxar `02-tests-and-quality.md`.
