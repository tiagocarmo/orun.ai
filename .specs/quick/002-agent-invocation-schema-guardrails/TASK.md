# Quick Task

## Scope

Registrar guardrails para evitar erros de schema ao chamar agentes e tools delegadas.

## Why

Uma chamada anterior enviou `operation` no tipo errado e incluiu chaves nao reconhecidas na raiz do payload.

## Files

- `AGENTS.md`
- `CLAUDE.md`
- `README.md`
- `docs/features/agent-invocation-schema-guardrails.md`

## Verification

- Documentacao atualizada com regra explicita de validacao de schema
- Troubleshooting do projeto inclui a interpretacao do erro
