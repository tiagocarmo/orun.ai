# Codex VS Code Startup Fix

## Resumo

Correção do erro de inicialização da extensão do Codex no VS Code causado por manifesto inválido de plugin local.

## Causa raiz

- Plugin afetado: `ngs-analysis`
- Arquivo: `~/.codex/.tmp/plugins/plugins/ngs-analysis/.codex-plugin/plugin.json`
- Campo inválido: `interface.defaultPrompt[0]`
- Motivo: prompt com 313 caracteres, acima do limite de 128 caracteres aceito pelo Codex

## Correção aplicada

- Redução do conteúdo de `interface.defaultPrompt[0]` para uma versão com 124 caracteres
- Preservação da intenção funcional do plugin sem violar a validação do manifesto

## Validação

- Confirmar que o manifesto corrigido não emite mais o warning `prompt must be at most 128 characters`
- Reexecutar a inicialização do `codex app-server`
- Reabrir a extensão no VS Code e verificar que o erro anterior não reaparece

---

## Correção adicional — IPC client-status-changed

### Sintoma

Em 2026-06-23, a extensão continuou emitindo:

```txt
[IpcClient] Received broadcast but no handler is configured method=client-status-changed
```

### Causa raiz

O bundle da extensão `openai.chatgpt-26.5616.71553-linux-x64` registra warning quando recebe qualquer broadcast IPC sem handler. O evento `client-status-changed` é um broadcast de status/presença emitido pelo router quando clientes conectam ou desconectam; ele pode chegar antes da webview registrar handlers e não deve ser tratado como falha operacional.

### Correção aplicada

- Backup criado em `~/.vscode/extensions/openai.chatgpt-26.5616.71553-linux-x64/out/extension.js.codex-ipc-backup-20260623`
- Patch local em `out/extension.js` para não emitir warning apenas quando `method === "client-status-changed"`
- Warnings para outros broadcasts sem handler continuam ativos
- Temporários de sync movidos para `~/.codex/.tmp-backup-20260623-ipc/`

### Validação

- `node --check ~/.vscode/extensions/openai.chatgpt-26.5616.71553-linux-x64/out/extension.js`
- Reabrir ou recarregar a janela do VS Code para carregar o bundle corrigido
