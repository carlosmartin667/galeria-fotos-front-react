interface ErrorStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function ErrorState({
  title = 'No pudimos cargar esta seccion.',
  message = 'Ocurrio un error inesperado. Proba nuevamente.',
  actionLabel,
  onAction,
}: ErrorStateProps) {
  return (
    <div className="alert alert-danger" role="alert">
      <h2 className="h6">{title}</h2>
      <p className="mb-0">{message}</p>
      {actionLabel && onAction ? (
        <button className="btn btn-outline-danger btn-sm mt-3" type="button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
