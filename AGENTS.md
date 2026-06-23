# agents.md

## Projeto

**Orun.AI Workforce Platform**

Plataforma para criação, configuração e execução de agentes de IA especializados, com foco inicial em automação comercial, qualificação de leads, agendamento, follow-up, geração documental e consulta a bases de conhecimento.

---

## Stack

* **Framework:** Next.js
* **Linguagem:** TypeScript
* **Banco de dados:** SQLite
* **ORM recomendado:** Prisma
* **UI:** React + Tailwind CSS
* **Execução dos agentes:** Server Actions / API Routes / background jobs
* **IA:** APIs externas de LLM
* **Protocolo de integração:** MCP — Model Context Protocol

---

## Objetivo dos Agentes

Os agentes devem executar tarefas específicas de negócio de forma coordenada, mantendo rastreabilidade, contexto e segurança.

Cada agente deve ter:

* Responsabilidade clara
* Entrada e saída bem definidas
* Prompt versionado
* Logs de execução
* Limites de ação
* Possibilidade de intervenção humana
* Registro de decisões relevantes

---

## Agentes Principais

## 1. Lead Intake Agent

### Responsabilidade

Receber novos leads vindos de formulários, webhooks, CRM ou canais externos.

### Entradas

* Nome
* Email
* Telefone
* Empresa
* Origem do lead
* Mensagem inicial
* Metadados do canal

### Saídas

* Lead criado no SQLite
* Evento registrado
* Próxima ação definida

### Regras

* Validar dados mínimos antes de criar o lead
* Evitar duplicidade por email, telefone ou identificador externo
* Não descartar dados brutos recebidos via webhook

---

## 2. Qualification Agent

### Responsabilidade

Qualificar o lead com base em perguntas, histórico e critérios comerciais.

### Entradas

* Dados do lead
* Histórico de mensagens
* Critérios de qualificação
* Segmento de atuação

### Saídas

* Score de qualificação
* Status do lead
* Motivo da classificação
* Próxima ação sugerida

### Regras

* Sempre explicar o motivo do score
* Nunca marcar como qualificado sem critérios mínimos
* Encaminhar para humano em caso de dúvida relevante

---

## 3. Scheduling Agent

### Responsabilidade

Agendar reuniões entre lead e equipe comercial.

### Entradas

* Lead qualificado
* Preferência de horário
* Disponibilidade da equipe
* Fuso horário

### Saídas

* Reunião criada
* Confirmação enviada
* Evento salvo no banco

### Regras

* Confirmar horário antes de criar o evento
* Evitar conflito de agenda
* Registrar tentativa, sucesso ou falha

---

## 4. Follow-up Agent

### Responsabilidade

Executar lembretes, cobranças educadas e reativações de leads parados.

### Entradas

* Status do lead
* Última interação
* Próxima ação pendente
* Canal preferencial

### Saídas

* Mensagem enviada
* Status atualizado
* Novo follow-up agendado, se necessário

### Regras

* Respeitar limite de tentativas
* Não enviar mensagens em horários inadequados
* Encerrar automação após rejeição explícita

---

## 5. Knowledge Agent

### Responsabilidade

Responder perguntas usando documentos internos, base vetorial ou registros estruturados.

### Entradas

* Pergunta do usuário
* Documentos indexados
* Contexto da conversa
* Permissões do usuário

### Saídas

* Resposta fundamentada
* Fontes utilizadas
* Grau de confiança

### Regras

* Não inventar respostas
* Informar quando não houver base suficiente
* Não expor dados sensíveis
* Registrar documentos consultados

---

## 6. Document Agent

### Responsabilidade

Gerar propostas, minutas e documentos comerciais.

### Entradas

* Dados do lead
* Template do documento
* Condições comerciais
* Variáveis obrigatórias

### Saídas

* Documento gerado
* PDF salvo
* Link do arquivo
* Histórico atualizado

### Regras

* Validar campos obrigatórios
* Não gerar contrato sem aprovação humana, quando aplicável
* Registrar versão do template utilizado

---

## 7. CRM Sync Agent

### Responsabilidade

Sincronizar dados dos leads e oportunidades com sistemas externos.

### Entradas

* Lead
* Oportunidade
* Status
* Histórico de interações

### Saídas

* CRM atualizado
* Log de sincronização
* Erros registrados

### Regras

* Não sobrescrever dados externos sem política clara
* Manter idempotência nas integrações
* Reprocessar falhas quando seguro

---

## 8. Human Handoff Agent

### Responsabilidade

Identificar quando a automação deve ser interrompida e transferida para uma pessoa.

### Entradas

* Conversa atual
* Sentimento do usuário
* Falhas anteriores
* Intenção detectada

### Saídas

* Atendimento escalado
* Motivo da escalação
* Resumo para o humano

### Regras

* Escalar em caso de frustração
* Escalar em caso de dúvida jurídica, financeira ou contratual sensível
* Escalar quando o agente não tiver confiança suficiente

---

## 9. Monitoring Agent

### Responsabilidade

Monitorar execuções, falhas, tempos de resposta e qualidade dos agentes.

### Entradas

* Logs de agentes
* Eventos de workflow
* Erros de integração
* Métricas de tempo

### Saídas

* Alertas
* Relatórios
* Recomendações de melhoria

### Regras

* Registrar falhas críticas
* Alertar quando SLA for violado
* Não registrar PII desnecessária em logs

---

## Autoload

Os seguintes arquivos devem ser carregados em toda sessão do assistente:
* `CLAUDE.md` — regras de código, commits, versioning
* `AGENTS.md` — este arquivo, especificação do projeto
* `README.md` — visão geral e convenções

---

## Regras para IA

* Sempre atualizar os documentos de implantação docs/features/{{NAME}}.md
* Sempre implementar testes para validar o caso de uso da funcionalidade
  * Nos testes, sempre realizar mock das entidades, promisses, conexões externas, etc.
* Sempre atualizar o readme.
* Toda tarefa deve ser versionada usando Semantic Versioning 2.0.0, https://semver.org/
* Commits devem ser feitos usando Conventional Commits, https://www.conventionalcommits.org/en/v1.0.0/

---

## Checklist de Conclusão de Tarefa

Ao finalizar qualquer tarefa, o assistente DEVE:

1. Rodar testes (`npm test`)
2. Rodar build (`npm run build`)
3. Rodar lint (`npm run lint`)
4. Rodar typecheck (`npm run typecheck`)
5. Validar carregamento da página inicial (quando aplicável)
6. Atualizar versão no `package.json` (semver)
7. Documentar aprendizados em `.mimocode/learning.md`
8. Salvar sessão em `.mimocode/session/{{SESSION_ID}}.md`
9. Criar commit com Conventional Commits


---

## Modelo de Dados Inicial

### Tabelas recomendadas

* `agents`
* `agent_versions`
* `agent_runs`
* `agent_logs`
* `leads`
* `lead_events`
* `conversations`
* `messages`
* `workflows`
* `workflow_runs`
* `documents`
* `document_chunks`
* `integrations`
* `scheduled_tasks`

---

## Boas Práticas

## Segurança

* Nunca salvar chaves de API no banco
* Usar variáveis de ambiente para segredos
* Mascarar dados sensíveis em logs
* Aplicar controle de acesso por usuário e organização

## Observabilidade

Cada execução de agente deve registrar:

* Agent ID
* Versão do prompt
* Entrada resumida
* Saída resumida
* Tempo de execução
* Modelo utilizado
* Tokens consumidos
* Status
* Erro, se houver

## Prompt Engineering

Prompts devem ser:

* Versionados
* Testáveis
* Separados por agente
* Revisáveis por humano
* Nunca hardcoded diretamente em componentes React

## Banco de Dados

SQLite deve ser usado no MVP pela simplicidade operacional.

Cuidados:

* Usar migrations
* Evitar acoplamento excessivo ao SQLite
* Projetar schema com possibilidade futura de migração para PostgreSQL
* Usar Prisma para abstração

---

## Estrutura Recomendada de Pastas

```txt
/src
  /app
    /api
      /agents
      /webhooks
      /workflows
    /dashboard
    /leads
    /settings

  /components
    /agents
    /leads
    /workflows
    /ui

  /lib
    /ai
    /agents
    /db
    /mcp
    /workflows
    /integrations
    /observability

  /server
    /agents
    /jobs
    /services

/prisma
  schema.prisma
  migrations

/docs
  agents.md
  prd.md
  orchestrator.md
```

---

## Regras de Implementação

* Toda ação de agente deve ser persistida
* Toda decisão crítica deve ter justificativa
* Nenhum agente deve executar ação externa sensível sem permissão explícita
* Todo workflow deve permitir pausa, retomada e cancelamento
* Integrações externas devem ter tratamento de erro e retry
* O sistema deve permitir revisão humana antes de ações críticas

---

## MVP

O MVP deve conter:

1. Cadastro de agentes
2. Cadastro de leads
3. Execução manual de agente
4. Qualificação simples de lead
5. Registro de conversas
6. Histórico de execuções
7. Dashboard básico
8. Banco SQLite
9. Integração inicial com uma API de LLM
10. Estrutura preparada para MCP

---

## Fora do Escopo Inicial

* Marketplace de agentes
* Treinamento próprio de modelo
* Multi-tenant avançado
* Billing
* Integração nativa com múltiplos CRMs
* Agentes totalmente autônomos sem revisão humana
* Migração para banco vetorial dedicado

---

## Critérios de Sucesso

* Criar e executar agentes via interface
* Registrar histórico completo das execuções
* Qualificar leads automaticamente
* Permitir intervenção humana
* Manter dados persistidos em SQLite
* Ter arquitetura preparada para evolução com MCP
* Reduzir esforço manual de pré-vendas

---

## Princípio Norteador

O sistema deve priorizar agentes confiáveis, auditáveis e especializados, em vez de agentes genéricos com autonomia excessiva.
