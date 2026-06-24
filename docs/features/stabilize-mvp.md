# Stabilize MVP

## Resumo

Primeiro ponto do plano sequencial canonico para reduzir as divergencias mais graves entre a interface do MVP e o backend real. O foco desta etapa e tornar o fluxo atual menos enganoso e mais auditavel, sem ampliar o produto para escopos posteriores.

## Escopo

- corrigir a execucao manual do `QualificationAgent` para usar `leadId`;
- corrigir arquivar e desarquivar leads;
- registrar intake via webhook na trilha oficial de `AgentRun` e `AgentLog`;
- revisar divergencias graves apontadas na auditoria que impactam o fluxo principal imediato.

## Implementado

- A tela [runs/page.tsx](/home/tiagolocal/POC/orun.ai/src/app/(dashboard)/runs/page.tsx) agora monta payload manual com `leadId` e aceita prefill pela query `?lead=...`.
- A tela [leads/[id]/page.tsx](/home/tiagolocal/POC/orun.ai/src/app/(dashboard)/leads/[id]/page.tsx) ganhou atalho para executar o agente a partir do lead selecionado.
- O componente [lead-actions.tsx](/home/tiagolocal/POC/orun.ai/src/components/leads/lead-actions.tsx) restaurou o comportamento correto de desarquivar, usando o ultimo status ativo salvo em metadata.
- A action [leads.ts](/home/tiagolocal/POC/orun.ai/src/app/actions/leads.ts) passou a registrar eventos `archived` e `unarchived` e a preservar/remover `lastActiveStatus`.
- O webhook [route.ts](/home/tiagolocal/POC/orun.ai/src/app/api/webhooks/leads/route.ts) agora usa `executeAgent("lead-intake", ...)`, retornando `runId` para correlacao auditavel.
- O agente [lead-intake.ts](/home/tiagolocal/POC/orun.ai/src/lib/agents/lead-intake.ts) deixou de depender de igualdade exata do JSON de metadata para detectar duplicidade por `externalId` e registra correlacao de `runId` nos eventos.

## Validacao

- `npm test`
- `npm run build`
- `npm run lint`
- `npm run typecheck`
- `curl -I http://127.0.0.1:3000` apos `npm run start`

## Limites Restantes

- A deduplicacao por `externalId` ainda depende de leitura de `metadata` serializada; a coluna dedicada fica para o ponto de dados e persistencia.
- `npm run typecheck` continua dependendo de `.next/types` e precisou ser repetido apos o build em workspace limpo.
- A mascaracao de PII em logs ainda nao foi resolvida neste ponto e permanece para etapas posteriores de operacao e seguranca.

## Fora de Escopo

- expandir cobertura ampla de testes alem do necessario para proteger os bugs corrigidos;
- criar workflow engine;
- implementar orchestrator;
- adicionar novas integracoes MCP ou agentes comerciais adicionais.
