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
