# workflows.md

## Visão Geral

Este documento descreve os workflows oficiais da plataforma **Orun.AI Workforce Platform**.

Um workflow representa uma sequência de etapas executadas por agentes, usuários, integrações externas ou sistemas automatizados.

## Origem dos Workflows

Os workflows foram extraídos e consolidados a partir do chat original do projeto, especialmente dos fluxos discutidos para:

* captura e enriquecimento de leads;
* scraping/resumo de LinkedIn;
* agendamento e lembretes;
* follow-up via WhatsApp;
* geração e envio de minuta/proposta em PDF;
* armazenamento em Google Drive;
* alimentação de base de conhecimento;
* atualização de CRM;
* melhoria contínua de prompts e agentes.

Esses fluxos não devem ser entendidos como automações isoladas. Eles formam uma jornada comercial completa e auditável, coordenada por agentes especializados e pelo Orchestrator.

Cada workflow deve possuir:

* Identificador único
* Estado atual
* Histórico de execução
* Logs auditáveis
* Capacidade de pausa
* Capacidade de retomada
* Possibilidade de intervenção humana

## Contrato Padrão de Workflow

Todo workflow oficial deve explicitar:

* **Trigger:** evento que inicia o fluxo.
* **Entradas:** dados mínimos necessários.
* **Agentes envolvidos:** responsabilidades delegadas.
* **Integrações:** ferramentas externas e permissões.
* **Estados:** pending, running, waiting_human, paused, completed, failed, cancelled.
* **Logs:** passos executados, erros, retries, decisões e aprovações.
* **Saídas:** resultado persistido e próxima ação.
* **Pontos de revisão humana:** quando aplicável.

## Princípios

* Workflows devem ser retomáveis, pausáveis e canceláveis.
* Ações externas sensíveis exigem aprovação humana.
* Falhas devem registrar causa, tentativa e possibilidade de retry seguro.
* Dados pessoais devem ser mascarados quando registrados em logs.
* MCP deve ser a camada preferencial para ferramentas externas.

---

# Workflow 01 — Captura de Lead

## Objetivo

Receber um novo lead e iniciar sua jornada dentro da plataforma.

## Trigger

* Webhook
* Formulário
* API
* Importação CSV
* Integração CRM

## Fluxo

```txt
Receber Lead
    ↓
Validar Dados
    ↓
Detectar Duplicidade
    ↓
Criar Registro
    ↓
Registrar Evento
    ↓
Disparar Qualificação
```

## Agentes Envolvidos

* Lead Intake Agent
* Qualification Agent

## Resultado

Lead disponível para qualificação.

---

# Workflow 02 — Qualificação de Lead

## Objetivo

Determinar o potencial comercial do lead.

## Trigger

* Lead criado
* Requalificação manual

## Fluxo

```txt
Receber Lead
    ↓
Analisar Dados
    ↓
Executar Perguntas
    ↓
Calcular Score
    ↓
Classificar Lead
    ↓
Atualizar CRM
```

## Possíveis Saídas

### Qualificado

Encaminhar para agendamento.

### Em Nutrição

Agendar novo contato.

### Desqualificado

Encerrar fluxo.

## Agentes Envolvidos

* Qualification Agent

---

# Workflow 03 — Enriquecimento de Lead

## Objetivo

Buscar informações adicionais para aumentar a qualidade do cadastro.

## Trigger

Lead qualificado.

## Fluxo

```txt
Receber Lead
    ↓
Buscar LinkedIn
    ↓
Extrair Perfil
    ↓
Extrair Empresa
    ↓
Buscar Website
    ↓
Gerar Resumo
    ↓
Atualizar Lead
```

## Dados Obtidos

* Cargo
* Empresa
* Setor
* Localização
* Descrição profissional
* Site corporativo

## Agentes Envolvidos

* Research Agent
* CRM Sync Agent

---

# Workflow 04 — Inteligência Comercial

## Objetivo

Descobrir interesses e sinais de compra.

## Trigger

Lead enriquecido.

## Fluxo

```txt
Consultar LinkedIn
    ↓
Coletar Posts
    ↓
Resumir Conteúdo
    ↓
Detectar Temas
    ↓
Identificar Dores
    ↓
Gerar Insights
```

## Saídas

* Interesses
* Prioridades
* Possíveis dores
* Argumentos de venda

## Agentes Envolvidos

* Research Agent
* Knowledge Agent

---

# Workflow 05 — Agendamento de Reunião

## Objetivo

Marcar reunião comercial.

## Trigger

Lead qualificado.

## Fluxo

```txt
Consultar Agenda
    ↓
Identificar Horários
    ↓
Apresentar Opções
    ↓
Receber Escolha
    ↓
Criar Evento
    ↓
Enviar Convite
```

## Integrações

* Google Calendar
* Outlook Calendar

## Agentes Envolvidos

* Scheduling Agent

---

# Workflow 06 — Lembrete de Reunião

## Objetivo

Reduzir faltas.

## Trigger

24h antes da reunião.

## Fluxo

```txt
Verificar Agenda
    ↓
Encontrar Reuniões
    ↓
Enviar Aviso
    ↓
Solicitar Confirmação
    ↓
Atualizar Status
```

## Canais

* WhatsApp
* Email

## Agentes Envolvidos

* Follow-up Agent

---

# Workflow 07 — Pós-Reunião

## Objetivo

Atualizar informações após reunião.

## Trigger

Reunião encerrada.

## Fluxo

```txt
Receber Feedback
    ↓
Registrar Resumo
    ↓
Atualizar CRM
    ↓
Definir Próxima Ação
    ↓
Agendar Follow-up
```

## Agentes Envolvidos

* Follow-up Agent
* CRM Sync Agent

---

# Workflow 08 — Follow-up Comercial

## Objetivo

Manter o lead ativo.

## Trigger

Prazo configurado.

## Fluxo

```txt
Verificar Pendências
    ↓
Gerar Mensagem
    ↓
Enviar Follow-up
    ↓
Aguardar Resposta
    ↓
Atualizar Status
```

## Regras

* Limite de tentativas
* Respeitar horário comercial
* Encerrar em caso de negativa

## Agentes Envolvidos

* Follow-up Agent

---

# Workflow 09 — Geração de Proposta

## Objetivo

Produzir proposta comercial.

## Trigger

Solicitação do vendedor.

## Fluxo

```txt
Selecionar Template
    ↓
Preencher Variáveis
    ↓
Gerar Documento
    ↓
Converter PDF
    ↓
Armazenar Arquivo
    ↓
Enviar Proposta
```

## Agentes Envolvidos

* Document Agent

---

# Workflow 10 — Geração de Contrato

## Objetivo

Gerar minuta contratual.

## Trigger

Negócio aprovado.

## Fluxo

```txt
Receber Aprovação
    ↓
Selecionar Contrato
    ↓
Preencher Dados
    ↓
Validar Campos
    ↓
Gerar PDF
    ↓
Enviar Documento
```

## Agentes Envolvidos

* Document Agent

---

# Workflow 11 — Base de Conhecimento

## Objetivo

Transformar documentos em conhecimento consultável.

## Trigger

Upload de arquivo.

## Fluxo

```txt
Receber Arquivo
    ↓
Extrair Conteúdo
    ↓
Dividir em Chunks
    ↓
Gerar Embeddings
    ↓
Persistir Vetores
    ↓
Disponibilizar Consulta
```

## Fontes

* PDF
* DOCX
* TXT
* Notion
* Google Drive

## Agentes Envolvidos

* Knowledge Agent

---

# Workflow 12 — Consulta RAG

## Objetivo

Responder perguntas utilizando documentos internos.

## Trigger

Pergunta do usuário.

## Fluxo

```txt
Receber Pergunta
    ↓
Buscar Contexto
    ↓
Consultar Vetores
    ↓
Montar Prompt
    ↓
Executar LLM
    ↓
Retornar Resposta
```

## Agentes Envolvidos

* Knowledge Agent

---

# Workflow 13 — Escalação Humana

## Objetivo

Transferir atendimento para uma pessoa.

## Trigger

Baixa confiança ou solicitação explícita.

## Fluxo

```txt
Detectar Problema
    ↓
Gerar Resumo
    ↓
Selecionar Responsável
    ↓
Transferir Caso
    ↓
Notificar Equipe
```

## Agentes Envolvidos

* Human Handoff Agent

---

# Workflow 14 — Treinamento Contínuo

## Objetivo

Melhorar agentes e prompts.

## Trigger

Execuções concluídas.

## Fluxo

```txt
Coletar Conversas
    ↓
Analisar Resultado
    ↓
Detectar Falhas
    ↓
Gerar Insights
    ↓
Sugerir Melhorias
```

## Agentes Envolvidos

* Monitoring Agent

---

# Workflow 15 — Monitoramento da Plataforma

## Objetivo

Garantir estabilidade operacional.

## Trigger

Execução contínua.

## Fluxo

```txt
Capturar Eventos
    ↓
Analisar Logs
    ↓
Detectar Falhas
    ↓
Gerar Alertas
    ↓
Notificar Responsáveis
```

## Métricas

* Tempo de execução
* Tokens consumidos
* Erros
* Latência
* Conversão de leads
* Reuniões agendadas
* Contratos enviados

## Agentes Envolvidos

* Monitoring Agent

---

# Workflow 16 — Orquestração Multi-Agente

## Objetivo

Permitir que múltiplos agentes trabalhem em conjunto.

## Fluxo

```txt
Receber Objetivo
    ↓
Planejar Tarefas
    ↓
Selecionar Agentes
    ↓
Executar Subtarefas
    ↓
Consolidar Resultados
    ↓
Gerar Resposta Final
```

## Exemplo

Objetivo:

"Preparar reunião comercial com João Silva."

Execução:

1. Research Agent coleta informações.
2. Knowledge Agent busca histórico.
3. Qualification Agent avalia perfil.
4. Scheduling Agent verifica agenda.
5. Orchestrator Agent consolida resultado.

## Agente Responsável

* Orchestrator Agent

---

# Workflow 17 — MCP Tool Execution

## Objetivo

Permitir que agentes utilizem ferramentas externas via MCP.

## Fluxo

```txt
Receber Solicitação
    ↓
Identificar Ferramenta
    ↓
Executar MCP Tool
    ↓
Validar Resultado
    ↓
Registrar Log
    ↓
Retornar Resposta
```

## MCPs previstos

* Google Drive
* Notion
* Slack
* GitHub
* CRM
* Email
* Calendário
* Banco de Dados

---

# Workflow Master

## Jornada Comercial Completa

```txt
Lead
 ↓
Qualificação
 ↓
Enriquecimento
 ↓
Inteligência Comercial
 ↓
Agendamento
 ↓
Reunião
 ↓
Follow-up
 ↓
Proposta
 ↓
Contrato
 ↓
Cliente
```

Este fluxo representa o caminho principal do MVP da plataforma.
