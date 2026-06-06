interface EmptyStateProps {
  title?: string;
  message?: string;
}

export function EmptyState({
  title = 'Sin resultados',
  message = 'No hay informacion disponible para mostrar.',
}: EmptyStateProps) {
  return (
    <div className="text-center text-secondary py-4">
      <h2 className="h6 text-body">{title}</h2>
      <p className="mb-0">{message}</p>
    </div>
  );
}
