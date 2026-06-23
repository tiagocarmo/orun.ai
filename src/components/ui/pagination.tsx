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
