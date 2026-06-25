# Agent Invocation Schema Guardrails

## Objetivo

Evitar falhas de delegacao causadas por payload invalido ao chamar agentes, actor tools ou outras ferramentas com schema estrito.

## Problema observado

Uma chamada anterior falhou com os seguintes sinais:

- `operation` foi enviado no tipo errado
- `timeout_ms` foi enviado como chave nao reconhecida
- `context` foi enviado como chave nao reconhecida

Isso caracteriza erro de invocacao, nao erro de negocio do agente.

## Regra adotada

Antes de qualquer delegacao:

1. ler o schema atual da ferramenta;
2. montar apenas os campos permitidos;
3. validar tipos campo a campo;
4. remover chaves auxiliares nao documentadas;
5. reenviar somente depois da correcao estrutural.

## Regra de decisao

- Se o schema exigir objeto, nao enviar string.
- Se o campo nao existir no contrato, nao enviar.
- Se a ferramenta rejeitar por schema, nao insistir por aproximacao.

## Resultado esperado

As chamadas passam a falhar menos por erro de formato e ficam mais auditaveis, porque o log distingue claramente:

- erro de invocacao/schema;
- erro de execucao do agente;
- erro de dominio/regra de negocio.
