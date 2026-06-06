export function LoadingState({ label = 'Cargando...' }: { label?: string }) {
  return (
    <div className="d-flex align-items-center justify-content-center py-5" role="status" aria-live="polite">
      <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
