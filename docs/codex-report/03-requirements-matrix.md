# 03 — Matriz de Requisitos vs Implementacao Real

Legenda:

- Implementado: existe no codigo e atende ao essencial.
- Parcial: existe base, mas incompleta, fragil ou sem todos criterios.
- Divergente: existe algo, mas nao cumpre o comportamento prometido.
- Nao implementado: nao ha implementacao funcional.

## MVP do `AGENTS.md`

| ID | Requisito | Status | Evidencia | Lacuna |
|---|---|---|---|---|
| MVP-01 | Cadastro de agentes | Parcial | `src/app/actions/agents.ts`, telas `agents/**` | Delete e fisico; prompts ficam no model `Agent`, mas nao ha governanca/revisao; UI usa rota `[id]` com slug/id misturado. |
| MVP-02 | Cadastro de leads | Parcial | `src/app/actions/leads.ts`, telas `leads/**` | Duplicidade so por email/phone; `externalId` nao existe como coluna; desarquivar esta quebrado. |
| MVP-03 | Execucao manual de agente | Divergente | `src/app/(dashboard)/runs/page.tsx`, `src/app/actions/runs.ts` | Se selecionar lead para qualificar, input nao inclui `leadId`; `QualificationAgent` exige `leadId`. |
| MVP-04 | Qualificacao simples de lead | Parcial | `src/lib/agents/qualification.ts` | Heuristica simples existe; nao usa criterios configuraveis, historico de mensagens ou LLM; nao escala duvida para humano. |
| MVP-05 | Registro de conversas | Parcial | `Conversation`, `Message`, `addMessage`, UI de conversa | Sem integracao automatica entre execucao de agentes e mensagens; command palette nao busca conversas. |
| MVP-06 | Historico de execucoes | Parcial | `AgentRun`, `AgentLog`, `runs/history` | Webhook chama agent direto sem criar `AgentRun`; logs podem expor input bruto/PII. |
| MVP-07 | Dashboard basico | Parcial | `src/app/(dashboard)/page.tsx`, charts | Dashboard existe, mas idioma misto e activity feed limitado a lead events. |
| MVP-08 | Banco SQLite | Implementado | `prisma/schema.prisma`, `prisma/dev.db` | Sem migrations; JSON serializado como string. |
| MVP-09 | Integracao inicial com API de LLM | Parcial | `src/lib/ai/providers/openai.ts` | Abstracao existe; agentes principais nao usam o provider; sem testes/mocks. |
| MVP-10 | Estrutura preparada para MCP | Parcial | `src/lib/mcp/types.ts`, `registry.ts` | Registry existe; sem tools reais, client MCP ou execucao via agentes. |

## Agentes Principais

| Agente | Status | Evidencia | Observacoes |
|---|---|---|---|
| Lead Intake Agent | Parcial | `src/lib/agents/lead-intake.ts` | Valida, deduplica por email/phone e cria evento. Deduplicacao por `externalId` compara `metadata` exato e falha se houver metadados extras/ordem diferente. Webhook nao registra `AgentRun`. |
| Qualification Agent | Parcial | `src/lib/agents/qualification.ts` | Calcula score e status com explicacao. Nao usa criterios comerciais configuraveis, historico de mensagens ou decisao de handoff. |
| Scheduling Agent | Nao implementado | Apenas docs/schema `ScheduledTask` | Sem calendario, disponibilidade, confirmacao ou eventos de reuniao. |
| Follow-up Agent | Nao implementado | Apenas docs/status/scheduled tasks | Sem limites de tentativa, horarios, mensagens ou jobs. |
| Knowledge Agent | Nao implementado | `Document`, `DocumentChunk` existem | Sem upload, chunking real, embeddings, RAG ou permissoes. |
| Document Agent | Nao implementado | `Document` existe | Sem templates, PDF, aprovacao humana ou versao de template. |
| CRM Sync Agent | Nao implementado | `Integration` existe | Sem politica de merge, idempotencia, retries ou conectores. |
| Human Handoff Agent | Nao implementado | Apenas docs | Sem deteccao de sentimento/intencao, filas ou resumo para humano. |
| Monitoring Agent | Nao implementado | Logs basicos existem | Sem SLA, alerta, relatorios ou mascaramento de PII. |

## Requisitos Funcionais do PRD

| ID | Requisito | Status | Evidencia/Lacuna |
|---|---|---|---|
| RF-001 | Receber eventos via webhook | Parcial | `POST /api/webhooks/leads` existe com HMAC; nao persiste run/log de agente e assinatura sem secret sempre rejeita. |
| RF-002 | Integrar com WhatsApp | Nao implementado | Nenhum conector/canal. |
| RF-003 | Integrar com Google Calendar | Nao implementado | Nenhum conector/calendario. |
| RF-004 | Integrar com Google Drive | Nao implementado | Nenhum conector/Drive. |
| RF-005 | Gerar documentos PDF | Nao implementado | Sem geracao PDF. |
| RF-006 | Consultar banco vetorial | Nao implementado | Sem embeddings/vetores. |
| RF-007 | Executar workflows multiagente | Nao implementado | Tabelas existem; engine nao. |
| RF-008 | Executar follow-up automatico | Nao implementado | Sem jobs/mensageria. |
| RF-009 | Realizar enriquecimento de leads | Nao implementado | Sem LinkedIn/site/research. |
| RF-010 | Atualizar CRM automaticamente | Nao implementado | Sem CRM sync. |

## Requisitos Nao Funcionais do PRD

| ID | Requisito | Status | Comentario |
|---|---|---|---|
| RNF-001 | Tempo de resposta < 5s | Nao verificavel | Sem testes de performance/SLA. |
| RNF-002 | Disponibilidade 99,5% | Nao verificavel | Sem deploy/observabilidade. |
| RNF-003 | Logs auditaveis de todas as acoes | Parcial | Agent runs/logs existem, mas nem todas as acoes geram logs; webhook direto nao cria run. |
| RNF-004 | Multiplos agentes simultaneos | Parcial | Registry e runs suportam varios agentes, mas so ha dois agentes reais e sem jobs/concorrencia. |
| RNF-005 | Arquitetura compativel com MCP | Parcial | Interfaces existem, execucao real nao. |
| RNF-006 | Suporte a diversos LLMs | Parcial | Tipos/provider base existem, mas so OpenAI tem provider concreto e sem uso central. |

## Workflows Oficiais

| Workflow | Status | Observacao |
|---|---|---|
| WF01 Captura de Lead | Parcial | Webhook + lead intake parcial. |
| WF02 Qualificacao de Lead | Parcial/Divergente | Agent existe, mas UI de execucao nao passa `leadId`. |
| WF03 Enriquecimento | Nao implementado | Sem research. |
| WF04 Inteligencia Comercial | Nao implementado | Sem coleta/resumo de posts. |
| WF05 Agendamento | Nao implementado | Sem calendario. |
| WF06 Lembrete | Nao implementado | Sem jobs/canais. |
| WF07 Pos-Reuniao | Nao implementado | Sem reunioes/CRM. |
| WF08 Follow-up | Nao implementado | Sem follow-up agent. |
| WF09 Proposta | Nao implementado | Sem document agent. |
| WF10 Contrato | Nao implementado | Sem aprovacao/PDF. |
| WF11 Base de Conhecimento | Nao implementado | Sem upload/chunking/embeddings. |
| WF12 Consulta RAG | Nao implementado | Sem RAG. |
| WF13 Escalacao Humana | Nao implementado | Sem handoff. |
| WF14 Treinamento Continuo | Nao implementado | Sem avaliacao de qualidade/prompts. |
| WF15 Monitoramento | Nao implementado | Sem SLA/alertas. |
| WF16 Orquestracao Multiagente | Nao implementado | Sem orchestrator. |
| WF17 MCP Tool Execution | Nao implementado | Sem tools reais. |

## Regras Transversais

| Regra | Status | Achado |
|---|---|---|
| Toda acao de agente deve ser persistida | Parcial | `executeAgent` persiste, webhook direto nao cria run. |
| Decisoes criticas com justificativa | Parcial | Qualificacao justifica; demais acoes nao. |
| Nao executar acao externa sensivel sem permissao | Implementado por ausencia | Quase nao ha acoes externas. |
| Workflow pausavel/retomavel/cancelavel | Nao implementado | Sem engine. |
| Integracoes com erro/retry | Nao implementado | Sem integracoes reais. |
| Revisao humana antes de acoes criticas | Nao implementado | Sem handoff/aprovacoes. |
| Prompts versionados | Parcial | `AgentVersion` existe; agentes hardcoded tem logica/prompt implicito no codigo. |
| Prompts nao hardcoded em React | Implementado | Prompts nao estao em componentes React. |
| Mascarar dados sensiveis em logs | Nao implementado | Logs gravam input/output/metadata brutos. |
| Testes com mocks | Nao implementado | Nenhum teste real localizado em `src`. |
