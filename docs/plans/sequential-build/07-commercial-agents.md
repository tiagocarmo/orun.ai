# 07 — Commercial Agents

## Objetivo

Expandir o conjunto de agentes comerciais alem do MVP basico.

## Por Que Este Ponto Vem Agora

Depois de workflow, orchestrator e MCP minimo, faz sentido aumentar a equipe digital de forma controlada.

## Escopo

* implementar `SchedulingAgent`;
* implementar `FollowUpAgent`;
* implementar `ResearchAgent`;
* iniciar `DocumentAgent` e `HumanHandoffAgent` em versao minima;
* definir contratos de entrada/saida para cada agente;
* integrar cada agente aos workflows canonicos correspondentes.

## Entradas

* `AGENTS.md`
* `docs/workflows.md`
* `docs/orchestrator.md`
* estado atual de `src/lib/agents/**`

## Saidas Esperadas

* equipe digital comercial mais completa;
* contratos mais claros por agente;
* workflows de negocio deixando de ser aspiracionais.

## Agente a Spawnar

Um agente de implementacao focado em dominio comercial e especializacao de agentes.

## Criterio de Conclusao

* novos agentes existem com validacao, logs e limites;
* cada agente novo participa de pelo menos um workflow oficial;
* handoff e aprovacoes criticas comecam a existir de forma minima.

## Proximo Plano

Depois de concluir este ponto, puxar `08-operations-and-security.md`.
