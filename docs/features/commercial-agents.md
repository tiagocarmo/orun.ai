# Commercial Agents

Expansão do conjunto de agentes comerciais além do MVP básico.

## Visão Geral

O Orun.AI agora conta com uma equipe digital completa para automação comercial, incluindo agentes para agendamento, follow-up, pesquisa, documentos e escalação humana.

## Agentes Implementados

### SchedulingAgent (`src/lib/agents/scheduling.ts`)

**Responsabilidade:** Agendar reuniões com leads qualificados.

**Contrato:**
- Input: `leadId`, `preferredTime?`, `duration?`, `notes?`
- Output: `meetingScheduled`, `meetingId`, `scheduledTime`

**Regras:**
- Valida existência do lead
- Gera horário padrão se não especificado
- Registra evento de agendamento

### FollowUpAgent (`src/lib/agents/follow-up.ts`)

**Responsabilidade:** Executar lembretes, cobranças educadas e reativações.

**Contrato:**
- Input: `leadId`, `actionType` (email/whatsapp/sms/call), `message`, `channel?`
- Output: `actionExecuted`, `attemptNumber`, `nextFollowUp`

**Regras:**
- Limite de 5 tentativas por lead
- Calcula próximo follow-up progressivo (1, 3, 7 dias)
- Registra cada tentativa

### ResearchAgent (`src/lib/agents/research.ts`)

**Responsabilidade:** Enriquecer informações de leads e empresas.

**Contrato:**
- Input: `leadId`, `researchType` (company/contacts/social/full), `sources?`
- Output: `enrichedData`, `confidence`, `sourcesUsed`

**Regras:**
- Implementação stub para MVP
- Calcula confiança baseada em dados disponíveis
- Registra fontes consultadas

### DocumentAgent (`src/lib/agents/document.ts`)

**Responsabilidade:** Gerar propostas, minutas e documentos comerciais.

**Contrato:**
- Input: `leadId`, `templateType` (proposal/contract/summary/briefing), `variables?`, `format?`
- Output: `documentId`, `documentUrl`, `content`

**Regras:**
- Suporta Markdown e HTML
- Templates pré-definidos
- Salva documento no banco

### HumanHandoffAgent (`src/lib/agents/human-handoff.ts`)

**Responsabilidade:** Identificar quando escalar para humano.

**Contrato:**
- Input: `leadId`, `reason`, `priority?`, `conversationContext?`, `assignedTo?`
- Output: `escalated`, `priority`, `assignedTo`, `summary`

**Regras:**
- Prioridade automática baseada no motivo (legal/financial = high)
- Atribuição automática por prioridade
- Atualiza status do lead para "escalated"

## Registro de Agentes

Todos os agentes são registrados em `src/lib/agents/index.ts`:

```typescript
agentRegistry.register(new LeadIntakeAgent());
agentRegistry.register(new QualificationAgent());
agentRegistry.register(new SchedulingAgent());
agentRegistry.register(new FollowUpAgent());
agentRegistry.register(new ResearchAgent());
agentRegistry.register(new DocumentAgent());
agentRegistry.register(new HumanHandoffAgent());
```

## Integração com Workflows

Os agentes participam dos seguintes workflows oficiais:

| Workflow | Agentes Envolvidos |
|----------|-------------------|
| Captura de Lead | LeadIntake, Qualification |
| Qualificação | Qualification |
| Agendamento | Scheduling |
| Follow-up | Follow-up |
| Geração de Documento | Document |
| Escalação Humana | HumanHandoff |

## Testes

```bash
npx vitest run src/lib/agents/
```

Cobertura:
- Validação de input
- Caminhos de execução
- Tratamento de erros
- Limites e regras de negócio

## Próximos Passos

- Integrar com MCP tools reais
- Adicionar LLM para pesquisa avançada
- Implementar aprovação humana para documentos
- Dashboard de métricas por agente
