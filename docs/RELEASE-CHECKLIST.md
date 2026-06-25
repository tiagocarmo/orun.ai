# Release Checklist — Orun.AI v1.5.x

Checklist de go/no-go para releases do projeto.

---

## Go/No-Go Criteria

### ✅ Must Pass (Bloqueadores)

| Item | Status | Notas |
|------|--------|-------|
| `npm run lint` sem erros | ✅ | Passou |
| `npm run typecheck` sem erros | ✅ | Passou |
| `npm test` — todos os testes passam | ✅ | 155/155 |
| `npm run build` — build de produção OK | ✅ | 15 rotas compiladas |
| Schema Prisma consistente | ✅ | 13 modelos, migration aplicada |
| `.env.example` com todas as variáveis | ✅ | 5 variáveis documentadas |
| README.md com instruções de setup | ✅ | Completo |
| Nenhum TODO/FIXME/HACK no código | ✅ | Limpo |

### ⚠️ Should Fix (Recomendado antes de deploy)

| Item | Status | Notas |
|------|--------|-------|
| `console.log` em produção | ⚠️ | `orchestrator.ts:25` — logging intencional |
| TODO.md com erros antigos | ⚠️ | Erro `deletedAt` pode estar resolvido |
| Codex report desatualizado | ⚠️ | Reflete estado anterior (sem testes) |
| docs/OPERATIONS.md | ✅ | Criado nesta sessão |

### ❌ Known Limitations (Não bloqueiam release MVP)

| Item | Impacto |
|------|---------|
| SQLite como banco (não PostgreSQL) | Limitação do MVP, aceitável |
| MCP tools são stubs | Contratos definidos, sem integração real |
| Integracao com LLM depende de API key | Esperado para MVP |
| Sem billing/multi-tenant | Fora do escopo inicial |

---

## Pré-Deploy Checklist

1. [ ] Configurar variáveis de ambiente em produção
2. [ ] Rodar `npm run db:deploy` para migrations
3. [ ] Rodar `npm run db:seed` (se dados iniciais necessários)
4. [ ] Rodar `npm run build` e verificar output
5. [ ] Testar fluxo principal: criar lead → qualificar → ver no dashboard
6. [ ] Verificar que webhooks respondem corretamente
7. [ ] Confirmar que logs de execução aparecem na tabela `AgentRun`

---

## Versão Atual

- **Versão:** 1.5.1
- **Data da auditoria:** 2026-06-25
- **Testes:** 155 passing
- **Build:** OK
- **Lint:** OK
- **Typecheck:** OK

---

## Próximos Passos Recomendados

1. Resolver `console.log` do orchestrator (usar sistema de logs)
2. Atualizar codex report com estado atual (testes existem, MVP estabilizado)
3. Atualizar TODO.md — verificar se erro `deletedAt` persiste
4. Considerar deploy controlado para validação
5. Definir ciclo de release recorrente (sprint/quincenal)
