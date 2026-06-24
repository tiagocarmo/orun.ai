# Workflow Engine

Motor mínimo de workflows para a plataforma Orun.AI.

## Visão Geral

O Workflow Engine permite criar, executar, pausar, retomar e cancelar workflows compostos por múltiplos passos, onde cada passo executa um agente registrado na plataforma.

## Arquitetura

```
Workflow (definição)
    ↓
WorkflowRun (execução)
    ↓
Step 1 → Agent
    ↓
Step 2 → Agent
    ↓
...
    ↓
Resultado Final
```

## Componentes

### Types (`src/lib/workflows/types.ts`)

Define os tipos centrais:
- `WorkflowStepDefinition` - Definição de um passo do workflow
- `WorkflowStepLog` - Log de execução de um passo
- `WorkflowContext` - Contexto acumulado durante a execução
- `WorkflowRunResult` - Resultado de uma execução de workflow

### Engine (`src/lib/workflows/engine.ts`)

Motor principal que orquestra a execução:
- `startWorkflow(workflowId, input)` - Inicia uma nova execução
- `pauseWorkflow(runId)` - Pausa a execução
- `resumeWorkflow(runId)` - Retoma de pausa
- `cancelWorkflow(runId)` - Cancela a execução
- `getWorkflowRun(runId)` - Consulta status e histórico

### Logger (`src/lib/workflows/logger.ts`)

Gerencia logs de cada passo:
- Cria, completa, falha ou pula passos
- Serializa/deserializa histórico de execução

### Server Actions (`src/app/actions/workflows.ts`)

Ações server-side para uso em UI:
- `startWorkflowAction`
- `pauseWorkflowAction`
- `resumeWorkflowAction`
- `cancelWorkflowAction`
- `getWorkflowRunAction`
- `listWorkflows`

## Formato dos Passos

Os passos são definidos como JSON no campo `steps` do modelo `Workflow`:

```json
[
  {
    "id": "step-1",
    "agentSlug": "qualification",
    "inputMapping": {
      "leadId": "$input.leadId"
    },
    "condition": null
  }
]
```

### Variáveis de Contexto

- `$input.*` - Dados originais de entrada do workflow
- `$previous.*` - Saída do passo anterior
- `$context.*` - Contexto acumulado

### Condições

Passos podem ter condições opcionais:
- `$previous.output` - Executa apenas se o passo anterior produziu saída
- `!$previous.output` - Executa apenas se o passo anterior NÃO produziu saída

## Estados

### WorkflowRun

- `pending` - Aguardando início
- `running` - Em execução
- `paused` - Pausado (pode ser retomado)
- `completed` - Concluído com sucesso
- `failed` - Falhou
- `cancelled` - Cancelado pelo usuário

### WorkflowStep

- `pending` - Aguardando
- `running` - Em execução
- `completed` - Concluído
- `failed` - Falhou
- `skipped` - Pulado (condição não atendida)

## Exemplo de Uso

```typescript
import { startWorkflow } from "@/lib/workflows/engine";

const result = await startWorkflow("workflow-qualification", {
  leadId: "lead-123",
});

if (result.status === "completed") {
  console.log("Workflow concluído:", result.output);
} else {
  console.error("Workflow falhou:", result.error);
}
```

## Testes

```bash
npx vitest run src/lib/workflows/engine.test.ts
```

Cobertura:
- Execução bem-sucedida de workflow
- Falha em passo individual
- Pausa e retomada
- Cancelamento
- Validação de workflow inexistente/inativo
- Consulta de status

## Próximos Passos

- Executor paralelo para passos independentes
- Workflow Builder visual
- Triggers baseados em eventos
- Retry automático com backoff
