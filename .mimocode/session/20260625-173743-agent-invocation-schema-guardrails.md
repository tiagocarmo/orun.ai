# Sessao 20260625-173743

## Objetivo

Entender um erro de chamada de agente/tool e registrar diretrizes assertivas para evitar recorrencia.

## Problema observado

- `operation` foi enviado como string quando a tool esperava object
- `timeout_ms` e `context` foram enviados como chaves nao reconhecidas

## Acoes executadas

- Atualizacao de `AGENTS.md` com contrato de invocacao e regra de fallback para erro de schema
- Atualizacao de `CLAUDE.md` com checklist obrigatorio antes de delegar
- Atualizacao do `README.md` em troubleshooting
- Criacao de `docs/features/agent-invocation-schema-guardrails.md`
- Registro quick mode em `.specs/quick/002-agent-invocation-schema-guardrails/`
- Bump de versao patch para `1.5.1`

## Resultado

O projeto agora tem uma convencao explicita para distinguir erro de invocacao/schema de erro de dominio do agente e para impedir payloads com chaves inventadas ou tipos incorretos.
