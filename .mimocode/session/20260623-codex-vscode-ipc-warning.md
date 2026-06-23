# Sessao 2026-06-23 — Codex VS Code IPC Warning

## Problema

A extensao Codex no VS Code continuava emitindo:

```txt
[IpcClient] Received broadcast but no handler is configured method=client-status-changed
```

## Diagnostico

- Logs analisados em `~/.config/Code/logs/20260623T143435/window1/exthost/openai.chatgpt/Codex.log`
- Extensao instalada: `openai.chatgpt-26.5616.71553-linux-x64`
- CLI embutido: `codex-cli 0.142.0`
- O evento `client-status-changed` e um broadcast de status do router IPC
- O bundle registrava warning para qualquer broadcast sem handler quando nenhum `anyBroadcastHandler` estava ativo

## Correcoes

- Backup do bundle: `~/.vscode/extensions/openai.chatgpt-26.5616.71553-linux-x64/out/extension.js.codex-ipc-backup-20260623`
- Patch local em `out/extension.js` para ignorar warning somente para `client-status-changed`
- Temporarios movidos para `~/.codex/.tmp-backup-20260623-ipc/`
- Documentacao atualizada em `docs/features/codex-vscode-startup-fix.md`

## Validacao

- `node --check` no bundle alterado passou
- Proxima validacao operacional exige recarregar/reabrir a janela do VS Code
