import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getBitacora, getBitacoraResumen, type BitacoraFilters } from './adminService';

function asItems(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) {
    return data as Record<string, unknown>[];
  }
  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    const items = record.items ?? record.data ?? record.resultados;
    return Array.isArray(items) ? (items as Record<string, unknown>[]) : [];
  }
  return [];
}

export function AdminBitacoraPage() {
  const [filters, setFilters] = useState<BitacoraFilters>({});
  const [draft, setDraft] = useState<BitacoraFilters>({});
  const bitacora = useQuery({ queryKey: ['bitacora', filters], queryFn: () => getBitacora(filters) });
  const resumen = useQuery({ queryKey: ['bitacora-resumen'], queryFn: getBitacoraResumen });
  const rows = asItems(bitacora.data);

  return (
    <section>
      <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
        <div>
          <h1 className="h3">Bitacora</h1>
          <p className="text-secondary mb-0">Auditoria administrativa con metadata sanitizada.</p>
        </div>
      </div>

      <form
        className="card border-0 shadow-sm mb-3"
        onSubmit={(event) => {
          event.preventDefault();
          setFilters(draft);
        }}
      >
        <div className="card-body row g-3 align-items-end">
          <div className="col-12 col-md-4">
            <label className="form-label" htmlFor="usuarioEmail">
              Usuario email
            </label>
            <input
              className="form-control"
              id="usuarioEmail"
              value={draft.usuarioEmail ?? ''}
              onChange={(event) => setDraft((current) => ({ ...current, usuarioEmail: event.target.value }))}
            />
          </div>
          <div className="col-12 col-md-3">
            <label className="form-label" htmlFor="accion">
              Accion
            </label>
            <input
              className="form-control"
              id="accion"
              value={draft.accion ?? ''}
              onChange={(event) => setDraft((current) => ({ ...current, accion: event.target.value }))}
            />
          </div>
          <div className="col-12 col-md-3">
            <label className="form-label" htmlFor="severidad">
              Severidad
            </label>
            <input
              className="form-control"
              id="severidad"
              value={draft.severidad ?? ''}
              onChange={(event) => setDraft((current) => ({ ...current, severidad: event.target.value }))}
            />
          </div>
          <div className="col-12 col-md-2">
            <button className="btn btn-dark w-100" type="submit">
              Filtrar
            </button>
          </div>
        </div>
      </form>

      <div className="row g-3">
        <div className="col-12 col-xl-8">
          <div className="card border-0 shadow-sm">
            <div className="table-responsive">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Usuario</th>
                    <th>Accion</th>
                    <th>Severidad</th>
                    <th>Metadata</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={String(row.id ?? index)}>
                      <td>{String(row.fechaUtc ?? row.fecha ?? '-')}</td>
                      <td>{String(row.usuarioEmail ?? row.email ?? '-')}</td>
                      <td>{String(row.accion ?? '-')}</td>
                      <td>{String(row.severidad ?? '-')}</td>
                      <td>
                        <code>{JSON.stringify(row.metadata ?? row.detalle ?? {})}</code>
                      </td>
                    </tr>
                  ))}
                  {!bitacora.isLoading && rows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-secondary text-center py-4">
                        Sin registros para mostrar.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-12 col-xl-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h2 className="h6">Resumen</h2>
              <pre className="metadata-box bg-light p-3 rounded mb-0">
                {JSON.stringify(resumen.data ?? {}, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
