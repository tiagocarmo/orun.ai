# 06 — MCP and Integrations

## Objetivo

Transformar a camada MCP e integracoes de stub para contrato operacional utilizavel pelos agentes.

## Por Que Este Ponto Vem Agora

Com workflow engine e orchestrator no lugar, as integracoes deixam de ser funcoes isoladas e passam a ser ferramentas governadas.

## Escopo

* estruturar client MCP;
* definir registry de tools habilitadas;
* implementar ao menos uma tool real ou stub executavel de baixo risco;
* revisar retries, fallbacks e erros;
* ligar tools MCP a runs e logs;
* iniciar a camada de integracoes seguras.

## Entradas

* `src/lib/mcp/**`
* `docs/orchestrator.md`
* `AGENTS.md`
* `docs/codex-report/05-recommendations.md`

## Saidas Esperadas

* MCP util no produto, nao apenas tipagem;
* uma primeira integracao executavel;
* contrato seguro para ferramentas futuras.

## Agente a Spawnar

Um agente de implementacao focado em MCP e integracoes.

## Criterio de Conclusao

* ao menos uma ferramenta MCP pode ser invocada e auditada;
* erros e retries seguem politica definida;
* base pronta para calendario, conhecimento, CRM e documentos.

## Proximo Plano

Depois de concluir este ponto, puxar `07-commercial-agents.md`.
