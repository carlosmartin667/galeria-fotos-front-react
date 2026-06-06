export function PaginationControls({ page, pageSize, total, onPageChange }: { page: number; pageSize: number; total?: number; onPageChange: (page: number) => void }) {
  const totalPages = total && pageSize > 0 ? Math.max(1, Math.ceil(total / pageSize)) : undefined;
  return (
    <nav className="d-flex align-items-center gap-2 mt-3" aria-label="Paginacion">
      <button className="btn btn-outline-dark btn-sm" type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Anterior</button>
      <span className="small text-secondary">Pagina {page}{totalPages ? ` de ${totalPages}` : ''}</span>
      <button className="btn btn-outline-dark btn-sm" type="button" disabled={Boolean(totalPages && page >= totalPages)} onClick={() => onPageChange(page + 1)}>Siguiente</button>
    </nav>
  );
}
