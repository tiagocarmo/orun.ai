"use client";

import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { CommandPalette } from "@/components/ui/command-palette";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const openPalette = useCallback(() => setCommandPaletteOpen(true), []);
  const closePalette = useCallback(() => setCommandPaletteOpen(false), []);

  useEffect(() => {
    function handleOpen() {
      setCommandPaletteOpen(true);
    }
    document.addEventListener("open-command-palette", handleOpen);
    return () => document.removeEventListener("open-command-palette", handleOpen);
  }, []);

  return (
    <div className="flex h-screen bg-canvas overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-64 overflow-y-auto">
        <Topbar
          onMenuToggle={() => setSidebarOpen((prev) => !prev)}
          onSearchOpen={openPalette}
        />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>

      <CommandPalette open={commandPaletteOpen} onClose={closePalette} />
    </div>
  );
}
