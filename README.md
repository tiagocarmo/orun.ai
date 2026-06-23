# Orun.AI Workforce Platform

Plataforma para criação, configuração e execução de agentes de IA especializados.

---

## Visão Geral

- Agent Builder
- MCP Server Builder
- Workflow Builder
- Knowledge Builder
- Multi-Agent Orchestrator
- Analytics & Observability

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

# Configurar banco
npx prisma db push
npx prisma db seed

# Iniciar desenvolvimento
npm run dev

# Rodar testes
npm test

# Build de produção
npm run build
```

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
- `docs/features/` — documentação por feature
- `.mimocode/learning.md` — aprendizados do projeto
- `.mimocode/session/` — histórico de sessões
