# Quick Task

## Tarefa

Corrigir a falha de inicialização da extensão do Codex para VS Code causada por manifesto inválido de plugin local.

## Escopo

- Identificar o plugin e o campo inválido
- Corrigir o manifesto
- Validar a inicialização sem o warning

## Verificação

- `codex app-server --stdio` inicia sem registrar `prompt must be at most 128 characters`
