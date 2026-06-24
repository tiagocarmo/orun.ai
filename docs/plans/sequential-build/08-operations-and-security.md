# 08 — Operations and Security

## Objetivo

Adicionar os controles operacionais e de seguranca necessarios para o produto deixar de ser apenas um POC confortavel.

## Por Que Este Ponto Vem Agora

Com mais agentes e integracoes, cresce o risco. Precisamos de auth, mascaramento e governanca antes de pensar em release serio.

## Escopo

* autenticacao e autorizacao basicas;
* separacao de usuario/organizacao quando necessario;
* mascaramento de PII em logs;
* politica para secrets fora do banco;
* controles para acoes sensiveis;
* alertas e observabilidade minima operacional.

## Entradas

* `AGENTS.md`
* `docs/orchestrator.md`
* `docs/codex-report/04-implementation-audit.md`
* `src/lib/mcp/registry.ts`

## Saidas Esperadas

* base de seguranca coerente com o que os docs prometem;
* menos risco de expor dados ou credenciais;
* aprovacoes humanas melhor modeladas.

## Agente a Spawnar

Um agente de implementacao focado em seguranca, observabilidade e governanca.

## Criterio de Conclusao

* auth minima existe;
* logs nao carregam PII indevida;
* segredos deixam de ficar em posicoes improprias;
* eventos sensiveis tem politica de aprovacao.

## Proximo Plano

Depois de concluir este ponto, puxar `09-ux-and-product-polish.md`.
