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
