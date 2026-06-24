# Orchestrator Core

Núcleo do Orchestrator para planejar, delegar, compartilhar contexto e consolidar resultados.

## Visão Geral

O Orchestrator é o componente central que coordena agentes especializados. Ele NUNCA executa tarefas de domínio diretamente — apenas planeja, delega e consolida.

## Arquitetura

```
Objetivo do Usuário
    ↓
Planner (cria plano)
    ↓
Context Engine (gerencia contexto)
    ↓
Executor (executa passos)
    ↓
Consolidator (consolida resultados)
    ↓
Observability (registra logs)
    ↓
Resultado Final
```

## Componentes

### Types (`src/lib/orchestrator/types.ts`)

Tipos centrais:
- `OrchestratorPlan` — Plano com passos e estratégia
- `OrchestratorStep` — Passo individual com agente e mapeamento
- `ExecutionContext` — Contexto global, workflow e por agente
- `OrchestratorResult` — Resultado consolidado

### Planner (`src/lib/orchestrator/planner.ts`)

Cria planos baseados no objetivo:
- `createPlan(objective, availableAgents, input)` — Gera plano com passos
- `selectAgents(step, availableAgents)` — Seleciona agente para passo
- Planejamento baseado em regras para MVP

### Context Engine (`src/lib/orchestrator/context.ts`)

Gerencia contexto de execução:
- `createContext(input)` — Inicializa contexto
- `addStepResult(context, stepId, result)` — Adiciona resultado
- `getAgentContext(context, agentSlug)` — Contexto privado do agente
- Separação: global, workflow, agent

### Executor (`src/lib/orchestrator/executor.ts`)

Executa planos:
- `executePlan(plan, context)` — Executa sequencialmente
- `executeStep(step, context)` — Executa passo individual
- Usa `executeAgent` existente
- Para em falha de passo obrigatório

### Consolidator (`src/lib/orchestrator/consolidator.ts`)

Consolida resultados:
- `consolidateResults(plan, stepResults, duration)` — Mescla saídas
- Determina status: completed/failed/partial
- Gera resumo legível

### Observability (`src/lib/orchestrator/observability.ts`)

Registra execuções:
- `logExecution(plan, result)` — Cria log de execução
- `formatExecutionLog(log)` — Formata para console
- Rastreia duração, tokens, erros

### Main Orchestrator (`src/lib/orchestrator/orchestrator.ts`)

Ponto de entrada principal:
- `orchestrate(objective, input)` — Executa fluxo completo
- Coordena todos os componentes
- Registra métricas

## Exemplo de Uso

```typescript
import { orchestrate } from "@/lib/orchestrator";

const result = await orchestrate("Qualify the lead", {
  leadId: "lead-123",
});

console.log(result.status); // "completed"
console.log(result.output); // { "step-qualification": { score: 85 } }
console.log(result.summary); // "Objective: Qualify the lead. Steps: 1 completed..."
```

## Princípios

1. **Orchestrator nunca executa domínio** — Apenas coordena
2. **Planejamento antes da execução** — Todo objetivo vira plano
3. **Contexto separado** — Global, workflow e por agente
4. **Auditabilidade** — Todas as decisões são registradas
5. **Falha segura** — Para em passo obrigatório com falha

## Testes

```bash
npx vitest run src/lib/orchestrator/orchestrator.test.ts
```

Cobertura:
- Criação de plano
- Resolução de variáveis
- Execução sequencial
- Tratamento de falhas
- Consolidação de resultados
- Orquestração completa

## Próximos Passos

- Planejamento com LLM (não apenas regras)
- Execução paralela
- Retry automático
- Integração com MCP
- Human-in-the-loop para ações sensíveis
