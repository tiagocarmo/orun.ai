# agents.md

## Projeto

**Orun.AI Workforce Platform**

Plataforma para criação, configuração e execução de agentes de IA especializados, com foco inicial em automação comercial, qualificação de leads, agendamento, follow-up, geração documental e consulta a bases de conhecimento.

---

## Origem e Embasamento

Este documento deriva do chat original consolidado nos documentos base, que registrou a evolução do projeto:

1. escolha do nome Orun.AI a partir de uma associação simbólica com sabedoria, visão e caminhos;
2. definição de identidade institucional baseada em "Visão além do tempo. Inteligência além do óbvio.";
3. investigação de agentes de IA, MCP e frameworks JavaScript/TypeScript;
4. análise de fluxos comerciais com leads, WhatsApp, Google Drive, LinkedIn, CRM, documentos e base vetorial;
5. transformação da ideia em uma **AI Workforce Platform**.

Os agentes abaixo devem preservar essa coerência: não são bots genéricos, mas funções digitais especializadas, auditáveis e coordenadas por workflows.

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

> Nota: no contexto do projeto, MCP significa prioritariamente **Model Context Protocol**. "Multi-component planning" aparece como capacidade desejada dos agentes e do Orchestrator, mas não substitui o protocolo MCP.

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

## Princípios de Agentes

* Agentes devem ser especialistas, não generalistas autônomos sem limites.
* Todo agente deve declarar contrato de entrada, contrato de saída e limites de ação.
* Decisões de alto impacto devem ser justificadas.
* O Orchestrator coordena; agentes executam responsabilidades de domínio.
* Ações externas sensíveis exigem aprovação humana.
* Prompts e critérios devem ser versionados e testáveis.

## Contrato de Invocação de Agentes (Actor Tool)

> **Antes de qualquer chamada de tool: CARREGAR a skill `agent-delegation`.**
> Ler `.agents/skills/agent-delegation/SKILL.md` antes de usar `actor`, `task` ou `workflow`.

Toda chamada para agente via actor tool deve seguir o schema exato abaixo.

### Regra de Ouro

**`operation` é SEMPRE um objeto `{}` com campo `action`. Nunca string. Nunca chaves soltas na raiz.**

Errado:
```
task({ operation: "create", summary: "..." })         // ❌ operation é string
actor({ operation: "run", timeout_ms: 5000 })         // ❌ timeout_ms na raiz
```

Correto:
```
task({ operation: { action: "create", summary: "..." } })     // ✅
actor({ operation: { action: "run", timeout_ms: 5000 } })     // ✅ timeout_ms dentro
```

### Schema correto — `operation` é sempre um **objeto**

```json
{
  "operation": {
    "action": "run",
    "subagent_type": "explore",
    "description": "curta descrição 3-5 palavras",
    "prompt": "instruções completas para o subagente"
  }
}
```

### Campos obrigatórios dentro de `operation`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `action` | `"run"` \| `"spawn"` \| `"status"` \| `"wait"` \| `"cancel"` \| `"send"` | Ação a executar |
| `subagent_type` | `"explore"` \| `"general"` | Tipo do subagente (obrigatório em run/spawn) |
| `description` | string | Label curta, máx 5 palavras |
| `prompt` | string | Instruções completas — tratar como se o subagente não tem contexto prévio |

### Campos opcionais (dentro de `operation`)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `timeout_ms` | number | Timeout em ms (padrão 600000) |
| `context` | `"none"` \| `"state"` \| `"full"` | Herança de contexto |
| `task_id` | string | Vincular a uma task do tracker |
| `model` | string | Sobrescrever modelo |

### Exemplos de chamadas corretas

**Run (bloqueante):**
```json
{
  "operation": {
    "action": "run",
    "subagent_type": "explore",
    "description": "find error recovery",
    "prompt": "Search parser.ts for error recovery patterns..."
  }
}
```

**Spawn (background):**
```json
{
  "operation": {
    "action": "spawn",
    "subagent_type": "general",
    "description": "long search task",
    "prompt": "Analyze the full codebase for..."
  }
}
```

**Status:**
```json
{ "operation": { "action": "status", "actor_id": "explore-1" } }
```

**Wait:**
```json
{ "operation": { "action": "wait", "actor_id": "explore-1" } }
```

### Task Tool — Schema

```json
{ "operation": { "action": "create", "summary": "Task description" } }
{ "operation": { "action": "list" } }
{ "operation": { "action": "get", "id": "T1" } }
{ "operation": { "action": "start", "id": "T1", "event_summary": "starting" } }
{ "operation": { "action": "done", "id": "T1", "event_summary": "completed" } }
{ "operation": { "action": "block", "id": "T1", "event_summary": "waiting" } }
{ "operation": { "action": "unblock", "id": "T1", "event_summary": "resolved" } }
{ "operation": { "action": "abandon", "id": "T1", "event_summary": "cancelled" } }
{ "operation": { "action": "rename", "id": "T1", "summary": "New title" } }
```

### Erros já observados e como evitar

| Erro | Causa | Correção |
|------|-------|----------|
| `expected object, received string` | `operation` enviado como string | Envolver em `{}` com campo `action` |
| `unrecognized_keys: timeout_ms` | `timeout_ms` no nível raiz | Mover para dentro de `operation` |
| `unrecognized_keys: summary` | `summary` no nível raiz (task tool) | Mover para dentro de `operation` |

### Regras obrigatórias

1. `operation` é **sempre um objeto** com campo `action` — nunca enviar como string.
2. `timeout_ms`, `summary`, `event_summary` vão **dentro** de `operation`, nunca na raiz.
3. `description` é obrigatório — manter com máx 5 palavras.
4. `prompt` deve conter todas as instruções — o subagente não vê o histórico da conversa.
5. Usar `run` para resultado bloqueante, `spawn` para background.
6. Se a ferramenta rejeitar, reler o schema e corrigir — não insistir com aproximações.
7. **Antes de qualquer chamada de tool: ler `.agents/skills/agent-delegation/SKILL.md`.**

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

## 8. Research Agent

### Responsabilidade

Enriquecer informações de leads, empresas e oportunidades a partir de fontes externas permitidas.

### Entradas

* Lead
* Empresa
* Fontes autorizadas
* Objetivo da pesquisa
* Limites de coleta

### Saídas

* Perfil enriquecido
* Resumo da empresa
* Sinais comerciais
* Fontes consultadas
* Grau de confiança

### Regras

* Não fazer scraping proibido por termos de uso
* Registrar fontes consultadas
* Separar fato, inferência e hipótese
* Encaminhar incertezas relevantes ao humano

---

## 9. Human Handoff Agent

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

## 10. Monitoring Agent

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

## Skills do Projeto

Skills exclusivas deste projeto ficam em `.agents/skills/`:

| Skill | Uso |
|-------|-----|
| `tlc-spec-driven` | Planejamento de projetos e features |
| `agent-delegation` | Invocação correta do actor tool |

Para carregar, ler o `SKILL.md` respectivo:
- `.agents/skills/tlc-spec-driven/SKILL.md`
- `.agents/skills/agent-delegation/SKILL.md`

---

## Regras para IA

* Sempre atualizar os documentos de implantação docs/features/{{NAME}}.md
* Sempre implementar testes para validar o caso de uso da funcionalidade
  * Nos testes, sempre realizar mock das entidades, promisses, conexões externas, etc.
* Sempre atualizar o readme.
* Toda tarefa deve ser versionada usando Semantic Versioning 2.0.0, https://semver.org/
* Commits devem ser feitos usando Conventional Commits, https://www.conventionalcommits.org/en/v1.0.0/

---

## Skill Obligatória: tlc-spec-driven

**Toda tarefa de planejamento DEVE usar a skill `tlc-spec-driven`.**

> Skills do projeto ficam em `.agents/skills/` — não no diretório global de skills.

### Quando usar

| Cenário | Ação |
|---------|------|
| Novo projeto | Initialize project → PROJECT.md + ROADMAP.md |
| Nova feature | Specify → (Design) → (Tasks) → Execute |
| Bug fix simples | Quick mode (≤3 arquivos) |
| Refactor | Specify (brief) → Execute |
| Any planning | Sempre carregar a skill primeiro |

### Como usar

1. **Carregar a skill:** Ler `.agents/skills/tlc-spec-driven/SKILL.md`
2. **Avaliar complexidade:** Small (≤3 files) / Medium (<10 tasks) / Large / Complex
3. **Seguir as fases:** Specify → Design (se necessário) → Tasks (se necessário) → Execute
4. **Estrutura de arquivos:** Criar em `.specs/features/[nome-da-feature]/`

### Estrutura que a skill cria

```
.specs/
├── project/
│   ├── PROJECT.md      # Visão e objetivos
│   ├── ROADMAP.md      # Features e milestones
│   └── STATE.md        # Memória: decisões, bloqueios, lições
├── features/
│   └── [feature]/
│       ├── spec.md     # Requisitos com IDs rastreáveis
│       ├── design.md   # Arquitetura e componentes (Large/Complex)
│       └── tasks.md    # Tarefas atômicas com verificação (Large/Complex)
└── quick/              # Tarefas avulsas (quick mode)
    └── NNN-slug/
        └── TASK.md
```

### Regras da skill

- **Specify e Execute** sempre obrigatórios
- **Design** pulado quando não há decisões arquiteturais
- **Tasks** pulado quando ≤3 passos óbvios
- **Quick mode** para ≤3 arquivos, escopo de uma frase
- Sub-agentes para execução paralela de tarefas `[P]`
- Verificação sempre após implementação

---

## Skill Obligatória: agent-delegation

**Antes de QUALQUER chamada de tool que use `operation`: CARREGAR a skill `agent-delegation`.**

> Skills do projeto ficam em `.agents/skills/` — não no diretório global de skills.

### Quando usar

| Cenário | Ação |
|---------|------|
| Delegar trabalho a subagente | Ler skill antes de chamar `actor` |
| Criar ou gerenciar tasks | Ler skill antes de chamar `task` |
| Rodar workflow | Ler skill antes de chamar `workflow` |
| Qualquer tool com `operation` | Ler skill primeiro |

### Como usar

1. **Carregar a skill:** Ler `.agents/skills/agent-delegation/SKILL.md`
2. **Verificar schema:** `operation` é sempre `{}` com `action`
3. **Chamar a tool:** Seguir o schema documentado na skill
4. **Se falhar:** Relear a skill, não improvisar

### Gatilhos da skill

A skill é acionada pelas palavras: `tool`, `tools`, `delegate`, `delegation`, `actor`, `subagent`, `sub-agent`, `spawn`, `task`, `workflow`, `run agent`, `invoke`, `chamada`, `ferramenta`.

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

## Princípio Norteador

O sistema deve priorizar agentes confiáveis, auditáveis e especializados, em vez de agentes genéricos com autonomia excessiva.
