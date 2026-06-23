# Design: 15 Rodadas de Aprimoramento Visual, Usabilidade e Funcionalidades

**Data:** 2026-06-23
**Versão:** 0.3.0 → 1.0.0 (estimativa)
**Escopo:** Melhorias completas de UX, visual, e funcionalidades

---

## [S1] Problema

O projeto Orun.AI tem uma base funcional sólida (CRUD de agents, leads, conversations, runs) mas apresenta gaps críticos de UX que impedem uso profissional:

- Zero feedback visual (toasts, loading skeletons, error boundaries)
- Navegação confusa em rotas aninhadas (sem breadcrumbs)
- Topbar praticamente vazia
- Dashboard sem visualização de dados
- Conversations sem envio de mensagens
- Formulários com idioma misto e código morto
- Sem busca global ou configurações

---

## [S2] Visão Geral das 15 Rodadas

| Rodada | Foco | Impacto |
|--------|------|---------|
| 1 | Skeleton Loading States | UX de carregamento |
| 2 | Toast Notification System | Feedback de ações |
| 3 | Error Boundaries & 404 | Resiliência |
| 4 | Breadcrumbs Component | Navegação |
| 5 | Enhanced Topbar | Navegação + utilidade |
| 6 | Global Search (Cmd+K) | Produtividade |
| 7 | Dashboard com Charts | Visualização de dados |
| 8 | Real-time Activity Feed | Visibilidade operacional |
| 9 | Form Validation & UX | Qualidade de formulários |
| 10 | Conversations Messaging UI | Funcionalidade core |
| 11 | Agent Execution Improvements | UX de execução |
| 12 | Settings Page | Configurações |
| 13 | Pagination | Performance + UX |
| 14 | Lead Detail Enhancements | Funcionalidade de leads |
| 15 | Polish & Consistency | Qualidade geral |

---

## [S3] Rodada 1: Skeleton Loading States

**Objetivo:** Eliminar tela branca durante carregamento de páginas server-side.

**Implementação:**
- Criar `src/components/ui/skeleton.tsx` — componente de skeleton com animação pulse
- Criar `src/app/(dashboard)/loading.tsx` — skeleton global para todas as rotas do dashboard
- Criar skeletons específicos para: dashboard (4 stat cards + activity feed), agents grid, leads table, conversations list, runs history

**Componentes:**
```tsx
// Skeleton genérico
<div className="animate-pulse bg-surface-strong rounded" style={{ width, height }} />

// Skeleton de card
<Skeleton className="h-24 w-full rounded-lg" />

// Skeleton de tabela
<Skeleton className="h-10 w-full" /> (repetir 5x)
```

**Arquivos:**
- `src/components/ui/skeleton.tsx` (novo)
- `src/app/(dashboard)/loading.tsx` (novo)

---

## [S4] Rodada 2: Toast Notification System

**Objetivo:** Feedback visual imediato para todas as ações do usuário.

**Implementação:**
- Instalar `sonner` (leve, moderno, sem dependências)
- Criar `src/components/ui/toast.tsx` — provider wrapper
- Adicionar toast de sucesso/erro em todas as server actions:
  - Criar/editar/excluir agent
  - Criar/editar/arquivar/excluir lead
  - Arquivar/desarquivar conversation
  - Executar agente (sucesso/erro)

**Padrão de uso:**
```tsx
import { toast } from "sonner";

// Sucesso
toast.success("Lead criado com sucesso");

// Erro
toast.error("Erro ao criar lead");

// Info
toast.info("Agente executado");
```

**Arquivos:**
- `src/app/layout.tsx` (adicionar `Toaster`)
- `src/app/(dashboard)/agents/new/page.tsx` (adicionar toasts)
- `src/app/(dashboard)/agents/[id]/edit/page.tsx` (adicionar toasts)
- `src/app/(dashboard)/leads/new/page.tsx` (adicionar toasts)
- `src/app/(dashboard)/leads/[id]/edit/page.tsx` (adicionar toasts)
- `src/components/leads/lead-actions.tsx` (adicionar toasts)
- `src/components/conversations/conversation-actions.tsx` (adicionar toasts)
- `src/app/(dashboard)/runs/page.tsx` (adicionar toasts)

---

## [S5] Rodada 3: Error Boundaries & 404

**Objetivo:** Tratar erros gracefulmente e mostrar 404 customizado.

**Implementação:**
- Criar `src/app/(dashboard)/error.tsx` — error boundary para rotas do dashboard
- Criar `src/app/not-found.tsx` — página 404 customizada
- Adicionar `try/catch` em server actions que não tratam erros

**Componente 404:**
```tsx
<EmptyState
  icon="🔍"
  title="Página não encontrada"
  description="A página que você procura não existe ou foi movida."
  action={<Link href="/"><Button>Voltar ao Dashboard</Button></Link>}
/>
```

**Arquivos:**
- `src/app/(dashboard)/error.tsx` (novo)
- `src/app/not-found.tsx` (novo)

---

## [S6] Rodada 4: Breadcrumbs Component

**Objetivo:** Mostrar hierarquia de navegação em rotas aninhadas.

**Implementação:**
- Criar `src/components/ui/breadcrumb.tsx`
- Integrar no topbar ou como componente independente
- Mapeamento de rotas:
  - `/leads` → "Leads"
  - `/leads/novo` → "Leads / Novo"
  - `/leads/[id]` → "Leads / [Nome do Lead]"
  - `/leads/[id]/editar` → "Leads / [Nome] / Editar"
  - `/agents` → "Agentes"
  - `/agents/novo` → "Agentes / Novo"
  - etc.

**Arquivos:**
- `src/components/ui/breadcrumb.tsx` (novo)
- `src/components/layout/topbar.tsx` (integrar breadcrumbs)

---

## [S7] Rodada 5: Enhanced Topbar

**Objetivo:** Tornar o topbar funcional e informativo.

**Implementação:**
- Adicionar título da página atual (dinâmico baseado na rota)
- Adicionar breadcrumbs (da Rodada 4)
- Adicionar ícone de notificações (campainha)
- Adicionar menu do usuário com dropdown
- Adicionar botão de busca global ( Cmd+K )

**Layout atual:**
```
[☰] .................................... [U]
```

**Layout proposto:**
```
[☰] Dashboard > Leads > Novo ........... [🔍] [🔔] [U ▾]
```

**Arquivos:**
- `src/components/layout/topbar.tsx` (refatorar)

---

## [S8] Rodada 6: Global Search (Cmd+K)

**Objetivo:** Busca rápida em qualquer lugar do app.

**Implementação:**
- Criar `src/components/ui/command-palette.tsx`
- Buscar em: leads (nome, email, empresa), agents (nome), conversations (título)
- Atalho: `Cmd+K` (Mac) / `Ctrl+K` (Windows)
- Resultados com navegação por teclado
- Ícone de busca no topbar que abre o palette

**Funcionalidades:**
- Busca em tempo real (debounce 300ms)
- Resultados agrupados por tipo (Leads, Agentes, Conversas)
- Navegação por setas + Enter para selecionar
- Escape para fechar

**Arquivos:**
- `src/components/ui/command-palette.tsx` (novo)
- `src/components/layout/topbar.tsx` (adicionar trigger)
- `src/app/layout.tsx` (adicionar provider)

---

## [S9] Rodada 7: Dashboard com Charts

**Objetivo:** Visualização profissional de dados no dashboard.

**Implementação:**
- Instalar `recharts` (biblioteca React nativa)
- Criar componentes de gráfico:
  - `LeadsOverTimeChart` — linha temporal de leads criados
  - `AgentPerformanceChart` — barras de execuções por agente
  - `ConversionFunnel` — funil de qualificação
  - `LeadStatusPie` — pizza de status dos leads

**Layout do Dashboard proposto:**
```
[Total Leads] [Qualified] [Active Agents] [Runs]
[Leads Over Time Chart        ] [Agent Performance]
[Conversion Funnel            ] [Recent Activity   ]
```

**Arquivos:**
- `src/components/dashboard/leads-over-time-chart.tsx` (novo)
- `src/components/dashboard/agent-performance-chart.tsx` (novo)
- `src/components/dashboard/conversion-funnel.tsx` (novo)
- `src/components/dashboard/lead-status-pie.tsx` (novo)
- `src/app/(dashboard)/page.tsx` (integrar gráficos)

---

## [S10] Rodada 8: Real-time Activity Feed

**Objetivo:** Feed de atividade completo e em tempo real.

**Implementação:**
- Expandir tipos de eventos exibidos:
  - Lead criado, qualificado, convertido
  - Agente executado (sucesso/erro)
  - Conversa criada, arquivada
- Adicionar auto-refresh a cada 30 segundos
- Adicionar ícone por tipo de evento
- Adicionar link para detalhes

**Arquivos:**
- `src/app/(dashboard)/page.tsx` (expandir activity feed)
- `src/components/dashboard/activity-feed.tsx` (novo, componentizar)

---

## [S11] Rodada 9: Form Validation & UX

**Objetivo:** Formulários com validação visual e idioma consistente.

**Implementação:**
- Unificar idioma para português em todos os formulários
- Adicionar validação client-side com erros inline
- Corrigir/remover componente `AgentForm` morto
- Adicionar `step="1"` no campo maxTokens
- Adicionar placeholders consistentes

**Campos que precisam de validação inline:**
- Nome: obrigatório, min 1 caractere
- Email: formato válido
- Telefone: formato válido
- Max Tokens: número inteiro, min 1
- Temperature: número, 0-2
- Prompt: obrigatório

**Arquivos:**
- `src/app/(dashboard)/agents/new/page.tsx` (validação + PT-BR)
- `src/app/(dashboard)/agents/[id]/edit/page.tsx` (validação + PT-BR)
- `src/components/leads/lead-form.tsx` (validação inline)
- `src/components/agents/agent-form.tsx` (remover ou corrigir)

---

## [S12] Rodada 10: Conversations Messaging UI

**Objetivo:** Permitir envio de mensagens nas conversas.

**Implementação:**
- Adicionar campo de input na página de detalhe da conversa
- Adicionar botão "Enviar"
- Chamar `addMessage` server action
- Auto-scroll para baixo após enviar
- Mostrar mensagem enviada imediatamente (optimistic update)

**Layout da conversa proposto:**
```
[Header: Título + Status + Lead]
[=============================]
[Message Thread               ]
[=============================]
[Input: Digite sua mensagem..] [Enviar]
```

**Arquivos:**
- `src/app/(dashboard)/conversations/[id]/page.tsx` (adicionar input)
- `src/components/conversations/message-input.tsx` (novo)

---

## [S13] Rodada 11: Agent Execution Improvements

**Objetivo:** Melhorar UX de execução de agentes.

**Implementação:**
- Adicionar botão "Re-executar" nos resultados
- Adicionar preview dos parâmetros antes de executar
- Adicionar link para histórico de execuções
- Adicionar loading indicator durante busca de leads
- Adicionar confirmação antes de executar agentes destrutivos

**Arquivos:**
- `src/app/(dashboard)/runs/page.tsx` (melhorias)

---

## [S14] Rodada 12: Settings Page

**Objetivo:** Página de configurações da plataforma.

**Implementação:**
- Criar layout de settings com sidebar interna
- Seções:
  - **Perfil** — nome, email, avatar
  - **Integrações** — webhooks, MCP, APIs externas
  - **Chaves de API** — gerenciamento de tokens
  - **Preferências** — idioma, tema, notificações

**Arquivos:**
- `src/app/(dashboard)/settings/layout.tsx` (novo)
- `src/app/(dashboard)/settings/page.tsx` (novo)
- `src/app/(dashboard)/settings/profile/page.tsx` (novo)
- `src/app/(dashboard)/settings/integrations/page.tsx` (novo)
- `src/components/layout/sidebar.tsx` (adicionar link Settings)

---

## [S15] Rodada 13: Pagination

**Objetivo:** Paginação em todas as listas para performance.

**Implementação:**
- Criar componente `Pagination` reutilizável
- Adicionar em:
  - Leads list (substituir hardcoded page size 100)
  - Conversations list
  - Runs history
- Paginação com botões Anterior/Próximo + indicador de página

**Arquivos:**
- `src/components/ui/pagination.tsx` (novo)
- `src/app/(dashboard)/leads/page.tsx` (integrar)
- `src/app/(dashboard)/conversations/page.tsx` (integrar)
- `src/app/(dashboard)/runs/history/page.tsx` (integrar)

---

## [S16] Rodada 14: Lead Detail Enhancements

**Objetivo:** Melhorar a página de detalhe do lead.

**Implementação:**
- Adicionar botão "Executar Agente" no lead detail
- Adicionar barra de progresso para qualification score
- Adicionar timestamps relativos nos eventos
- Adicionar conversas relacionadas ao lead

**Arquivos:**
- `src/app/(dashboard)/leads/[id]/page.tsx` (melhorias)
- `src/components/leads/lead-detail.tsx` (melhorias)

---

## [S17] Rodada 15: Polish & Consistency

**Objetivo:** Limpeza e consistência final.

**Implementação:**
- Corrigir acentos portugueses (aparecerao → aparecerão)
- Corrigir `revalidatePath` (("/dashboard") → ("/"))
- Remover código morto (`AgentForm` não utilizado)
- Padronizar loading states (usar `LoadingSpinner`/`LoadingPage`)
- Atualizar versão na sidebar (hardcoded 0.1.0 → package.json)
- Adicionar `step="1"` em campos numéricos

**Arquivos:**
- Múltiplos arquivos (correções pontuais)

---

## [S18] Dependências

**Novas dependências npm:**
```json
{
  "sonner": "^2.0.0",
  "recharts": "^2.15.0"
}
```

**Total estimado:** ~40 arquivos modificados/criados

---

## [S19] Ordem de Implementação

Recomendado implementar em ordem para minimizar conflitos:

1. **Foundation** (Rodadas 1-3): Skeleton, Toast, Errors
2. **Navigation** (Rodadas 4-6): Breadcrumbs, Topbar, Search
3. **Dashboard** (Rodadas 7-8): Charts, Activity Feed
4. **Forms** (Rodada 9): Validation & UX
5. **Features** (Rodadas 10-12): Messaging, Execution, Settings
6. **Polish** (Rodadas 13-15): Pagination, Lead Detail, Consistency

---

## [S20] Critérios de Aceite

- [ ] Todas as páginas têm skeleton loading
- [ ] Todas as ações mostram toast de sucesso/erro
- [ ] Erros são tratados gracefulmente
- [ ] Breadcrumbs funcionam em todas as rotas aninhadas
- [ ] Topbar mostra título + breadcrumbs + busca + notificações
- [ ] Cmd+K abre busca global
- [ ] Dashboard mostra gráficos interativos
- [ ] Activity feed mostra todos os tipos de eventos
- [ ] Formulários têm validação inline em português
- [ ] Conversas permitem envio de mensagens
- [ ] Runs permitem re-execução
- [ ] Settings page existe com pelo menos perfil
- [ ] Listas têm paginação
- [ ] Lead detail tem barra de score e botão executar
- [ ] Código morto removido, acentos corrigidos, consistência garantida
