import { sanitizeSensitiveText } from '@/shared/utils/sensitiveText';

const sensitiveMetadataKey = /token|password|apikey|bearer|storagekey|marcaaguastoragekey|signedurl|secret/i;

function omitSensitiveMetadataKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(omitSensitiveMetadataKeys);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([key]) => !sensitiveMetadataKey.test(key))
        .map(([key, nested]) => [key, omitSensitiveMetadataKeys(nested)]),
    );
  }

  return value;
}

export function AdminPageHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return <div className="d-flex justify-content-between align-items-start gap-3 mb-3"><div><h1 className="h3">{title}</h1>{description ? <p className="text-secondary mb-0">{description}</p> : null}</div>{action}</div>;
}

export function AdminFiltersBar({ children }: { children: React.ReactNode }) {
  return <div className="card border-0 shadow-sm mb-3"><div className="card-body d-flex flex-wrap gap-2">{children}</div></div>;
}

export function StatusBadge({ value }: { value?: string | boolean }) {
  const label = typeof value === 'boolean' ? (value ? 'Activo' : 'Inactivo') : value || 'Sin estado';
  return <span className="badge text-bg-secondary">{label}</span>;
}

export function MoneyValue({ value }: { value?: number }) {
  return <span>${Number(value ?? 0).toLocaleString('es-AR')}</span>;
}

export function DateValue({ value }: { value?: string }) {
  return <span>{value ? new Date(value).toLocaleDateString('es-AR') : '-'}</span>;
}

export function SanitizedMetadata({ value }: { value: unknown }) {
  return <code>{sanitizeSensitiveText(omitSensitiveMetadataKeys(value))}</code>;
}

export function ConfirmActionButton({ children, onConfirm, className = 'btn btn-sm btn-outline-danger' }: { children: React.ReactNode; onConfirm: () => void; className?: string }) {
  return <button className={className} type="button" onClick={() => window.confirm('Confirmar accion') && onConfirm()}>{children}</button>;
}

export function AdminFormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="card border-0 shadow-sm mb-3"><div className="card-body"><h2 className="h5">{title}</h2>{children}</div></section>;
}
