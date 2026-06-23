"use client";

interface TopbarProps {
  onMenuToggle: () => void;
}

export function Topbar({ onMenuToggle }: TopbarProps) {
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

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-brand-lavender/30 flex items-center justify-center">
          <span className="text-brand-teal font-medium text-sm">U</span>
        </div>
      </div>
    </header>
  );
}
