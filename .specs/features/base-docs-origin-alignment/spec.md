# Spec — Alinhamento dos Documentos Base com o Chat Original

## Contexto

O chat original fornecido pelo usuario contem a conversa que originou o nome, a identidade, a pesquisa de mercado e a evolucao do produto Orun.AI. Os documentos base atuais ja representam parte desse conteudo, mas ainda faltava explicitar a origem, o embasamento e a coerencia entre marca, produto, agentes, workflows e orquestracao.

## Objetivo

Atualizar somente documentacao base para transformar o chat bruto em contexto canonico, conciso e rastreavel.

## Requisitos

### DOC-001 — Fonte Historica

Registrar o conteudo do chat original como fonte historica consolidada, diferenciando origem bruta dos documentos canonicos.

### DOC-002 — Origem da Marca

Documentar que Orun.AI surgiu da associacao com Orun/Orunmila/Ifa: sabedoria, visao alem do obvio, caminhos e inteligencia orientadora, com uso respeitoso e nao religioso.

### DOC-003 — Tese do Produto

Explicitar que o projeto evoluiu de um site/IA preditiva para uma plataforma de AI Workforce focada inicialmente em automacao comercial.

### DOC-004 — Coerencia Arquitetural

Alinhar PRD, workflows, agents e orchestrator em torno de:

- agentes especializados;
- workflows auditaveis;
- MCP como protocolo de integracao;
- JavaScript/TypeScript como stack principal;
- human-in-the-loop para acoes sensiveis;
- observabilidade e rastreabilidade.

### DOC-005 — Escopo

Nao alterar codigo funcional. Nao implementar features.

## Criterios de Aceite

- `README.md`, `docs/prd.md`, `docs/workflows.md`, `docs/orchestrator.md`, `AGENTS.md`, `DESIGN.md` e `CLAUDE.md` atualizados.
- Arquivo bruto do chat removido apos consolidacao nos documentos base.
- Feature doc e registros `.mimocode` atualizados.
- Versionamento patch aplicado.
- Validacoes documentadas.
