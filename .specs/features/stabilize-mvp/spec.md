# Stabilize MVP

## Contexto

O ponto canonico `docs/plans/sequential-build/01-stabilize-mvp.md` exige estabilizar o fluxo principal do MVP antes de qualquer expansao. A auditoria aponta divergencias entre a UI, as server actions e a execucao real dos agentes.

## Complexidade

Medium.

Justificativa:
- afeta mais de tres arquivos;
- ha bugs objetivos e conhecidos;
- nao exige nova arquitetura nem decomposicao formal em `design.md` ou `tasks.md`.

## Objetivo

Restabelecer a coerencia do fluxo atual de ponta a ponta para que:
- a execucao manual do `QualificationAgent` funcione com `leadId`;
- arquivar e desarquivar lead funcionem conforme a UI promete;
- intake por webhook gere trilha auditavel coerente;
- divergencias graves e imediatas do MVP sejam revisitadas sem invadir os proximos planos.

## Requisitos

- STAB-01: a tela de execucao manual deve enviar um payload valido para `qualification`, incluindo `leadId`.
- STAB-02: a acao de arquivar/desarquivar lead deve refletir corretamente o estado prometido pela UI.
- STAB-03: o webhook de leads deve registrar `AgentRun` e `AgentLog` coerentes, sem bypass da trilha de execucao.
- STAB-04: o ponto deve manter o escopo restrito ao MVP atual, sem implementar workflow engine, orchestrator ou integracoes novas.
- STAB-05: a documentacao operacional desta estabilizacao deve registrar o que foi corrigido e os limites restantes.

## Verificacao

- Validar o fluxo manual de qualificacao por meio de testes direcionados e/ou verificacao de payload.
- Validar o comportamento de arquivar/desarquivar via testes das server actions ou componente.
- Validar que o webhook usa a trilha padrao de execucao e persiste historico coerente.
- Rodar `npm test`, `npm run build`, `npm run lint` e `npm run typecheck` antes de concluir.
