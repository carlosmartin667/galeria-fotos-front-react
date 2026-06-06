import { EmptyState } from '@/shared/components/EmptyState';
import { StatusBadge } from './AdminPrimitives';

export interface AdminColumn<T> { header: string; render: (row: T) => React.ReactNode; }

export function AdminTable<T extends { id?: string }>({ rows, columns, caption }: { rows: T[]; columns: Array<AdminColumn<T>>; caption?: string }) {
  if (rows.length === 0) return <EmptyState title="Sin registros" />;
  return <div className="card border-0 shadow-sm"><div className="table-responsive"><table className="table table-sm align-middle mb-0">{caption ? <caption className="visually-hidden">{caption}</caption> : null}<thead><tr>{columns.map((c) => <th key={c.header} scope="col">{c.header}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={row.id ?? index}>{columns.map((c) => <td key={c.header}>{c.render(row)}</td>)}</tr>)}</tbody></table></div></div>;
}

export function defaultAdminColumns<T extends { nombre?: string; titulo?: string; estado?: string; activo?: boolean }>(): Array<AdminColumn<T>> {
  return [
    { header: 'Nombre', render: (row) => row.nombre ?? row.titulo ?? '-' },
    { header: 'Estado', render: (row) => <StatusBadge value={row.estado ?? row.activo} /> },
  ];
}
