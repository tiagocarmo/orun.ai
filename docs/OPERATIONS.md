# Operações — Orun.AI Workforce Platform

Guia de setup, execução, manutenção e troubleshooting do projeto.

---

## Pré-requisitos

- Node.js 18+
- npm 9+
- Git

---

## Setup Inicial

```bash
# Clonar o repositório
git clone <repo-url>
cd orun.ai

# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env
# Editar .env com valores reais (ver seção Variáveis de Ambiente)

# Aplicar migrations
npm run db:migrate

# Popular dados de exemplo
npx prisma db seed

# Gerar cliente Prisma
npm run db:generate
```

---

## Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento (porta 3000) |
| `npm run build` | Build de produção |
| `npm run start` | Inicia servidor de produção |
| `npm run lint` | Verificação de código com ESLint |
| `npm run typecheck` | Verificação de tipos com TypeScript |
| `npm test` | Executa suite de testes (Vitest) |
| `npm run test:watch` | Executa testes em modo watch |
| `npm run db:migrate` | Cria/aplica migrations em desenvolvimento |
| `npm run db:deploy` | Aplica migrations em produção |
| `npm run db:push` | Sincroniza schema com banco sem migration |
| `npm run db:seed` | Popula banco com dados de exemplo |
| `npm run db:studio` | Abre Prisma Studio (GUI do banco) |
| `npm run db:generate` | Regenera cliente Prisma |

---

## Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `DATABASE_URL` | Sim | URL do banco SQLite (`file:./dev.db`) |
| `LLM_PROVIDER` | Sim | Provedor de IA (`openai`, `anthropic`, etc.) |
| `OPENAI_API_KEY` | Sim* | Chave da API OpenAI (*se usar OpenAI como provider) |
| `WEBHOOK_SECRET` | Sim | Segredo para validação de webhooks |
| `NEXT_PUBLIC_APP_URL` | Sim | URL da aplicação (`http://localhost:3000`) |

---

## Estrutura do Banco de Dados

O projeto usa SQLite com Prisma ORM. Tabelas principais:

- `Agent` / `AgentVersion` / `AgentRun` / `AgentLog` — ciclo de vida dos agentes
- `Lead` / `LeadEvent` — gestão de leads
- `Conversation` / `Message` — histórico de comunicação
- `Workflow` / `WorkflowRun` — engine de workflows
- `Document` / `DocumentChunk` — gestão documental e embeddings
- `Integration` — integrações externas
- `ScheduledTask` — tarefas agendadas

Schema completo: `prisma/schema.prisma`

---

## Quality Gates

Antes de qualquer commit ou deploy:

```bash
npm run lint        # Deve passar sem erros
npm run typecheck   # Deve passar sem erros
npm test            # Todos os 155+ testes devem passar
npm run build       # Build deve completar com sucesso
```

---

## Troubleshooting

### Erro: `The column X does not exist in the current database`

O banco SQLite está desatualizado com o schema do Prisma.

```bash
npm run db:push     # Sincroniza schema sem migration
# ou
npm run db:migrate  # Cria migration formal
```

### Erro: `next typegen` falha antes do build

Rodar `npm run build` primeiro para gerar tipos, depois `npm run typecheck`.

```bash
npm run build && npm run typecheck
```

### Erro de types no `tsc --noEmit`

O typecheck é mais confiável após o build porque `.next/types` precisa existir.

### Seed não funciona

```bash
npx prisma db seed
```

Se falhar, verificar se o banco existe e o schema está sincronizado.

### Lint mostra erros novos

```bash
npm run lint -- --fix   # Auto-correção quando possível
```

---

## Deploy

### Build de Produção

```bash
npm run build
```

### Ambiente de Produção

1. Configurar `.env` com valores de produção
2. Aplicar migrations: `npm run db:deploy`
3. Iniciar: `npm run start`

### Variáveis Críticas para Produção

- `DATABASE_URL` — apontar para banco de produção
- `OPENAI_API_KEY` — chave válida
- `WEBHOOK_SECRET` — segredo forte e único
- `NEXT_PUBLIC_APP_URL` — domínio público

---

## Monitoramento

- Logs de execução de agentes ficam na tabela `AgentLog`
- Runs ficam na tabela `AgentRun` com status, duração e tokens
- Dashboard disponível em `/` com métricas de leads, runs e workflows
- Erros de integração aparecem nos logs do servidor Next.js

---

## Segurança

- Chaves de API ficam apenas em variáveis de ambiente (nunca no banco)
- Credenciais de integrações usam `secretRef` (referência a env)
- Dados sensíveis (PII) são mascarados em logs
- RBAC com 3 roles (admin, operator, viewer) e 20 permissões
- Controles de governança limitam ações por hora/dia
- Ações sensíveis exigem aprovação humana
