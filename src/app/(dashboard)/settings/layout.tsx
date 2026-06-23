import Link from "next/link";

const settingsNav = [
  { href: "/settings", label: "Geral" },
  { href: "/settings/profile", label: "Perfil" },
  { href: "/settings/integrations", label: "Integracoes" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-6">
      <nav className="w-48 shrink-0">
        <div className="bg-surface-card border border-hairline rounded-lg p-4">
          <h2 className="text-sm font-semibold text-ink mb-3">Configuracoes</h2>
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
