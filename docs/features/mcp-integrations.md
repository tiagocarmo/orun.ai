# MCP and Integrations

Transformação da camada MCP de stub para contrato operacional utilizável pelos agentes.

## Visão Geral

O MCP (Model Context Protocol) fornece a camada de integração com ferramentas externas. Este módulo implementa um client MCP, tools executáveis e uma camada de integração segura.

## Arquitetura

```
Agent/Orchestrator
    ↓
MCP Client (callTool/callToolWithRetry)
    ↓
MCP Registry (tool lookup)
    ↓
MCP Tool (execute)
    ↓
Integration Layer (config/secret resolution)
    ↓
Result + Audit Log
```

## Componentes

### MCP Client (`src/lib/mcp/client.ts`)

Ponto de entrada para execução de tools:
- `callTool(name, input)` — Executa tool simples
- `callToolWithRetry(name, input, options)` — Executa com retry
- `getExecutionLogs(toolName?)` — Consulta logs de execução

### MCP Types (`src/lib/mcp/types.ts`)

Tipos estendidos:
- `MCPToolOptions` — Opções de retry, timeout, permissões
- `MCPToolExecutionLog` — Log de auditoria
- `MCPToolPermission` — Controle de acesso

### MCP Registry (`src/lib/mcp/registry.ts`)

Registro de tools disponíveis:
- `register(tool)` — Registra tool
- `get(name)` — Busca tool por nome
- `list()` — Lista todas as tools
- `serverInfo()` — Informações do servidor MCP

### Tools Implementadas

#### Calendar Tools (`src/lib/mcp/tools/calendar.ts`)

- `CheckAvailabilityTool` — Verifica disponibilidade de horários
- `CreateEventTool` — Cria evento (stub)

#### Document Tools (`src/lib/mcp/tools/document.ts`)

- `GenerateDocumentTool` — Gera documento Markdown/HTML
- `ReadDocumentTool` — Lê documento (stub)

### Tool Base (`src/lib/mcp/tools/base.ts`)

Classe abstrata para tools MCP:
- Helpers para criar resultados
- Opções de configuração
- Ponto de extensão para novas tools

### Integration Layer (`src/lib/mcp/integration.ts`)

Camada de integração segura:
- `executeToolWithIntegration(toolName, integrationId, input)` — Executa com contexto
- `resolveSecretReference(secretRef)` — Resolve referências de segredos
- Suporte a `env:` para variáveis de ambiente

## Exemplo de Uso

```typescript
import { callTool } from "@/lib/mcp/client";

const result = await callTool("calendar-check-availability", {
  date: "2024-01-15",
  startTime: "09:00",
  endTime: "17:00",
  durationMinutes: 30,
});

if (!result.isError) {
  const data = JSON.parse(result.content[0].text);
  console.log(data.availableSlots);
}
```

## Com Retry

```typescript
import { callToolWithRetry } from "@/lib/mcp/client";

const result = await callToolWithRetry("calendar-create-event", {
  title: "Meeting",
  date: "2024-01-15",
  startTime: "10:00",
  endTime: "11:00",
}, {
  maxRetries: 3,
  retryDelayMs: 1000,
});
```

## Integração com Banco

```typescript
import { executeToolWithIntegration } from "@/lib/mcp/integration";

const result = await executeToolWithIntegration(
  "calendar-create-event",
  "integration-123",
  { title: "Meeting", date: "2024-01-15", startTime: "10:00", endTime: "11:00" }
);
```

## Adicionando Nova Tool

1. Criar classe que extende `BaseMCPTool`
2. Implementar `definition()` e `execute()`
3. Registrar no `tools/index.ts`
4. Adicionar testes

## Testes

```bash
npx vitest run src/lib/mcp/tools/
```

Cobertura:
- Execução de tools
- Retry com falha
- Tratamento de erros
- Logs de auditoria

## Próximos Passos

- Tools reais (Google Calendar, Notion, etc.)
- Autenticação OAuth
- Rate limiting
- Cache de resultados
