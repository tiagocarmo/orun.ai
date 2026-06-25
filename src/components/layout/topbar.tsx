"use client";

import { usePathname } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { HelpButton } from "@/components/ui/help-button";

interface TopbarProps {
  onMenuToggle: () => void;
  onSearchOpen?: () => void;
}

const routeTitles: Record<string, string> = {
  "/": "Painel",
  "/agents": "Agentes",
  "/agents/new": "Novo Agente",
  "/leads": "Leads",
  "/leads/new": "Novo Lead",
  "/conversations": "Conversas",
  "/runs": "Executar Agente",
  "/runs/history": "Histórico de Execuções",
};

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs = [{ label: "Home", href: "/" }];

  let currentPath = "";
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const title = routeTitles[currentPath];
    crumbs.push({
      label: title || segment.charAt(0).toUpperCase() + segment.slice(1),
      href: currentPath,
    });
  }

  return crumbs;
}

export function Topbar({ onMenuToggle, onSearchOpen }: TopbarProps) {
  const pathname = usePathname();
  const title = routeTitles[pathname] || "Orun.AI";
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <header className="sticky top-0 z-30 flex items-center h-14 px-4 bg-canvas border-b border-hairline lg:px-6">
      <button
        type="button"
        onClick={onMenuToggle}
        className="p-2 rounded-md text-muted hover:text-ink hover:bg-surface-soft lg:hidden"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      <div className="flex-1 ml-2 lg:ml-0">
        <h1 className="text-lg font-semibold text-ink">{title}</h1>
        <Breadcrumb items={breadcrumbs} />
      </div>

      <div className="flex items-center gap-2">
        {onSearchOpen && (
          <button
            type="button"
            onClick={onSearchOpen}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-hairline bg-surface-soft text-muted hover:text-ink text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <span className="hidden sm:inline">Buscar...</span>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-xs font-mono text-muted-soft border border-hairline rounded">
              ⌘K
            </kbd>
          </button>
        )}

        <HelpButton />

        <button
          type="button"
          className="relative p-2 rounded-md text-muted hover:text-ink hover:bg-surface-soft transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
        </button>

        <div className="w-8 h-8 rounded-full bg-brand-lavender/30 flex items-center justify-center">
          <span className="text-brand-teal font-medium text-sm">U</span>
        </div>
      </div>
    </header>
  );
}
