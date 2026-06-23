# 15 Rounds UX Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use compose:subagent (recommended) or compose:execute to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Orun.AI from functional MVP to professional-grade platform with polished UX, visual feedback, navigation, analytics, and complete features.

**Architecture:** Incremental improvements across 15 rounds. Each round is self-contained and can be committed independently. No breaking changes between rounds.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS v4, Prisma/SQLite, sonner (toasts), recharts (charts)

---

## Phase 1: Visual Foundation (Rounds 1-3)

### Task 1: Skeleton Loading Component

**Covers:** [S3]
**Files:** Create `src/components/ui/skeleton.tsx`

- [ ] Create skeleton component with pulse animation

```tsx
"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-surface-strong rounded-md",
        className
      )}
    />
  );
}
```

- [ ] Run lint: `npm run lint`
- [ ] Commit: `feat(ui): add skeleton loading component`

---

### Task 2: Dashboard Loading Skeleton

**Covers:** [S3]
**Files:** Create `src/app/(dashboard)/loading.tsx`

- [ ] Create dashboard skeleton matching the stat cards + activity layout

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-surface-card border border-hairline rounded-lg p-6">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
      <div className="bg-surface-card border border-hairline rounded-lg p-6">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] Run lint: `npm run lint`
- [ ] Commit: `feat(dashboard): add loading skeleton`

---

### Task 3: Install sonner Toast Library

**Covers:** [S4]
**Files:** `package.json`, `src/app/layout.tsx`

- [ ] Install sonner: `npm install sonner`
- [ ] Add Toaster to root layout

```tsx
// src/app/layout.tsx - add import and component
import { Toaster } from "sonner";

// Inside return, after {children}
<Toaster position="top-right" richColors />
```

- [ ] Run lint: `npm run lint`
- [ ] Commit: `feat(deps): add sonner toast library`

---

### Task 4: Add Toasts to Agent CRUD

**Covers:** [S4]
**Files:** `src/app/(dashboard)/agents/new/page.tsx`, `src/app/(dashboard)/agents/[id]/edit/page.tsx`

- [ ] Add toast success/error to agent new page

```tsx
// In agents/new/page.tsx, inside handleSubmit:
import { toast } from "sonner";

// After successful create:
toast.success("Agente criado com sucesso");

// On error:
toast.error(res.error || "Erro ao criar agente");
```

- [ ] Add toast success/error to agent edit page
- [ ] Run lint: `npm run lint`
- [ ] Commit: `feat(agents): add toast notifications`

---

### Task 5: Add Toasts to Lead CRUD

**Covers:** [S4]
**Files:** `src/app/(dashboard)/leads/new/page.tsx`, `src/app/(dashboard)/leads/[id]/edit/page.tsx`, `src/components/leads/lead-actions.tsx`

- [ ] Add toast to lead new/edit pages
- [ ] Add toast to lead archive/unarchive actions
- [ ] Add toast to lead delete action
- [ ] Run lint: `npm run lint`
- [ ] Commit: `feat(leads): add toast notifications`

---

### Task 6: Add Toasts to Conversations and Runs

**Covers:** [S4]
**Files:** `src/components/conversations/conversation-actions.tsx`, `src/app/(dashboard)/runs/page.tsx`

- [ ] Add toast to conversation archive/unarchive
- [ ] Add toast to agent execution success/failure
- [ ] Run lint: `npm run lint`
- [ ] Commit: `feat(conversations,runs): add toast notifications`

---

### Task 7: Error Boundary and 404

**Covers:** [S5]
**Files:** Create `src/app/(dashboard)/error.tsx`, `src/app/not-found.tsx`

- [ ] Create dashboard error boundary

```tsx
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <h2 className="text-xl font-semibold text-ink">Algo deu errado</h2>
      <p className="text-sm text-muted">{error.message}</p>
      <div className="flex gap-2">
        <Button onClick={reset} variant="secondary">Tentar novamente</Button>
        <Link href="/">
          <Button>Voltar ao Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
```

- [ ] Create custom 404 page

```tsx
// src/app/not-found.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <h1 className="text-6xl font-bold text-ink">404</h1>
      <h2 className="text-xl font-semibold text-ink">Página não encontrada</h2>
      <p className="text-sm text-muted">A página que você procura não existe ou foi movida.</p>
      <Link href="/">
        <Button>Voltar ao Dashboard</Button>
      </Link>
    </div>
  );
}
```

- [ ] Run lint: `npm run lint`
- [ ] Commit: `feat(errors): add error boundary and custom 404 page`

---

## Phase 2: Navigation (Rounds 4-6)

### Task 8: Breadcrumbs Component

**Covers:** [S6]
**Files:** Create `src/components/ui/breadcrumb.tsx`

- [ ] Create breadcrumb component

```tsx
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1 text-sm text-muted">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1">
          {index > 0 && <span className="text-muted-soft">/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-ink transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
```

- [ ] Run lint: `npm run lint`
- [ ] Commit: `feat(ui): add breadcrumb component`

---

### Task 9: Enhanced Topbar

**Covers:** [S7]
**Files:** `src/components/layout/topbar.tsx`

- [ ] Refactor topbar with page title, breadcrumbs slot, and user menu

```tsx
"use client";

import { usePathname } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";

// Route to title mapping
const routeTitles: Record<string, string> = {
  "/": "Dashboard",
  "/agents": "Agentes",
  "/agents/new": "Novo Agente",
  "/leads": "Leads",
  "/leads/new": "Novo Lead",
  "/conversations": "Conversas",
  "/runs": "Executar Agente",
  "/runs/history": "Histórico de Execuções",
};

export function Topbar({ onMenuToggle }: { onMenuToggle: () => void }) {
  const pathname = usePathname();

  // Generate breadcrumb items from pathname
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbItems = segments.map((segment, index) => ({
    label: routeTitles[`/${segments.slice(0, index + 1).join("/")}`] || segment,
    href: index < segments.length - 1 ? `/${segments.slice(0, index + 1).join("/")}` : undefined,
  }));

  return (
    <header className="sticky top-0 z-30 h-14 bg-canvas border-b border-hairline flex items-center px-4 lg:px-6">
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 -ml-2 text-muted hover:text-ink"
      >
        {/* Hamburger icon */}
      </button>

      <div className="flex-1 ml-4">
        <h1 className="text-lg font-semibold text-ink">
          {routeTitles[pathname] || "Orun.AI"}
        </h1>
        {breadcrumbItems.length > 1 && (
          <Breadcrumb items={breadcrumbItems} />
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Search trigger - Cmd+K */}
        <button className="p-2 text-muted hover:text-ink">
          {/* Search icon */}
        </button>
        {/* Notification bell */}
        <button className="p-2 text-muted hover:text-ink relative">
          {/* Bell icon */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-brand-pink rounded-full" />
        </button>
        {/* User avatar */}
        <div className="w-8 h-8 rounded-full bg-brand-lavender flex items-center justify-center text-sm font-medium text-ink">
          U
        </div>
      </div>
    </header>
  );
}
```

- [ ] Run lint: `npm run lint`
- [ ] Commit: `feat(layout): enhance topbar with title, breadcrumbs, and actions`

---

### Task 10: Command Palette (Global Search)

**Covers:** [S8]
**Files:** Create `src/components/ui/command-palette.tsx`, `src/components/layout/topbar.tsx`

- [ ] Create command palette component

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { searchLeads } from "@/app/actions/leads";
import { getAgents } from "@/app/actions/agents";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  type: "lead" | "agent" | "conversation";
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const router = useRouter();

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }

    const [leadsRes, agentsRes] = await Promise.all([
      searchLeads(q),
      getAgents(),
    ]);

    const searchResults: SearchResult[] = [];

    if (leadsRes.success) {
      leadsRes.data.forEach((lead) => {
        searchResults.push({
          id: lead.id,
          title: lead.name,
          subtitle: lead.email || lead.company || "",
          href: `/leads/${lead.id}`,
          type: "lead",
        });
      });
    }

    if (agentsRes.success) {
      agentsRes.data
        .filter((a) => a.name.toLowerCase().includes(q.toLowerCase()))
        .forEach((agent) => {
          searchResults.push({
            id: agent.id,
            title: agent.name,
            subtitle: agent.slug,
            href: `/agents/${agent.id}`,
            type: "agent",
          });
        });
    }

    setResults(searchResults);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  useEffect(() => {
    if (query) search(query);
  }, [query, search]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-[20vh]">
      <div className="bg-canvas border border-hairline rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <input
          type="text"
          placeholder="Buscar leads, agentes, conversas..."
          className="w-full px-4 py-3 border-b border-hairline bg-transparent text-ink focus:outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <div className="max-h-64 overflow-y-auto">
          {results.length === 0 && query.length >= 2 && (
            <p className="px-4 py-3 text-sm text-muted">Nenhum resultado encontrado</p>
          )}
          {results.map((result) => (
            <button
              key={result.id}
              className="w-full px-4 py-3 text-left hover:bg-surface-strong transition-colors flex items-center gap-3"
              onClick={() => {
                router.push(result.href);
                setOpen(false);
                setQuery("");
              }}
            >
              <span className="text-xs px-2 py-0.5 rounded bg-surface-strong text-muted uppercase">
                {result.type}
              </span>
              <div>
                <p className="text-sm font-medium text-ink">{result.title}</p>
                <p className="text-xs text-muted">{result.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] Add CommandPalette to root layout
- [ ] Add search button trigger in topbar
- [ ] Run lint: `npm run lint`
- [ ] Commit: `feat(search): add global command palette with Cmd+K`

---

## Phase 3: Dashboard Analytics (Rounds 7-8)

### Task 11: Install recharts

**Covers:** [S9]
**Files:** `package.json`

- [ ] Install recharts: `npm install recharts`
- [ ] Commit: `feat(deps): add recharts for dashboard charts`

---

### Task 12: Leads Over Time Chart

**Covers:** [S9]
**Files:** Create `src/components/dashboard/leads-over-time-chart.tsx`, `src/app/(dashboard)/page.tsx`

- [ ] Create line chart component for leads created over time

```tsx
"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DataPoint {
  date: string;
  count: number;
}

export function LeadsOverTimeChart({ data }: { data: DataPoint[] }) {
  return (
    <div className="bg-surface-card border border-hairline rounded-lg p-6">
      <h3 className="text-sm font-semibold text-ink mb-4">Leads por Período</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#1a3a3a" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

- [ ] Add server-side data fetching for chart in dashboard page
- [ ] Integrate chart into dashboard layout
- [ ] Run lint: `npm run lint`
- [ ] Commit: `feat(dashboard): add leads over time chart`

---

### Task 13: Agent Performance Chart

**Covers:** [S9]
**Files:** Create `src/components/dashboard/agent-performance-chart.tsx`

- [ ] Create bar chart for agent execution counts

```tsx
"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AgentData {
  name: string;
  runs: number;
}

export function AgentPerformanceChart({ data }: { data: AgentData[] }) {
  return (
    <div className="bg-surface-card border border-hairline rounded-lg p-6">
      <h3 className="text-sm font-semibold text-ink mb-4">Performance dos Agentes</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="runs" fill="#b8a4ed" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

- [ ] Add server-side data fetching for agent stats
- [ ] Integrate into dashboard
- [ ] Run lint: `npm run lint`
- [ ] Commit: `feat(dashboard): add agent performance chart`

---

### Task 14: Lead Status Pie Chart

**Covers:** [S9]
**Files:** Create `src/components/dashboard/lead-status-pie.tsx`

- [ ] Create pie chart for lead status distribution

```tsx
"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

interface StatusData {
  name: string;
  value: number;
}

const COLORS = ["#22c55e", "#1a3a3a", "#f59e0b", "#ef4444", "#b8a4ed"];

export function LeadStatusPie({ data }: { data: StatusData[] }) {
  return (
    <div className="bg-surface-card border border-hairline rounded-lg p-6">
      <h3 className="text-sm font-semibold text-ink mb-4">Distribuição de Status</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
```

- [ ] Add server-side data fetching for status counts
- [ ] Integrate into dashboard
- [ ] Run lint: `npm run lint`
- [ ] Commit: `feat(dashboard): add lead status pie chart`

---

### Task 15: Enhanced Activity Feed

**Covers:** [S10]
**Files:** Create `src/components/dashboard/activity-feed.tsx`, `src/app/(dashboard)/page.tsx`

- [ ] Create reusable activity feed component with icons per event type

```tsx
"use client";

interface ActivityEvent {
  id: string;
  type: string;
  leadName: string;
  createdAt: string;
}

const eventIcons: Record<string, string> = {
  created: "🆕",
  qualified: "✅",
  status_changed: "🔄",
  note: "📝",
  enriched: "📊",
  contacted: "📞",
};

export function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  return (
    <div className="bg-surface-card border border-hairline rounded-lg p-6">
      <h3 className="text-sm font-semibold text-ink mb-4">Atividade Recente</h3>
      {events.length === 0 ? (
        <p className="text-sm text-muted py-4">Nenhuma atividade recente.</p>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="flex items-center gap-3">
              <span className="text-lg">{eventIcons[event.type] || "📌"}</span>
              <div className="flex-1">
                <p className="text-sm text-ink">
                  <span className="font-medium">{event.leadName}</span>
                  {" — "}
                  <span className="text-muted">{event.type}</span>
                </p>
                <p className="text-xs text-muted-soft">{event.createdAt}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] Refactor dashboard page to use ActivityFeed component
- [ ] Add more event types from agent runs and conversations
- [ ] Run lint: `npm run lint`
- [ ] Commit: `feat(dashboard): enhance activity feed with icons and more events`

---

## Phase 4: Form Improvements (Round 9)

### Task 16: Fix Form Language to Portuguese

**Covers:** [S11]
**Files:** `src/app/(dashboard)/agents/new/page.tsx`, `src/app/(dashboard)/agents/[id]/edit/page.tsx`

- [ ] Translate all labels and buttons in agent forms to Portuguese
- [ ] Add `step="1"` to maxTokens input
- [ ] Add `min="1"` to maxTokens input
- [ ] Add `min="0"` and `max="2"` to temperature input
- [ ] Run lint: `npm run lint`
- [ ] Commit: `fix(agents): translate form labels to Portuguese and add input constraints`

---

### Task 17: Client-Side Validation for Lead Form

**Covers:** [S11]
**Files:** `src/components/leads/lead-form.tsx`

- [ ] Add inline validation errors using the Input component's error prop
- [ ] Validate name required, email format, phone format
- [ ] Show errors only after first submit attempt

```tsx
// Add validation state
const [errors, setErrors] = useState<Record<string, string>>({});
const [touched, setTouched] = useState(false);

function validate() {
  const newErrors: Record<string, string> = {};
  if (!form.name.trim()) newErrors.name = "Nome é obrigatório";
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    newErrors.email = "Email inválido";
  }
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
}

// Pass error prop to Input
<Input label="Nome" error={touched ? errors.name : undefined} ... />
```

- [ ] Run lint: `npm run lint`
- [ ] Commit: `feat(leads): add client-side validation with inline errors`

---

### Task 18: Remove Dead AgentForm Code

**Covers:** [S11]
**Files:** `src/components/agents/agent-form.tsx`

- [ ] Delete `src/components/agents/agent-form.tsx` (never imported, fakes submission)
- [ ] Run lint: `npm run lint`
- [ ] Commit: `chore(agents): remove unused AgentForm component`

---

## Phase 5: Features (Rounds 10-12)

### Task 19: Conversation Message Input

**Covers:** [S12]
**Files:** Create `src/components/conversations/message-input.tsx`, `src/app/(dashboard)/conversations/[id]/page.tsx`

- [ ] Create message input component

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addMessage } from "@/app/actions/conversations";
import { toast } from "sonner";

interface MessageInputProps {
  conversationId: string;
  onMessageSent: () => void;
}

export function MessageInput({ conversationId, onMessageSent }: MessageInputProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!content.trim()) return;
    setLoading(true);

    const result = await addMessage({
      conversationId,
      role: "assistant",
      content: content.trim(),
    });

    if (result.success) {
      toast.success("Mensagem enviada");
      setContent("");
      onMessageSent();
    } else {
      toast.error("Erro ao enviar mensagem");
    }

    setLoading(false);
  }

  return (
    <div className="flex gap-2 p-4 border-t border-hairline">
      <input
        type="text"
        placeholder="Digite sua mensagem..."
        className="flex-1 px-3 py-2 rounded-md border border-hairline bg-canvas text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        disabled={loading}
      />
      <Button onClick={handleSend} loading={loading} disabled={!content.trim()}>
        Enviar
      </Button>
    </div>
  );
}
```

- [ ] Add MessageInput to conversation detail page
- [ ] Add state refresh after message sent
- [ ] Run lint: `npm run lint`
- [ ] Commit: `feat(conversations): add message input to conversation detail`

---

### Task 20: Agent Execution Improvements

**Covers:** [S11]
**Files:** `src/app/(dashboard)/runs/page.tsx`

- [ ] Add loading indicator during lead search
- [ ] Add "Re-executar" button after successful execution
- [ ] Add confirmation dialog before executing

```tsx
// Add loading state for search
const [searching, setSearching] = useState(false);

// In doSearch:
setSearching(true);
const res = await searchLeads(query);
setSearching(false);

// Show spinner in dropdown when searching
{searching && (
  <div className="px-3 py-2 text-sm text-muted">Buscando...</div>
)}

// Add re-run button after completion
{status === "completed" && (
  <Button variant="secondary" onClick={handleRun}>
    Re-executar
  </Button>
)}
```

- [ ] Run lint: `npm run lint`
- [ ] Commit: `feat(runs): add search loading indicator and re-run button`

---

### Task 21: Settings Page Structure

**Covers:** [S12]
**Files:** Create `src/app/(dashboard)/settings/layout.tsx`, `src/app/(dashboard)/settings/page.tsx`

- [ ] Create settings layout with sidebar navigation

```tsx
// src/app/(dashboard)/settings/layout.tsx
import Link from "next/link";

const settingsNav = [
  { href: "/settings", label: "Geral" },
  { href: "/settings/profile", label: "Perfil" },
  { href: "/settings/integrations", label: "Integrações" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-6">
      <nav className="w-48 shrink-0">
        <div className="bg-surface-card border border-hairline rounded-lg p-4">
          <h2 className="text-sm font-semibold text-ink mb-3">Configurações</h2>
          <div className="space-y-1">
            {settingsNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 text-sm text-muted hover:text-ink hover:bg-surface-strong rounded-md transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <div className="flex-1">{children}</div>
    </div>
  );
}
```

- [ ] Create settings page
- [ ] Add Settings link to sidebar
- [ ] Run lint: `npm run lint`
- [ ] Commit: `feat(settings): add settings page structure`

---

## Phase 6: Polish (Rounds 13-15)

### Task 22: Pagination Component

**Covers:** [S13]
**Files:** Create `src/components/ui/pagination.tsx`

- [ ] Create pagination component

```tsx
interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1 text-sm rounded-md border border-hairline disabled:opacity-50 disabled:pointer-events-none hover:bg-surface-strong"
      >
        Anterior
      </button>
      <span className="text-sm text-muted">
        Página {page} de {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1 text-sm rounded-md border border-hairline disabled:opacity-50 disabled:pointer-events-none hover:bg-surface-strong"
      >
        Próximo
      </button>
    </div>
  );
}
```

- [ ] Run lint: `npm run lint`
- [ ] Commit: `feat(ui): add pagination component`

---

### Task 23: Add Pagination to Leads List

**Covers:** [S13]
**Files:** `src/app/(dashboard)/leads/page.tsx`

- [ ] Replace hardcoded page size with pagination state
- [ ] Add Pagination component
- [ ] Fetch page from server action

```tsx
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

async function loadLeads() {
  const res = await getLeads(page, 20, statusFilter);
  if (res.success) {
    setLeads(res.data.data);
    setTotalPages(res.data.totalPages);
  }
}

// Add pagination at bottom
<Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
```

- [ ] Run lint: `npm run lint`
- [ ] Commit: `feat(leads): add pagination to leads list`

---

### Task 24: Lead Detail Enhancements

**Covers:** [S14]
**Files:** `src/app/(dashboard)/leads/[id]/page.tsx`, `src/components/leads/lead-detail.tsx`

- [ ] Add "Executar Agente" button linking to runs page with lead preselected
- [ ] Add progress bar for qualification score
- [ ] Add relative timestamps for events

```tsx
// Add progress bar for score
{lead.qualificationScore !== null && (
  <div className="mt-2">
    <div className="flex justify-between text-xs text-muted mb-1">
      <span>Score de Qualificação</span>
      <span>{lead.qualificationScore}/100</span>
    </div>
    <div className="h-2 bg-surface-strong rounded-full overflow-hidden">
      <div
        className="h-full bg-brand-teal transition-all"
        style={{ width: `${lead.qualificationScore}%` }}
      />
    </div>
  </div>
)}

// Add Run Agent button
<Link href={`/runs?lead=${lead.id}`}>
  <Button size="sm">Executar Agente</Button>
</Link>
```

- [ ] Run lint: `npm run lint`
- [ ] Commit: `feat(leads): add score progress bar and run agent button`

---

### Task 25: Fix Portuguese Accents and revalidatePath

**Covers:** [S15]
**Files:** Multiple files

- [ ] Fix "aparecerao" → "aparecerão" in conversations page
- [ ] Fix revalidatePath("/dashboard") → revalidatePath("/") in all actions
- [ ] Update sidebar version from hardcoded "0.1.0" to read from package.json
- [ ] Run lint: `npm run lint`
- [ ] Commit: `fix: correct Portuguese accents and revalidatePath paths`

---

### Task 26: Final Lint, Build, and Version Bump

**Covers:** [S20]
**Files:** `package.json`

- [ ] Run full lint: `npm run lint`
- [ ] Run typecheck: `npm run typecheck`
- [ ] Run build: `npm run build`
- [ ] Bump version to 1.0.0 in package.json
- [ ] Create final commit: `chore(release): bump version to 1.0.0`

---

## Verification Checklist

After all tasks complete:

- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes
- [ ] All pages have skeleton loading
- [ ] All actions show toast notifications
- [ ] Error boundary works on dashboard
- [ ] 404 page shows for invalid routes
- [ ] Breadcrumbs show on nested routes
- [ ] Topbar shows page title and breadcrumbs
- [ ] Cmd+K opens command palette
- [ ] Dashboard shows charts
- [ ] Activity feed shows all event types
- [ ] Forms have Portuguese labels and validation
- [ ] Conversations allow message sending
- [ ] Runs have re-run button
- [ ] Settings page exists
- [ ] Lists have pagination
- [ ] Lead detail has score bar and run button
- [ ] No dead code remains
