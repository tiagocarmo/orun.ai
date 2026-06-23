# CLAUDE.md

Regras obrigatórias para o assistente seguir em todas as sessões.

**Autoload:** Este arquivo + `AGENTS.md` + `README.md` devem ser carregados em toda sessão.

---

## Autoload de Arquivos

Sempre carregar e considerar:
- `CLAUDE.md` — regras de código e convenções
- `AGENTS.md` — especificação do projeto, agentes, modelo de dados
- `README.md` — visão geral, stack, como rodar

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
