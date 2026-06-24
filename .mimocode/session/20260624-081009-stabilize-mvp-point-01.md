# Sessao 20260624-081009 — Stabilize MVP Point 01

## Plano Executado

- Arquivo do plano: `docs/plans/sequential-build/01-stabilize-mvp.md`
- Motivo da ordem: primeiro ponto nao concluido do plano sequencial canonico
- Criterio de conclusao: corrigir bugs criticos do fluxo atual, validar os gates do projeto e documentar limites restantes

## Resumo do Objetivo

Estabilizar o MVP existente antes de qualquer expansao. O foco foi corrigir a execucao manual de qualificacao por lead, restaurar o comportamento correto de arquivar/desarquivar, tornar o webhook auditavel pela trilha oficial de runs/logs e eliminar divergencias imediatas que deixavam o fluxo principal enganoso.

## Implementado

- Payload manual de runs agora inclui `leadId` por meio de `src/lib/runs/manual-input.ts`
- Tela de lead ganhou atalho para abrir `/runs?lead=<id>` com prefill do lead
- Desarquivamento passou a restaurar `lastActiveStatus` preservado em metadata
- `updateLead` agora registra eventos `archived` e `unarchived`
- Webhook de leads passou a usar `executeAgent("lead-intake", ...)`
- `LeadIntakeAgent` registra correlacao de `runId` e deduplica `externalId` sem igualdade exata de JSON
- Testes direcionados adicionados para payload manual, arquivamento, webhook e deduplicacao

## Arquivos Principais

- `src/app/(dashboard)/runs/page.tsx`
- `src/app/(dashboard)/leads/[id]/page.tsx`
- `src/components/leads/lead-actions.tsx`
- `src/app/actions/leads.ts`
- `src/app/api/webhooks/leads/route.ts`
- `src/lib/agents/lead-intake.ts`
- `src/lib/agents/qualification.ts`
- `src/lib/leads/metadata.ts`
- `src/lib/runs/manual-input.ts`
- `src/app/actions/leads.test.ts`
- `src/app/api/webhooks/leads/route.test.ts`
- `src/lib/agents/lead-intake.test.ts`
- `src/lib/runs/manual-input.test.ts`
- `docs/features/stabilize-mvp.md`
- `.specs/features/stabilize-mvp/spec.md`

## Validacao

- `npm test` ✅
- `npm run build` ✅
- `npm run lint` ✅
- `npm run typecheck` ✅
- `curl -I http://127.0.0.1:3000` apos `npm run start` ✅ HTTP 200

## Observacoes

- `npm run typecheck` continuou dependendo de `.next/types` em workspace limpo; foi repetido apos o build, conforme o comportamento ja documentado na auditoria
- Persistem riscos de PII em logs e a falta de coluna dedicada para `externalId`, ambos fora do escopo deste ponto
