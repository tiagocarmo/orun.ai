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

- Carregar a skill antes de qualquer planejamento
- Avaliar complexidade (Small/Medium/Large/Complex)
- Seguir as fases: Specify → Design → Tasks → Execute
- Criar estrutura em `.specs/features/[nome]/`

---

## Guardrails Para Chamada de Agentes e Tools

Quando houver delegação para agentes, actor tools, MCP tools ou qualquer ferramenta com schema definido:

- Ler o contrato de entrada antes da chamada
- Enviar somente chaves reconhecidas pelo schema
- Conferir tipos antes de delegar
- Não promover campos auxiliares para a raiz do payload sem suporte explícito
- Tratar `context`, `timeout_ms`, `metadata` e similares como suspeitos até confirmação no schema

### Regra prática obrigatória

Se um campo como `operation` existir, ele deve ser enviado exatamente no tipo esperado pela ferramenta. Se o schema pedir `object`, enviar string é erro de invocação e deve ser corrigido antes da execução.

### Checklist antes de delegar

1. O nome de cada chave existe no schema?
2. O tipo de cada valor confere com o schema?
3. Há chaves extras na raiz do payload?
4. O payload representa a operação real sem wrappers inventados?

Se qualquer resposta for "não", corrigir antes da chamada.

### Interpretação do erro já ocorrido

O erro abaixo deve ser tratado como falha de montagem do payload:

- `operation`: esperado `object`, recebido `string`
- `timeout_ms` e `context`: chaves não reconhecidas

Conclusão obrigatória: não reenviar por tentativa e erro. Reconsultar o schema e reconstruir a chamada.

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
