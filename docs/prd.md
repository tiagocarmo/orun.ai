# PRD — Plataforma de Automação Comercial com Agentes de IA

## Origem do Produto

Este PRD deriva do chat original que originou o produto e foi consolidado nesta documentação base.

A conversa começou com a busca por um nome para um software de inteligência artificial inspirado em sabedoria, visão além do óbvio, caminhos e leitura de contexto. A escolha **Orun.AI** veio da associação simbólica com Orun/Orunmilá/Ifá, em tom respeitoso e metafórico: uma inteligência capaz de analisar sinais, conectar passado e presente e orientar decisões futuras sem prometer adivinhação ou substituir julgamento humano.

Em seguida, a investigação evoluiu para três frentes:

* cenário recente de agentes de IA, MCP e implementações em JavaScript/TypeScript;
* análise de workflows comerciais envolvendo leads, WhatsApp, Google Drive, documentos, CRM, LinkedIn e base vetorial;
* transformação da ideia inicial em uma plataforma de **AI Workforce**, com agentes especializados, workflow builder, MCP server builder, knowledge builder, orquestração multiagente e observabilidade.

Portanto, este documento consolida uma tese: **Orun.AI deve começar resolvendo automação comercial, mas ser desenhado como plataforma extensível de workforce digital auditável**.

---

## Visão Geral

Criar uma plataforma de automação comercial baseada em agentes de IA capaz de conduzir todo o ciclo de pré-vendas, qualificação, agendamento, preparação documental, gestão de conhecimento e acompanhamento de reuniões.

A solução deverá atuar como uma força de trabalho digital composta por múltiplos agentes especializados, operando de forma coordenada através de workflows automatizados.

## Posicionamento

Orun.AI não deve ser apenas um chatbot, nem uma automação linear de WhatsApp. O produto deve se posicionar como uma plataforma de operações assistidas por agentes:

* agentes executam responsabilidades específicas;
* workflows conectam etapas, integrações e aprovações humanas;
* o Orchestrator planeja, delega e consolida resultados;
* MCP fornece a camada de integração com ferramentas externas;
* observabilidade permite auditar custo, qualidade, falhas e decisões.

## Hipóteses de Produto

* Empresas brasileiras têm demanda crescente por IA aplicada a processos comerciais, mas precisam de controle, rastreabilidade e segurança.
* O ecossistema JavaScript/TypeScript já é suficiente para um MVP produtivo usando APIs externas de LLM e servidores MCP.
* O diferencial não é autonomia irrestrita, mas confiabilidade: agentes especializados, revisáveis e com intervenção humana em pontos sensíveis.
* A jornada comercial é o primeiro domínio porque concentra tarefas repetitivas, alto volume de contexto e impacto mensurável em produtividade.

---

# Problema

Atualmente equipes comerciais gastam grande parte do tempo em atividades operacionais:

* Qualificação de leads
* Busca de informações
* Agendamento de reuniões
* Follow-up
* Preparação de contratos
* Organização documental
* Atualização de CRM
* Resgate de histórico de conversas

Essas atividades reduzem o tempo disponível para vendas consultivas e relacionamento.

---

# Objetivo

Automatizar o processo comercial desde a geração do lead até o envio da minuta contratual.

A plataforma deve funcionar como um colaborador virtual capaz de:

* Conversar com leads
* Qualificar oportunidades
* Agendar reuniões
* Preparar documentos
* Consultar base de conhecimento
* Atualizar sistemas
* Executar follow-ups
* Alertar equipes humanas

## Não Objetivos

* Prometer predição infalível, clarividência literal ou substituição do julgamento humano.
* Construir agentes totalmente autônomos sem revisão.
* Começar com marketplace, billing ou multi-tenant avançado.
* Depender de Python para o núcleo do MVP.
* Salvar segredos de integrações no banco de dados.

---

# Personas

## SDR

Necessita:

* Receber leads qualificados
* Evitar trabalho manual
* Ter histórico consolidado

## Executivo Comercial

Necessita:

* Reuniões previamente preparadas
* Dados enriquecidos dos clientes
* Contratos gerados rapidamente

## Gestor Comercial

Necessita:

* Visibilidade do funil
* Indicadores de conversão
* Escalabilidade operacional

## Cliente

Necessita:

* Respostas rápidas
* Agendamento simples
* Documentação sem burocracia

---

# Arquitetura Conceitual

## Agente de Qualificação

Responsável por:

* Receber contatos
* Fazer perguntas qualificatórias
* Identificar perfil do cliente
* Determinar elegibilidade

---

## Agente de Agendamento

Responsável por:

* Consultar agenda
* Encontrar horários livres
* Criar eventos
* Confirmar participação

Integrações:

* Google Calendar
* Outlook Calendar

---

## Agente de Follow-up

Responsável por:

* Cobrar retorno
* Relembrar compromissos
* Recuperar oportunidades paradas

Canais:

* WhatsApp
* Email
* SMS

---

## Agente Documental

Responsável por:

* Gerar contratos
* Gerar propostas
* Preencher templates
* Enviar PDFs

Integrações:

* Google Docs
* PDF Generator
* Assinatura eletrônica

---

## Agente de Conhecimento

Responsável por:

* Consultar documentação
* Buscar políticas
* Responder dúvidas
* Utilizar banco vetorial

Integrações:

* Google Drive
* Notion
* Banco Vetorial

---

## Agente de Monitoramento

Responsável por:

* Alertar equipe humana
* Detectar falhas
* Monitorar SLAs
* Escalar atendimentos

---

# Fluxos Funcionais

## Fluxo 01 — Entrada do Lead

### Passos

1. Receber webhook
2. Validar origem
3. Criar sessão
4. Registrar lead
5. Iniciar conversa

### Resultado

Lead cadastrado e sessão ativa.

---

## Fluxo 02 — Qualificação

### Passos

1. Perguntar perfil
2. Perguntar necessidade
3. Identificar porte
4. Calcular score
5. Classificar lead

### Resultado

Lead qualificado.

---

## Fluxo 03 — Agendamento

### Passos

1. Consultar agenda
2. Encontrar disponibilidade
3. Apresentar opções
4. Confirmar horário
5. Criar evento

### Resultado

Reunião agendada.

---

## Fluxo 04 — Lembrete de Reunião

### Passos

1. Verificar agenda
2. Detectar reunião próxima
3. Enviar aviso
4. Solicitar confirmação

### Resultado

Redução de no-show.

---

## Fluxo 05 — Reunião Realizada

### Passos

1. Registrar status
2. Solicitar observações
3. Atualizar CRM
4. Definir próxima ação

### Resultado

Funil atualizado.

---

## Fluxo 06 — Geração de Contrato

### Passos

1. Receber aprovação
2. Buscar template
3. Preencher variáveis
4. Gerar PDF
5. Enviar documento

### Resultado

Contrato enviado.

---

## Fluxo 07 — Gestão de Conhecimento

### Passos

1. Upload documento
2. Extrair texto
3. Vetorizar conteúdo
4. Armazenar embeddings
5. Disponibilizar para IA

### Resultado

Nova informação acessível aos agentes.

---

## Fluxo 08 — Treinamento Contínuo

### Passos

1. Capturar conversas
2. Avaliar qualidade
3. Identificar falhas
4. Atualizar prompts
5. Melhorar agentes

### Resultado

Evolução contínua do sistema.

---

# Fluxos de Prospecção (Imagem 2)

## Enriquecimento de Leads

### Passos

1. Receber lead
2. Consultar LinkedIn
3. Extrair perfil
4. Extrair empresa
5. Atualizar CRM

---

## Enriquecimento por Conteúdo

### Passos

1. Capturar posts do LinkedIn
2. Resumir conteúdo
3. Identificar interesses
4. Detectar dores
5. Atualizar perfil comercial

---

## Monitoramento de Mudanças

### Passos

1. Verificar perfil periodicamente
2. Detectar alteração
3. Atualizar CRM
4. Notificar vendedor

---

# Requisitos Funcionais

## RF-001

Receber eventos via webhook.

## RF-002

Integrar com WhatsApp.

## RF-003

Integrar com Google Calendar.

## RF-004

Integrar com Google Drive.

## RF-005

Gerar documentos PDF.

## RF-006

Consultar banco vetorial.

## RF-007

Executar workflows multiagente.

## RF-008

Executar follow-up automático.

## RF-009

Realizar enriquecimento de leads.

## RF-010

Atualizar CRM automaticamente.

---

# Requisitos Não Funcionais

## RNF-001

Tempo de resposta inferior a 5 segundos.

## RNF-002

Disponibilidade mínima de 99,5%.

## RNF-003

Logs auditáveis de todas as ações.

## RNF-004

Suporte a múltiplos agentes simultâneos.

## RNF-005

Arquitetura compatível com MCP.

## RNF-006

Suporte a LLMs diversos:

* OpenAI
* Anthropic
* Gemini
* DeepSeek
* Grok

---

# Roadmap Evolutivo

## Fase 1 — Assistente Comercial

* WhatsApp
* Agendamento
* Follow-up
* CRM

## Fase 2 — SDR Autônomo

* Qualificação
* Enriquecimento
* Score de leads

## Fase 3 — Executivo Virtual

* Propostas
* Contratos
* Negociação assistida

## Fase 4 — Workforce de IA

* Múltiplos agentes
* MCP
* Orquestração distribuída
* Memória compartilhada
* Autoaprendizado supervisionado

---

# Visão de Produto

O produto deve evoluir para uma plataforma de Workforce AI, onde cada agente representa um papel comercial específico (SDR, Closer, Customer Success, Assistente Jurídico e Analista de Dados), colaborando através de MCP e workflows orquestrados para executar o ciclo comercial completo com mínima intervenção humana.
