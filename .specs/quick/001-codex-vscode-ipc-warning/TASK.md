# Quick Task: Codex VS Code IPC Warning

## Scope

Corrigir o warning recorrente da extensao Codex no VS Code:
`[IpcClient] Received broadcast but no handler is configured method=client-status-changed`.

## Findings

- Logs afetados: `~/.config/Code/logs/20260623T143435/window1/exthost/openai.chatgpt/Codex.log`.
- Extensao instalada: `openai.chatgpt-26.5616.71553-linux-x64`.
- CLI embutido: `codex-cli 0.142.0`.
- O warning ocorre quando o cliente IPC recebe broadcast sem handler registrado.
- `client-status-changed` e um broadcast de estado/presenca do cliente; chegar antes da webview registrar handler nao deve ser tratado como warning operacional.

## Execute

1. Aplicar patch local minimo na extensao instalada para ignorar warning apenas para `client-status-changed`.
2. Limpar estado temporario do app-server/plugin sync com backup.
3. Validar logs reiniciando o app-server/extensao quando possivel.

## Verification

- O warning nao deve reaparecer para `method=client-status-changed`.
- Outros broadcasts sem handler continuam emitindo warning.
