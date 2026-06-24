# Sequential Build Plan

## Resumo

Criacao do plano canonico de construcao sequencial do projeto, com ordem obrigatoria, um arquivo `.md` por ponto e protocolo de execucao com um agente por vez.

## Local

O pacote foi criado em:

`docs/plans/sequential-build/`

## Estrutura

- `README.md` — ordem obrigatoria, como usar e onde encontrar os planos
- `01-stabilize-mvp.md`
- `02-tests-and-quality.md`
- `03-data-and-persistence.md`
- `04-workflow-engine.md`
- `05-orchestrator-core.md`
- `06-mcp-and-integrations.md`
- `07-commercial-agents.md`
- `08-operations-and-security.md`
- `09-ux-and-product-polish.md`
- `10-release-readiness.md`

## Regra Operacional

Spawn one agent per point, executar um e depois puxar o outro, ate concluir.

Ou seja:

1. abrir o ponto atual;
2. spawnar um agente para esse ponto;
3. executar so aquele escopo;
4. validar;
5. consolidar;
6. passar para o proximo ponto.
