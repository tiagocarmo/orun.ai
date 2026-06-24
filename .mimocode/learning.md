# Aprendizados — Sessão MVP Orun.AI

## O que deu certo

### Planejamento com workstreams paralelos
A estratégia de dividir em 3 workstreams (Foundation, Backend, UI) com arquivos exclusivos funcionou perfeitamente. Zero conflitos entre subagentes. A chave foi definir paths exclusivos por workstream antes de começar.

### Subagentes para execução paralela
Lançar WS-B e WS-C simultaneamente via `actor` reduziu o tempo pela metade. Cada subagente recebeu contexto completo das dependências (types, db, validators) e conseguiu trabalhar de forma independente.

### Integração como fase separada
Manter a integração (wire server actions → pages) como uma fase distinta após ambos workstreams foi mais eficiente do que tentar integrar durante a execução. Permitiu que cada workstream focasse no seu escopo.

### Prisma como ORM
A escolha de Prisma com SQLite foi correta para o MVP. Schema declarativo, migrations automáticas, e seed script facilitaram muito a configuração inicial.

### Design tokens no Tailwind v4
Implementar os tokens do DESIGN.md como classes Tailwind customizadas (`bg-canvas`, `text-ink`, etc.) permitiu que o WS-C trabalhasse com o design system sem precisar de arquivos de configuração extras.

---

## O que deu errado

### 1. Prisma @db.Json com SQLite
**O que aconteceu:** Tentei usar `@db.Json` nos campos do schema Prisma, mas SQLite não suporta o tipo Json nativo. O `npx prisma generate` retornou 18 erros de validação.

**Por que deu errado:** Falta de verificação prévia da compatibilidade entre Prisma features e o provider de banco. O Prisma suporta `@db.Json` apenas para PostgreSQL, MySQL e MongoDB.

**O que foi feito para corrigir:** Removi todas as anotações `@db.Json` e mantive os campos como `String` simples. Dados JSON são serializados com `JSON.stringify()` ao gravar e `JSON.parse()` ao ler.

**Lição:** Sempre verificar a documentação de compatibilidade do Prisma antes de usar tipos nativos. Para SQLite, todos os campos JSON devem ser String.

---

### 2. Import path incorreto no provider LLM
**O que aconteceu:** O arquivo `src/lib/ai/providers/base.ts` importava `./types` mas o arquivo de tipos ficava em `../types` (um nível acima).

**Por que deu errado:** Erro de digitação/atenção ao escrever o import. O arquivo está em `providers/` mas os tipos estão em `ai/types.ts`, não em `providers/types.ts`.

**O que foi feito para corrigir:** Corrigido o path de `./types` para `../types`.

**Lição:** Imports relativos em subdiretórios requerem atenção redobrada. Usar aliases (`@/lib/ai/types`) pode evitar esses erros.

---

### 3. create-next-app não funciona em diretório com arquivos
**O que aconteceu:** Tentei usar `npx create-next-app .` mas o diretório já continha arquivos (AGENTS.md, DESIGN.md, etc.) e o comando recusou criar o projeto.

**Por que deu errado:** O `create-next-app` exige um diretório vazio ou inexistente. Não existe flag para forçar em diretório não vazio.

**O que foi feito para corrigir:** Configurei o projeto manualmente — criei `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs` e todos os arquivos de configuração do zero.

**Lição:** Para projetos que já têm documentação ou configuração existente, configurar manualmente é mais rápido e confiável que usar scaffolding tools.

---

### 4. Faltou criar a root page.tsx (WS-C deletou)
**O que aconteceu:** O WS-C deletou `src/app/page.tsx` original e o substituiu pelo `src/app/(dashboard)/page.tsx`. Isso causou conflito porque o layout raiz ainda esperava uma page na raiz.

**Por que deu errado:** Falta de coordenação entre workstreams sobre qual arquivo seria a "home page". O WS-A criou `src/app/page.tsx` como scaffold, e o WS-C a substituiu.

**O que foi feito para corrigir:** A integração (general-4) verificou e ajustou as rotas. O build passou porque o `(dashboard)/page.tsx` é servido como `/`.

**Lição:** Definir claramente no planejamento quem "possui" cada arquivo. Usar route groups `(dashboard)` já isola bem, mas a page raiz precisa de atenção.

---

### 5. Prisma package.json#prisma deprecated
**O que aconteceu:** O Prisma 6.x emite warning sobre `package.json#prisma` sendo deprecated.

**Por que deu errado:** Usei a configuração de seed via `package.json` que será removida no Prisma 7.

**O que foi feito para corrigir:** Nenhuma correção agora — warning apenas. Será migrado para `prisma.config.ts` quando atualizar para Prisma 7.

**Lição:** Monitorar deprecations do Prisma. A configuração de seed deve ir para `prisma.config.ts` em projetos novos.

---

## Padrões que funcionaram bem

### Validação com Zod
Separar schemas de validação em `src/lib/validators.ts` e usá-los em server actions + formulários garantiu consistência. Uma única fonte de verdade para validação.

### Server Actions para CRUD
Usar `'use server'` functions em vez de API routes para operações CRUD simplificou muito o código. Forms fazem submit direto para as actions.

### Componentes UI genéricos
Criar componentes `Button`, `Input`, `Card`, `Badge` antes das páginas foi essencial. Permitiu que o WS-C construísse páginas rapidamente com componentes consistentes.

### Mock data primeiro, real depois
Começar com dados mock no WS-C e substituir por Prisma queries na integração foi mais eficiente do que tentar conectar tudo de uma vez.

---

## Recomendações para Próximas Sessões

1. **Testes:** Configurar Vitest e escrever testes para server actions e agent engine antes de adicionar mais features
2. **MCP:** Implementar pelo menos um MCP tool real (ex: Google Calendar stub) para validar a arquitetura
3. **Workflow Engine:** O schema de workflows existe mas o engine de execução não — priorizar para orquestração
4. **Prisma 7:** Migrar configuração de seed para `prisma.config.ts` e remover deprecated warnings
5. **Autenticação:** Adicionar auth básica antes de qualquer deploy (mesmo que JWT simples)

---

## Sessão 2 — Configuração do MiMo Code

### MiMo Code: CLAUDE.md como fonte de verdade

- Criar `CLAUDE.md` na raiz para regras que devem ser sempre aplicadas (commits, versioning, testes)
- O `AGENTS.md` não é injetado automaticamente no contexto — precisa ser citado ou referenciado
- `CLAUDE.md` é sempre carregado pelo sistema, tornando-o ideal para convenções obrigatórias

### Diferença entre modos do MiMo Code

- **Plan:** Somente leitura, cria plano sem modificar código
- **Build:** Implementação direta, sem subagentes
- **Compose:** Orquestração com skills (brainstorm, TDD, review, merge), subagentes paralelos

### Regras de finalização de tarefa

- Rodar testes (`npm test`), build (`npm run build`) e lint (`npm run lint`) antes de marcar como concluído
- Versionar com Semantic Versioning (semver)
- Usar Conventional Commits para mensagens de commit
- Documentar aprendizados e sessão automaticamente ao final

### Autoload de arquivos de configuração

- `CLAUDE.md`, `AGENTS.md` e `README.md` devem ser referenciados para autoload
- Referenciar no `CLAUDE.md` garante que o assistente sempre carregue as regras

---

## Sessão 3 — Correção de Feedback UI com Worktree Paralelo

### Trabalho paralelo com 3 workstreams

- Criado worktree isolado `.worktrees/fix-ui-feedback`
- 3 agents executando em paralelo: WS-A (foundation), WS-B (leads), WS-C (search/responsive)
- Cada agent trabalhou em arquivos distintos, sem conflitos
- Todos os agents concluíram com sucesso

### Desafio: agents trabalharam no repo principal

- O diretorio `src/` era untracked no worktree, entao os agents acabaram trabalhando no repo principal
- Solução: commit final foi feito no repo principal, worktree foi removido
- Lição: para worktrees com arquivos untracked, considerar fazer checkout dos arquivos primeiro

### Resultado das correções

- Sidebar fixa em desktop com `h-screen` e `lg:fixed`
- Todos os textos traduzidos para PT-BR
- Leads: CRUD completo (editar/arquivar/excluir) com modal de confirmacao
- Run Agent: busca de leads com autocomplete (3 letras, debounce 3s, max 3 resultados)
- Conversas: contexto enriquecido com info do lead e agente
- Layout responsivo para desktop e mobile
- Componente Modal generico criado

### Verificações passaram

- Typecheck: ✅ sem erros
- Lint: ✅ sem warnings
- Build: ✅ sucesso
- Version: 0.1.1 → 0.2.0 (minor — novas funcionalidades)

---

## Sessão 4 — Correção de Feedback UI v2 (tlc-spec-driven)

### O que aconteceu

- Commit `c4edf24` dizia ter implementado tudo, mas na realidade sidebar, busca e conversas NAO foram implementados
- Apenas Modal, Lead CRUD e traducao foram realmente feitos

### Correções realizadas

- **Sidebar:** `lg:static` → `lg:fixed` + `h-screen` no container + `lg:ml-64` no wrapper
- **Run Agent:** textarea JSON substituido por busca de leads com autocomplete (3s debounce, min 3 letras, max 3 resultados)
- **Conversas:** query enriquecida com email, empresa do lead; interface com mais contexto
- **searchLeads:** nova server action adicionada em leads.ts

### Lições

- Commit messages devem refletir O QUE FOI REALMENTE FEITO, nao o que estava planejado
- Sempre verificar implementacao antes de commitar
- Usar tlc-spec-driven para planejamento: Specify → Execute com verificacao

---

## Sessão 5 — Correção de inicialização da extensão Codex VS Code

### Manifestos de plugin do Codex têm limites rígidos

- O campo `interface.defaultPrompt` em `plugin.json` aceita no máximo 128 caracteres por item
- Um manifesto inválido pode não quebrar o CLI inteiro, mas gera warning na subida do `codex app-server` e pode ser propagado pela extensão como erro de inicialização

### Diagnóstico eficaz

- O caminho do arquivo problemático já vinha no log do VS Code; seguir esse path foi o jeito mais rápido de isolar a causa raiz
- Antes de alterar qualquer coisa, medir o tamanho real da string evitou correções por tentativa e erro

---

## Sessão 6 — Warning IPC client-status-changed da extensão Codex

### Broadcast de presença não deve virar warning operacional

- A extensão Codex usa um router IPC local e emite `client-status-changed` quando clientes conectam/desconectam
- O bundle atual registra warning quando qualquer broadcast chega sem handler
- Para `client-status-changed`, isso pode ocorrer durante startup/reconexão antes da webview registrar handlers
- Correção local segura: ignorar o warning apenas para `client-status-changed` e manter warnings para outros broadcasts

### Cuidados ao corrigir extensões instaladas

- Sempre criar backup do bundle antes de patch local
- Validar sintaxe com `node --check`
- Registrar que atualização/reinstalação da extensão pode sobrescrever o patch

---

## Sessão 7 — Auditoria Codex do Projeto Orun.AI

## Sessão 10 — Data and Persistence Point 03

### Prisma migrate pode falhar mesmo com schema valido

- Nesta base, `npx prisma validate` e `npx prisma generate` passaram, mas `prisma migrate dev` e `prisma migrate deploy` falharam no engine com a mensagem opaca `Schema engine error:`
- Como fallback seguro para baseline inicial, `prisma migrate diff --from-empty --to-schema-datamodel ... --script` gerou um `migration.sql` consistente
- O SQL da migration foi validado com `prisma db execute` sobre um SQLite temporario e o seed executou com sucesso em seguida
- Licao: para bootstrap de migrations em ambientes com engine instavel, separar "geracao formal da migration" de "aplicacao pelo migrate engine" evita bloquear o trabalho de schema

### Soft delete precisa andar junto com filtros operacionais

- Trocar `delete` por `deletedAt` sem revisar `get`, `list` e `search` deixa dado "apagado" vazando no produto
- O ajuste correto envolveu `deleteLead`, `getLead`, `getLeads` e `searchLeads`, mantendo o historico no banco e escondendo registros removidos do fluxo principal

### Identificadores externos nao devem morar em metadata consultavel

- `externalId` em JSON serializado funciona como gambiarra de MVP, mas quebra deduplicacao e torna indices impossiveis
- Promover o identificador para coluna dedicada resolveu a consulta critica sem exigir migracao ampla de todos os blobs JSON do schema

## Sessão 8 — Stabilize MVP Point 01

### Prefill por query reduz erro de payload na execucao manual

- Para um fluxo manual orientado por lead, montar o payload a partir de uma funcao dedicada (`buildLeadRunInput`) evita que a UI "adivinhe" o schema do agente em mais de um lugar
- Abrir `/runs?lead=<id>` a partir da tela do lead deixa o fluxo principal menos propenso a erro humano e mais aderente ao caso de uso real do MVP

### Restaurar estado exige memoria minima do status anterior

- "Desarquivar" so fica coerente quando o sistema guarda o ultimo status ativo conhecido
- Salvar `lastActiveStatus` em `metadata` foi a menor mudanca segura dentro do MVP atual, sem abrir o escopo maior de schema do ponto 03

### Auditoria consistente pede reutilizar a pipeline principal

- O webhook ficou mais confiavel quando passou a usar `executeAgent` em vez de chamar o agente diretamente
- Isso centraliza `AgentRun` e `AgentLog` e reduz divergencia entre fluxos manuais e automatizados

### Testes com `vi.mock` hoisted exigem cuidado

- Em Vitest, factories de `vi.mock` sao hoisted; mocks compartilhados precisam nascer via `vi.hoisted()` para evitar `ReferenceError`
- Esse detalhe e facil de esquecer quando adicionamos os primeiros testes do projeto

### Auditoria precisa comparar promessa, histórico e código

- A documentação do Orun descreve uma plataforma workforce ampla, mas o código atual é um MVP parcial com CRUD, dois agentes, runs, conversas, dashboard e stubs.
- O histórico `.mimocode` é útil para entender intenção e decisões, mas precisa ser confrontado com a implementação real; há casos em que tarefas foram registradas como concluídas e depois corrigidas parcialmente.

### Achados de alto impacto

- A tela de execução manual seleciona lead, mas não envia `leadId`; isso diverge do contrato do `QualificationAgent`.
- O botão "Desarquivar" de lead usa a mesma atualização de status de arquivamento.
- Webhooks executam o lead intake diretamente, sem criar `AgentRun`, reduzindo auditabilidade.
- O projeto tem Vitest configurado, mas sem testes reais de agentes/actions.

### Relatório produzido

- A auditoria foi gravada em `docs/codex-report/`.
- A feature documental foi registrada em `docs/features/codex-report.md`.
- A tarefa foi rastreada em `.specs/features/codex-report-audit/`.

## Sessão 9 — Tests and Quality Point 02

### Helpers de mock reduzem atrito e duplicação

- Centralizar mocks em `src/test/mocks/` tornou os testes de actions, agentes e webhook consistentes e mais fáceis de expandir
- Esse padrão evita recriar `mockDb`, `revalidatePath` e runtime de agentes em cada arquivo novo

### Cobertura mínima útil é melhor que cobertura difusa

- Priorizar `LeadIntakeAgent`, `QualificationAgent`, `runAgent`, webhook e actions de leads deu proteção real aos fluxos centrais do MVP
- Esse recorte conversa diretamente com a auditoria e reduz risco de regressão onde o produto já opera

### Revisão de tooling cabe junto do ponto de qualidade

- Migrar `lint` para `eslint .` removeu o caminho depreciado de `next lint`
- Rodar `next typegen` antes do `tsc --noEmit` melhorou a previsibilidade do gate de tipos, mas a execução continua mais confiável quando feita em sequência após `build`

### Testes de contrato ajudam a estabilizar server actions

- Para `runAgent` e webhook, validar o formato de retorno e os cenários de erro foi tão importante quanto validar o caminho feliz
- Em MVPs com pouca integração real, esses testes de contrato capturam boa parte dos regressos sem exigir banco real

---

## Sessão 8 — Alinhamento dos Documentos Base ao Chat Original

### Chat bruto não deve virar requisito direto

- O chat original continha origem, pesquisa, decisões e rascunhos, mas foi consolidado nos documentos base e removido como arquivo separado.
- Os documentos canônicos (`README`, `PRD`, `AGENTS`, `workflows`, `orchestrator`, `DESIGN`, `CLAUDE`) devem carregar apenas o que foi curado e estabilizado.

### Identidade Orun.AI

- A marca nasceu da associação com Orun/Orunmilá/Ifá: sabedoria, visão, caminhos e orientação.
- Essa inspiração deve ser institucional e respeitosa, sem prometer adivinhação ou usar linguagem religiosa como funcionalidade.

### Coerência arquitetural

- MCP deve significar Model Context Protocol no projeto.
- Multi-component planning é uma capacidade desejada de orquestração, não o nome do protocolo.
- O produto saiu de uma ideia de IA preditiva/site institucional para uma AI Workforce Platform com foco inicial em automação comercial.

---

## Sessão 9 — Planejamento Sequencial de Construção

### Plano mestre precisa ser operacional, não só estratégico

- Um plano útil para execução futura precisa dizer ordem, escopo, critério de conclusão e qual arquivo o agente executor deve abrir.
- Separar um `README` mestre e um `.md` por ponto deixa a sequência mais fácil de operar sem ambiguidade.

### Sequenciamento importa mais do que volume

- No estado atual do projeto, abrir muitos pontos ao mesmo tempo aumentaria ruído.
- A ordem correta é estabilizar MVP, criar testes, endurecer dados, depois só então workflow engine, orchestrator e integrações.

### Regra de execução consolidada

- Spawn one agent per point, executar um e depois puxar o outro, até concluir.
- Isso preserva contexto, reduz mistura de escopos e facilita validação por etapa.

---

## Sessão 11 — Correção do erro deletedAt no banco SQLite

### Migration documentada não aplicada causa erro em runtime

- A migration `20260624084500_data_persistence_foundation` foi criada e documentada em `docs/features/data-and-persistence.md`, mas nunca foi aplicada ao banco SQLite
- A tabela `Lead` foi criada sem as colunas `deletedAt` e `externalId`, enquanto o código em `src/app/actions/leads.ts` as usava em 6 consultas Prisma
- O erro `P2022: The column main.Lead.deletedAt does not exist` aparecia em `/leads`, `/runs` (busca de lead) e na busca global do site

### Prisma migrate engine pode falhar em ambientes específimos

- `prisma migrate dev` e `prisma migrate deploy` falharam com `Schema engine error:` sem detalhe adicional
- A solução segura foi aplicar o SQL diretamente via `sqlite3` no banco `prisma/dev.db`
- Após aplicar o SQL manual, `prisma generate` funcionou normalmente e o client foi regenerado

### SQL direto como bypass seguro para engine instável

- `ALTER TABLE "Lead" ADD COLUMN "deletedAt" DATETIME;` — adiciona coluna para soft delete
- `ALTER TABLE "Lead" ADD COLUMN "externalId" TEXT;` — adiciona coluna para deduplicação
- `CREATE UNIQUE INDEX "Lead_externalId_key"` — garante unicidade do external ID
- `CREATE INDEX "Lead_status_deletedAt_idx"` e `CREATE INDEX "Lead_deletedAt_idx"` — otimizam consultas
- `ALTER TABLE "Integration" RENAME COLUMN "credentials" TO "secretRef"` — alinha com o schema Prisma

### Tabela `_prisma_migrations` é necessária para tracking

- Sem ela, o Prisma não reconhece migrations aplicadas e tenta reaplicar
- Criar manualmente com registro da migration aplicada resolve o problema para `prisma migrate status`

### Lição

- Quando o Prisma engine falha, aplicar SQL manualmente no SQLite é válido e seguro
- Sempre verificar o estado real do banco (`sqlite3 dev.db ".schema Lead"`) antes de assumir que a migration foi aplicada
- A migration documentada não garante execução — validar com `_prisma_migrations` ou `.schema` do banco

---

## Sessão 12 — Workflow Engine Point 04

### Engine de workflows precisa de check de status entre passos

- O `executeSteps` precisa consultar o `WorkflowRun` entre passos para detectar pause/cancel
- Isso cria um ponto de acoplamento com o banco que precisa ser mockado nos testes
- O mock de `workflowRun.findUnique` deve retornar o run atual para evitar falsos negativos

### Variáveis de contexto resolvidas por template

- Usar `$input.field`, `$previous.field` e `$context.field` como templates de resolução mantém o formato simples e extensível
- A resolução发生在 `resolveInput` antes de chamar o agente, isolando a lógica de mapeamento

### Testes de workflow precisam de mocks em cadeia

- Mock do `db.workflow.findUnique` para retornar o workflow
- Mock do `db.workflowRun.create` para retornar o run
- Mock do `db.workflowRun.findUnique` para o check de status entre passos
- Mock do `executeAgent` para simular a execução do agente
- Esse padrão de mocks em cadeia é comum em engines que orquestram múltiplas chamadas

### Server actions seguem o padrão existente

- Manter `ApiResponse<T>` como tipo de retorno consistency com `leads.ts`
- Usar `revalidatePath` para invalidar cache após mudanças
- Separar a lógica de negócio (engine) das actions (server-side) mantém testabilidade

### Documentação da feature deve explicar formato dos passos

- O campo `steps` do `Workflow` é JSON serializado — documentar o formato esperado é essencial
- Incluir exemplos de variáveis de contexto e condições ajuda na adoção

---

## Sessão 13 — Orchestrator Core Point 05

### Orchestrator deve ser coordenador, não executor

- A regra central é: Orchestrator NUNCA executa tarefas de domínio diretamente
- Ele apenas planeja, delega para agentes e consolida resultados
- Isso mantém separação de responsabilidades e facilita testes

### Planejamento baseado em regras funciona para MVP

- Usar keywords no objetivo para mapear agentes (ex: "qualific" → qualification agent)
- É simples, previsível e testável
- Planejamento com LLM pode ser adicionado depois como evolução

### Contexto separado evita vazamento de dados

- Global: dados de entrada do usuário
- Workflow: contexto compartilhado entre passos
- Agent: contexto privado de cada agente
- Essa separação é crítica para workflows multi-etapa

### Consolidação precisa tratar falhas parciais

- Status pode ser: completed (todos obrigatórios ok), failed (falhou obrigatório), partial (alguns opcionais falharam)
- Resumo legível ajuda na debugging e auditoria

### Observabilidade é obrigatória, não opcional

- Todo `orchestrate()` deve logar: objetivo, plano, passos, resultado, duração, tokens
- Formatação legível para console facilita desenvolvimento
- Estrutura de log pode ser expandida para persistência futura

---

## Sessão 14 — MCP and Integrations Point 06

### MCP tools stubs são úteis para MVP

- Implementar tools como stubs (sem APIs externas reais) permite validar a arquitetura
- Calendar stub simula disponibilidade e cria eventos locais
- Document stub gera Markdown/HTML sem dependência externa
- Esses stubs podem ser substituídos por implementações reais depois

### Retry logic é simples mas crítica

- `callToolWithRetry` implementa retry com delay configurável
- Importante para tools que podem falhar temporariamente
- Max retries e retry delay devem ser configuráveis por tool

### Integration layer resolve segredos de forma segura

- `resolveSecretReference` suporta `env:` para variáveis de ambiente
- Nunca persistir credenciais no banco
- Referências permitem flexibilidade sem comprometer segurança

### Execution logs são essenciais para auditoria

- Cada chamada de tool é logada com input, output, duração, erros
- Logs podem ser consultados por tool name
- Essa rastreabilidade é obrigatória para conformidade

### Base class simplifica criação de tools

- `BaseMCPTool`提供 helpers para criar resultados de sucesso/erro
- Tools concretas apenas implementam `definition()` e `execute()`
- Padrão consistente facilita manutenção

---

## Sessão 15 — Commercial Agents Point 07

### Agentes comerciais seguem padrão existente

- Todos os novos agentes estendem `AbstractAgent` e implementam `definition()`, `validate()`, `execute()`
- Validação com Zod mantém consistência
- Padrão identical ao LeadIntakeAgent e QualificationAgent

### Contratos de entrada/saída são documentados

- Cada agente define explicitamente input schema e output esperado
- Isso facilita integração com workflows e orchestrator
- Documentação da feature lista todos os contratos

### Limites de negócio são implementados no agente

- FollowUpAgent tem limite de 5 tentativas
- HumanHandoffAgent tem thresholds de prioridade
- Essas regras ficam encapsuladas no agente, não no workflow

### Mock db precisa ser expandido para novos modelos

- `document` e `leadEvent.findMany` foram adicionados ao mock
- Cada novo modelo que os agentes usam precisa de mock
- Padrão: verificar erros de teste primeiro, depois expandir mock

### Stubs para external APIs são aceitáveis no MVP

- ResearchAgent usa lógica local para enriquecimento
- DocumentAgent gera templates localmente
- CalendarAgent pode usar MCP tools ou lógica local
- Esses stubs podem ser substituídos por implementações reais depois

---

## Sessão 16 — Operations and Security Point 08

### Auth com API key e session tokens funciona sem banco

- Gerar e validar API keys com HMAC-SHA256 usando apenas `crypto` nativo do Node.js
- Session tokens são stateless: payload base64url + assinatura HMAC
- Armazenamento em Map em memória é aceitável para MVP; produção deve usar Redis ou banco

### RBAC granular facilita extensão futura

- Definir 20 permissões粒ares (ex: `leads:read`, `leads:write`, `leads:delete`) permite mapear exatamente o que cada role pode fazer
- `hasPermission`, `hasAnyPermission`, `hasAllPermissions` dão flexibilidade para checks compostos
- Adicionar um novo role é apenas incluir o array de permissões

### Mascaramento de PII deve ser a default para logs

- Funções `maskLogData` e `maskPII` aplicam estratégias diferentes por campo
- `message` → `[REDACTED]` (nunca logar conteúdo de mensagens)
- `token`/`password` → `full` masking
- `name`/`email`/`phone` → `partial` masking (preserva extremos para debugging)

### Governance com limites de ação previne abuso

- Limites por hora e por dia por tipo de ação (ex: max 50 execuções de agente/hora)
- Ações sensíveis (delete, settings) exigem aprovação humana via `ApprovalRequest`
- `evaluateAction` combina check de limite + criação de aprovação em uma chamada

### Secrets policy previne vazamento de credenciais

- Validação de `SecretReference` garante que locais proibidos (vault) são rejeitados
- `redactSecretsFromLog` usa regex para detectar e redact patterns comuns (Bearer, sk-, api_key=)
- Nunca deve haver segredos em texto plano em logs

### Dashboard metrics agregam dados de múltiplos modelos

- Queries Prisma com `count`, `groupBy` e `findMany` combinados para métricas
- Métricas de agentes incluem: total de runs, sucesso/falha, média de duração, tokens consumidos, runs por agente
- Mock do db.ts precisa de `count`, `groupBy`, `findMany` em todos os modelos usados

### Bug pre-existente: researchType não definido

- `src/lib/agents/research.ts:117` referenciava `researchType` (sem underscore) mas o parâmetro era `_researchType`
- Causava ReferenceError em runtime e erro de tipo no build
- Correção: remover o underscore do parâmetro
- Lição: parâmetros com underscore prefix indicam "intencionalmente não usado", mas se o código os usa, o underscore deve ser removido
