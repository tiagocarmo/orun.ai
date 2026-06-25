# CLAUDE.md

Regras obrigatórias para o assistente seguir em todas as sessões.

**Autoload:** Este arquivo + `AGENTS.md` + `README.md` devem ser carregados em toda sessão.

---

## Autoload de Arquivos

Sempre carregar e considerar:
- `CLAUDE.md` — regras de código e convenções
- `AGENTS.md` — especificação do projeto, agentes, modelo de dados
- `README.md` — visão geral, stack, como rodar

## Fontes Canônicas do Projeto

Para decisões de produto e arquitetura, usar esta ordem:

1. `README.md` — visão consolidada e ponto de entrada
2. `docs/prd.md` — requisitos e escopo de produto
3. `AGENTS.md` — contratos e regras dos agentes
4. `docs/workflows.md` — fluxos oficiais
5. `docs/orchestrator.md` — coordenação, contexto e MCP
6. `DESIGN.md` — identidade e princípios visuais

Quando houver divergência, atualizar os documentos canônicos e registrar a decisão na documentação da feature.

---

## Planejamento Obrigatório

**Toda tarefa de planejamento DEVE usar a skill `tlc-spec-driven`.**

- Carregar a skill de `.agents/skills/tlc-spec-driven/SKILL.md` antes de qualquer planejamento
- Avaliar complexidade (Small/Medium/Large/Complex)
- Seguir as fases: Specify → Design → Tasks → Execute
- Criar estrutura em `.specs/features/[nome]/`

---

## Guardrails Para Chamada de Agentes e Tools

> **Antes de qualquer chamada de tool: CARREGAR a skill `agent-delegation`.**

### ⛔ Quick Copy — Templates Prontos

**actor — Run:**
```json
{ "operation": { "action": "run", "subagent_type": "explore", "description": "find errors", "prompt": "Search for..." } }
```

**actor — Run com timeout:**
```json
{ "operation": { "action": "run", "subagent_type": "explore", "description": "deep analysis", "prompt": "Analyze...", "timeout_ms": 300000 } }
```

**task — Create:**
```json
{ "operation": { "action": "create", "summary": "Task description" } }
```

### ⛔ REGRA DE OURO

**`operation` é SEMPRE um objeto `{}` com campo `action`. NUNCA string.**

Errado:
```
actor({ operation: "run", subagent_type: "explore" })          // ❌ operation é string
actor({ operation: "run", timeout_ms: 5000 })                  // ❌ timeout_ms na raiz
task({ operation: "create", summary: "..." })                  // ❌ operation é string
```

Correto:
```
actor({ operation: { action: "run", subagent_type: "explore" } })                    // ✅
actor({ operation: { action: "run", timeout_ms: 5000 } })                            // ✅ timeout dentro
task({ operation: { action: "create", summary: "..." } })                             // ✅
```

### Checklist obrigatório antes de QUALQUER chamada de tool

1. `operation` é um **objeto** `{}` com campo `action`? → SIM, sempre
2. Todos os campos extras estão **dentro** de `operation`? → timeout_ms, summary, id, etc.
3. Li a skill `.agents/skills/agent-delegation/SKILL.md`? → Ler antes de cada chamada

### Em caso de erro: NÃO RETENTAR

Se receber `expected object, received string`:
1. **PARE** — Não tente novamente com o mesmo formato
2. **LEIA** a skill `agent-delegation`
3. **CORRIJA** o formato: `operation` deve ser `{ action: "...", ... }`
4. **RETENTE** com o formato corrigido

---

## Finalização de Toda Tarefa

Ao concluir qualquer tarefa, obrigatoriamente:

1. **Rodar testes:** `npm test`
2. **Rodar build:** `npm run build`
3. **Rodar lint:** `npm run lint`
4. **Rodar typecheck:** `npm run typecheck`
5. **Validar página inicial:** Verificar se `localhost:3000` carrega corretamente (quando aplicável)
6. **Versionar:** Atualizar versão no `package.json` conforme semver
7. **Documentar aprendizados:** Atualizar `.mimocode/learning.md`
8. **Documentar sessão:** Salvar em `.mimocode/session/{{SESSION_ID}}.md`
9. **Commit:** Usar Conventional Commits

---

## Commits

Usar **Conventional Commits** (https://www.conventionalcommits.org/en/v1.0.0/):

```
<type>(<scope>): <descrição curta>

[corpo opcional]

[footer opcional]
```

**Tipos permitidos:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`

**Exemplos:**
- `feat(leads): adicionar qualificação automática`
- `fix(agents): corrigir timeout na execução`
- `docs: atualizar README com novos endpoints`
- `test(qualification): adicionar testes para scoring`

---

## Versioning

Usar **Semantic Versioning 2.0.0** (https://semver.org/):

- **MAJOR** — mudanças incompatíveis na API
- **MINOR** — funcionalidade backwards-compatible
- **PATCH** — correções de bug

Atualizar `package.json` version quando aplicável.

---

## Testes

- Todo código novo DEVE ter testes
- Usar mocks para entidades, promises e conexões externas
- Testes devem cobrir o caso de uso principal
- Rodar testes antes de commit: `npm test` ou comando equivalente

---

## Documentação

- Atualizar `README.md` quando mudar funcionalidades
- Criar/atualizar `docs/features/{NOME}.md` para features novas
- Manter documentação de API atualizada

---

## Ajuda das Telas

Toda tela do dashboard deve ter conteúdo de ajuda acessível pelo botão `?` no topbar.

### Regra

Ao criar ou modificar uma tela, **incluir ou atualizar** o conteúdo de ajuda em `src/lib/help-content.ts`.

### Formato do conteúdo

```typescript
"/rota-da-tela": {
  title: "Nome da Tela",
  content: (
    <div className="space-y-3">
      <h3 className="font-medium text-ink">O que é</h3>
      <p className="text-muted">Descrição da funcionalidade da tela.</p>
      <h3 className="font-medium text-ink">Como usar</h3>
      <ul className="list-disc list-inside space-y-1 text-muted">
        <li>Instrução 1</li>
        <li>Instrução 2</li>
        <li>Instrução 3</li>
      </ul>
    </div>
  ),
},
```

### Checklist

- [ ] Conteúdo adicionado ou atualizado em `src/lib/help-content.ts`
- [ ] Seção "O que é" com 1-2 frases explicando a tela
- [ ] Seção "Como usar" com 3-5 bullets de instruções
- [ ] Testar: botão `?` aparece e modal abre com conteúdo correto

---

## Código

- TypeScript em todo o projeto
- Seguir padrões existentes no codebase
- Não adicionar comentários desnecessários
- Não adicionar features além do solicitado
- Usar Prisma para banco de dados
- SQLite no MVP, mas projetar para migração futura

---

## Segurança

- Nunca salvar chaves de API no banco
- Usar variáveis de ambiente para segredos
- Mascarar dados sensíveis em logs

---

## Estrutura

Seguir a estrutura de pastas definida em `AGENTS.md`. Priorizar organização por domínio (agents, leads, workflows).

---

## Lint/Typecheck

Rodar antes de finalizar qualquer tarefa:
```bash
npm run lint
npm run typecheck
```
Se não existir, perguntar ao usuário qual comando usar.
