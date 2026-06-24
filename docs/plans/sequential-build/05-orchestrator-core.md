# 05 — Orchestrator Core

## Objetivo

Criar o nucleo do Orchestrator para planejar, delegar, compartilhar contexto e consolidar resultados.

## Por Que Este Ponto Vem Agora

Depois do workflow engine, ja temos a base certa para introduzir coordenacao entre agentes sem pular para autonomia caotica.

## Escopo

* criar estrutura `src/lib/orchestrator/**`;
* implementar planner simples;
* implementar selecao de agentes;
* separar contexto global, de workflow e de agente;
* consolidar resultados em resposta final unica;
* registrar tokens, tempo, erros e ferramentas.

## Entradas

* `docs/orchestrator.md`
* `docs/workflows.md`
* `AGENTS.md`
* `src/lib/agents/**`

## Saidas Esperadas

* Orchestrator minimo funcional;
* primeiros objetivos multi-etapa executaveis;
* governanca clara entre orquestracao e agentes especializados.

## Agente a Spawnar

Um agente de implementacao focado em arquitetura e coordenacao.

## Criterio de Conclusao

* o Orchestrator nao executa dominio diretamente;
* ele planeja, delega e consolida;
* logs e contexto ficam registrados;
* ao menos um caso multi-etapa funciona com rastreabilidade.

## Proximo Plano

Depois de concluir este ponto, puxar `06-mcp-and-integrations.md`.
