# PRD - Orun.AI

## Resumo

Orun.AI e uma plataforma experimental para operar uma equipe digital de agentes especializados em pre-vendas e operacoes comerciais. A tese do produto nao e autonomia irrestrita; e confiabilidade operacional com contexto, logs, limites de acao e possibilidade de intervencao humana.

## Problema

Equipes comerciais perdem tempo com tarefas repetitivas e fragmentadas:

- captacao e triagem de leads
- qualificacao inicial
- enriquecimento de contexto
- agendamento
- follow-up
- geracao documental
- consulta a historico e conhecimento
- atualizacao operacional em sistemas

Ferramentas isoladas automatizam partes do fluxo, mas raramente mantem auditabilidade, contexto compartilhado e controle humano sobre a execucao.

## Usuarios principais

- SDR ou operador comercial que precisa reduzir trabalho manual.
- Executivo comercial que precisa chegar em reunioes com contexto pronto.
- Gestor comercial que precisa visibilidade do funil e das execucoes.
- Time operacional que precisa acompanhar logs, falhas e aprovacoes.

## Proposta de valor

Orun.AI entrega uma camada de operacao comercial orientada por agentes especializados:

- agentes com responsabilidades limitadas
- workflows retomaveis e auditaveis
- orquestracao centralizada
- integracoes MCP como camada padrao de ferramentas
- controles de seguranca, mascaramento e governanca

## Escopo atual do MVP

### Capacidades implementadas

- Cadastro de agentes com prompt, modelo, versoes e runs.
- Leads com status, score, motivo de qualificacao, metadados e soft delete.
- Conversas e mensagens ligadas ao lead.
- Workflows persistidos com steps JSON e runs com contexto serializado.
- Documentos e chunks documentais persistidos.
- Integracoes configuraveis com `secretRef`.
- Tarefas agendadas e configuracoes gerais.

### Agentes implementados

- Lead Intake
- Qualification
- Scheduling
- Follow-up
- Research
- Document
- Human Handoff

### Capacidades operacionais

- Dashboard com metricas agregadas.
- Execucao manual de agentes.
- Historico de runs e logs.
- Engine de workflow com pausa, retomada e cancelamento.
- Orchestrator com planejamento, execucao e consolidacao.
- Auth, RBAC, mascaramento de PII e regras de governanca.

## Jornada principal

1. Um lead entra por formulario, webhook, API ou cadastro manual.
2. O Lead Intake registra o lead e seus eventos.
3. O Qualification atribui score, status e motivo.
4. O Research enriquece contexto quando necessario.
5. O Scheduling propoe e registra reunioes.
6. O Follow-up reativa ou lembra contatos conforme o estado do lead.
7. O Document gera artefatos comerciais.
8. O Human Handoff interrompe a automacao quando a confianca ou o risco exigem uma pessoa.

## Requisitos de produto

### Confiabilidade

- Toda execucao relevante deve gerar registro persistido.
- Workflows precisam suportar falha controlada e retomada.
- O sistema deve deixar claro status, saida, erro e contexto de cada run.

### Especializacao

- Cada agente deve ter responsabilidade clara e limitada.
- O orchestrator decide sequencia e delegacao; nao incorpora logica de dominio detalhada.

### Seguranca e governanca

- Segredos nao devem ficar no banco; usar `secretRef`.
- Dados sensiveis precisam ser mascarados em logs quando aplicavel.
- Acoes de maior risco devem permitir aprovacao humana.

### Operabilidade

- Um operador deve conseguir acompanhar o estado do sistema pelo dashboard.
- Um time tecnico deve conseguir rodar, testar e evoluir o projeto localmente.

## Nao objetivos

- Multi-tenant completo.
- Billing, marketplace ou empacotamento comercial final.
- Autonomia plena sem revisao humana.
- Suite universal de agentes para qualquer dominio.
- Infra de producao definitiva.

## Medidas de sucesso do MVP

- Leads e execucoes ficam auditaveis de ponta a ponta.
- O fluxo principal de pre-vendas pode ser demonstrado do intake ao handoff.
- O projeto permanece modificavel por agentes de codigo com documentacao minima e clara.

## Riscos e limites atuais

- O produto ainda e um teste funcional e nao uma plataforma estabilizada para producao.
- Nem todos os agentes descritos historicamente existem no codigo atual.
- Parte das integracoes externas ainda e estrutural ou stub, embora a arquitetura ja as contemple.
