# orchestrator.md

## Visão Geral

O Orchestrator é o componente central da plataforma Orun.AI.

Sua função é coordenar agentes especializados, gerenciar workflows, compartilhar contexto, controlar execução de tarefas e consolidar resultados.

O Orchestrator não possui conhecimento de negócio específico.

Ele atua como um gerente de equipe digital.

---

# Objetivos

* Coordenar agentes especializados
* Executar workflows complexos
* Compartilhar contexto entre agentes
* Controlar uso de ferramentas MCP
* Garantir rastreabilidade
* Permitir intervenção humana
* Consolidar resultados
* Otimizar custo e consumo de tokens

---

# Princípios

## Agentes Especializados

Cada agente deve possuir uma responsabilidade única.

Exemplos:

| Agente              | Responsabilidade         |
| ------------------- | ------------------------ |
| Qualification Agent | Qualificar leads         |
| Scheduling Agent    | Agendar reuniões         |
| Document Agent      | Gerar documentos         |
| Knowledge Agent     | Consultar conhecimento   |
| Follow-up Agent     | Executar acompanhamentos |

---

## Planejamento Antes da Execução

Nenhuma tarefa deve ser executada sem um plano.

Exemplo:

Objetivo:

```txt
Preparar reunião com João Silva.
```

Plano:

```txt
1. Buscar lead
2. Buscar empresa
3. Buscar histórico
4. Resumir informações
5. Preparar briefing
```

---

## Delegação

O Orchestrator nunca executa diretamente tarefas especializadas.

Sempre delega para agentes.

---

## Consolidação

Todos os resultados devem retornar ao Orchestrator.

O usuário nunca recebe respostas diretamente dos agentes.

---

## Auditabilidade

Todas as decisões devem ser registradas.

Registrar:

* Objetivo recebido
* Plano criado
* Agentes acionados
* Ferramentas utilizadas
* Tempo de execução
* Resultado

---

# Arquitetura

```txt
Usuário
    │
    ▼
Orchestrator
    │
    ├── Qualification Agent
    ├── Scheduling Agent
    ├── Follow-up Agent
    ├── Knowledge Agent
    ├── Document Agent
    ├── Research Agent
    ├── CRM Sync Agent
    ├── Human Handoff Agent
    └── Monitoring Agent
```

---

# Ciclo de Execução

## Fase 1 — Recepção

Receber objetivo.

Exemplo:

```txt
Gerar proposta para o cliente XPTO.
```

---

## Fase 2 — Planejamento

Quebrar o objetivo em tarefas.

Exemplo:

```txt
Tarefa 1 → Buscar cliente
Tarefa 2 → Buscar histórico
Tarefa 3 → Gerar proposta
Tarefa 4 → Converter PDF
```

---

## Fase 3 — Seleção de Agentes

Determinar quais agentes serão utilizados.

Exemplo:

```txt
Knowledge Agent
Document Agent
```

---

## Fase 4 — Execução

Executar tarefas.

Pode ocorrer:

* Sequencial
* Paralela
* Híbrida

---

## Fase 5 — Consolidação

Consolidar resultados recebidos.

Exemplo:

```txt
Cliente encontrado
Histórico carregado
Proposta gerada
PDF criado
```

---

## Fase 6 — Resposta

Retornar resultado final.

---

# Context Engine

## Objetivo

Permitir compartilhamento de contexto entre agentes.

---

## Contexto Global

Disponível para todos os agentes.

Exemplos:

* Organização
* Usuário
* Lead atual
* Workflow atual

---

## Contexto de Workflow

Disponível apenas durante a execução.

Exemplo:

```json
{
  "workflowId": "wf_123",
  "leadId": "lead_001",
  "meetingId": "meet_456"
}
```

---

## Contexto do Agente

Privado para cada agente.

Exemplo:

```json
{
  "qualificationScore": 85,
  "qualificationReason": "Empresa com mais de 100 colaboradores"
}
```

---

# Memória

## Curto Prazo

Utilizada durante a execução.

Persistida em:

```txt
workflow_runs
```

---

## Longo Prazo

Utilizada em execuções futuras.

Persistida em:

```txt
conversations
messages
lead_events
knowledge_documents
```

---

# MCP Integration Layer

## Objetivo

Permitir acesso a ferramentas externas.

---

## Fluxo

```txt
Agent
  ↓
Orchestrator
  ↓
MCP Registry
  ↓
MCP Tool
  ↓
Resultado
```

---

# MCP Registry

Tabela responsável por registrar ferramentas.

Exemplo:

```json
{
  "id": "google-drive",
  "name": "Google Drive",
  "enabled": true
}
```

---

# Ferramentas MCP Previstas

## Conhecimento

* Google Drive
* Notion
* Confluence

## Comunicação

* Gmail
* Outlook
* Slack
* WhatsApp

## CRM

* HubSpot
* Salesforce
* Pipedrive

## Desenvolvimento

* GitHub
* GitLab

## Produtividade

* Google Calendar
* Outlook Calendar

---

# Estratégias de Execução

## Sequential

Executa uma tarefa após a outra.

Exemplo:

```txt
Buscar Lead
 ↓
Qualificar
 ↓
Agendar
```

---

## Parallel

Executa simultaneamente.

Exemplo:

```txt
Buscar LinkedIn
Buscar Website
Buscar CRM
```

---

## Hybrid

Combina execução paralela e sequencial.

---

# Human-in-the-Loop

## Objetivo

Permitir validação humana.

---

## Casos Obrigatórios

* Assinatura de contrato
* Exclusão de dados
* Aprovação financeira
* Alterações críticas

---

## Fluxo

```txt
Agente
 ↓
Solicita Aprovação
 ↓
Humano Aprova
 ↓
Workflow Continua
```

---

# Tratamento de Erros

## Retry

Tentar novamente.

Configuração padrão:

```txt
3 tentativas
```

---

## Fallback

Trocar ferramenta ou agente.

Exemplo:

```txt
Google Calendar indisponível
 ↓
Outlook Calendar
```

---

## Escalação Humana

Após falhas consecutivas.

---

# Observabilidade

## Métricas

Registrar:

* Workflow ID
* Agent ID
* Tempo de execução
* Tokens consumidos
* Modelo utilizado
* Ferramentas utilizadas
* Erros

---

## Dashboards

Indicadores:

* Leads processados
* Reuniões agendadas
* Contratos gerados
* Taxa de conversão
* Tempo médio de execução
* Consumo de tokens

---

# Estrutura Recomendada

```txt
/src/lib/orchestrator
    orchestrator.ts

/src/lib/orchestrator
    planner.ts
    executor.ts
    router.ts
    context.ts
    memory.ts
    registry.ts

/src/lib/agents
    qualification.agent.ts
    scheduling.agent.ts
    followup.agent.ts
    knowledge.agent.ts
    document.agent.ts
    research.agent.ts
    crm.agent.ts

/src/lib/mcp
    registry.ts
    client.ts
    tools/
```

---

# Roadmap

## MVP

* Planejamento simples
* Execução sequencial
* Registro de contexto
* Registro de logs
* MCP básico
* Human Handoff

## V2

* Execução paralela
* Memória compartilhada
* Agentes colaborativos
* Workflow Builder visual

## V3

* Planejamento dinâmico
* Auto-seleção de agentes
* Auto-descoberta de MCPs
* Multi-organização
* Workforce AI completo

---

# Regra Principal

O Orchestrator deve agir como um gerente de equipe digital, coordenando agentes especializados, garantindo controle, rastreabilidade e segurança, sem concentrar conhecimento ou lógica de negócio em um único agente.
