# Orun.AI Workforce Platform

Plataforma para criação, configuração e execução de agentes de IA especializados.

---

## Origem e Contexto

O Orun.AI nasceu de uma investigação conversacional consolidada nesta documentação base.
Primeiro, o projeto buscou um nome inspirado em culturas afro-brasileiras e iorubás associado a sabedoria, visão, caminhos e interpretação. A escolha foi **Orun.AI**, conectada ao conceito de Orun/Orunmilá/Ifá como símbolo de conhecimento profundo, leitura de contexto e orientação.

Essa inspiração deve ser usada com respeito: Orun.AI não é um produto religioso, nem deve apropriar ritos, símbolos sagrados ou prometer adivinhação. O significado de marca é metafórico e institucional: **ver além do óbvio, entender contexto e orientar decisões com responsabilidade**.

Depois, a ideia evoluiu de um site institucional de IA para uma plataforma de **AI Workforce**: equipes digitais compostas por agentes especializados, coordenadas por workflows auditáveis e integradas a ferramentas externas por MCP.

## Visão Geral

- Agent Builder
- MCP Server Builder
- Workflow Builder
- Knowledge Builder
- Multi-Agent Orchestrator
- Analytics & Observability

## Estado Atual do MVP

- Execucao manual do fluxo `lead -> qualification` usa `leadId` valido.
- A tela de lead permite abrir a execucao manual com o lead preselecionado.
- Arquivar e desarquivar leads preserva o ultimo status ativo conhecido.
- O webhook de leads passa a registrar `AgentRun` e `AgentLog` pela pipeline padrao.
- Workflow Engine funcional com execucao sequencial, pausa, retomada e cancelamento.
- Orchestrator core com planejamento, delegacao e consolidacao de resultados.
- MCP tools executaveis com calendar e document stubs, retry e audit logs.

## Tese do Produto

O foco inicial é automação comercial: captar leads, qualificar oportunidades, enriquecer contexto, agendar reuniões, fazer follow-up, gerar documentos e manter histórico auditável. O objetivo de longo prazo é permitir que empresas criem e operem times de agentes confiáveis, especializados e supervisionáveis.

Pilares:
- **Especialização:** cada agente tem uma responsabilidade clara.
- **Orquestração:** workflows coordenam agentes, humanos e integrações.
- **Auditabilidade:** ações, decisões, entradas e saídas relevantes ficam registradas.
- **Human-in-the-loop:** ações sensíveis exigem revisão humana.
- **MCP-first:** integrações externas devem evoluir por contratos padronizados.
- **JavaScript/TypeScript-first:** a base técnica prioriza o ecossistema JS/TS.

## Stack

- **Framework:** Next.js 15
- **Linguagem:** TypeScript
- **Banco:** SQLite + Prisma ORM
- **UI:** React + Tailwind CSS v4
- **Testes:** Vitest
- **IA:** APIs externas de LLM (OpenAI)
- **Protocolo:** MCP — Model Context Protocol

## Como Rodar

```bash
# Instalar dependências
npm install

# Aplicar migrations locais
npm run db:migrate

# Popular dados de exemplo
npx prisma db seed

# Iniciar desenvolvimento
npm run dev

# Rodar testes
npm test

# Lint e typecheck
npm run lint
npm run typecheck

# Build de produção
npm run build
```

## Persistencia do MVP

- Leads agora usam `externalId` em coluna dedicada para deduplicacao auditavel.
- Exclusao de lead e soft delete com `deletedAt`; o historico continua preservado.
- Credenciais de integracoes nao devem ir para o banco: use `secretRef` apontando para `env:` ou outro secret manager.
- Campos JSON polimorficos continuam serializados em `String` no SQLite por limitacao do Prisma com esse provider; a estrategia de migracao para PostgreSQL esta documentada em `docs/features/data-and-persistence.md`.

## Qualidade

- Testes automatizados usam `Vitest`.
- Mocks reutilizaveis de banco e runtime de agentes ficam em `src/test/mocks/`.
- `npm run lint` usa `eslint .` com exclusao de artefatos gerados.
- `npm run typecheck` executa `next typegen` antes do `tsc --noEmit` para evitar falhas em workspace limpo.

## Convenções

### Autoload

Os seguintes arquivos são carregados automaticamente pelo assistente:
- `CLAUDE.md` — regras de código, commits, versioning
- `AGENTS.md` — especificação do projeto, agentes, modelo de dados
- `README.md` — este arquivo, visão geral e convenções

### Commits

Usar **Conventional Commits:** `feat(scope): descrição`

Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`

### Versioning

Usar **Semantic Versioning 2.0.0:** `MAJOR.MINOR.PATCH`

Atualizar `package.json` version a cada tarefa concluída.

### Checklist de Conclusão

Ao finalizar qualquer tarefa:
1. Rodar testes (`npm test`)
2. Rodar build (`npm run build`)
3. Rodar lint (`npm run lint`)
4. Rodar typecheck (`npm run typecheck`)
5. Validar página inicial (quando aplicável)
6. Versionar (semver)
7. Documentar aprendizados (`.mimocode/learning.md`)
8. Salvar sessão (`.mimocode/session/`)
9. Commit (conventional commits)

## Estrutura

```
src/
├── app/              # Rotas Next.js
├── components/       # Componentes React
├── lib/              # Lógica de negócio
└── prisma/           # Schema e migrations
```

## Documentação

- `AGENTS.md` — especificação completa dos agentes
- `docs/prd.md` — requisitos de produto e visão evolutiva
- `docs/workflows.md` — workflows oficiais da jornada comercial e operacional
- `docs/orchestrator.md` — coordenação entre agentes, contexto, MCP e governança
- `DESIGN.md` — identidade visual e princípios de experiência
- `docs/plans/sequential-build/` — plano canônico de construção sequencial, com um `.md` por ponto
- `docs/features/` — documentação por feature
- `docs/features/stabilize-mvp.md` — estabilização do primeiro ponto do plano sequencial
- `docs/features/tests-and-quality.md` — primeira camada real de testes e revisão dos gates de qualidade
- `docs/features/data-and-persistence.md` — endurecimento de schema, migrations e politicas de persistencia do MVP
- `docs/codex-report/` — auditoria Codex de requisitos, implementação real e lacunas
- `.mimocode/learning.md` — aprendizados do projeto
- `.mimocode/session/` — histórico de sessões

## Troubleshooting

- Codex VS Code extension: plugins locais do Codex precisam respeitar os limites do manifesto. Em `interface.defaultPrompt`, cada prompt deve ter no máximo 128 caracteres para evitar warnings na inicialização do `codex app-server`.
- Codex VS Code extension: o warning IPC `client-status-changed` foi corrigido com patch local no bundle instalado da extensão; ao atualizar/reinstalar a extensão, reaplicar ou remover o patch conforme a versão oficial.
