import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { queryKeys } from '@/services/api/queryKeys';
import { getReporteVentasAdmin } from '@/services/admin/reportesVentasApi';
import type { ReporteVentasFilters } from '@/types/reporteVentas';
import { AdminFiltersBar, AdminPageHeader, SanitizedMetadata } from '@/shared/components/admin/AdminPrimitives';
import { ErrorState } from '@/shared/components/ErrorState';
import { LoadingState } from '@/shared/components/LoadingState';

export function AdminReportesVentasPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilters = useMemo<ReporteVentasFilters>(() => ({
    desde: searchParams.get('desde') ?? '',
    hasta: searchParams.get('hasta') ?? '',
  }), [searchParams]);
  const [draft, setDraft] = useState(initialFilters);
  const query = useQuery({
    queryKey: queryKeys.admin.reportesVentas(initialFilters),
    queryFn: () => getReporteVentasAdmin(initialFilters),
  });

  return (
    <section>
      <AdminPageHeader title="Reporte de ventas" description="Resumen de ventas segun OpenAPI real." />
      <AdminFiltersBar>
        <form
          className="row g-2 w-100"
          onSubmit={(event) => {
            event.preventDefault();
            setSearchParams(Object.fromEntries(Object.entries(draft).filter(([, value]) => Boolean(value))));
          }}
        >
          <div className="col-12 col-md-4">
            <label className="form-label" htmlFor="reporte-desde">Desde</label>
            <input id="reporte-desde" className="form-control" type="date" value={draft.desde ?? ''} onChange={(event) => setDraft((current) => ({ ...current, desde: event.target.value }))} />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label" htmlFor="reporte-hasta">Hasta</label>
            <input id="reporte-hasta" className="form-control" type="date" value={draft.hasta ?? ''} onChange={(event) => setDraft((current) => ({ ...current, hasta: event.target.value }))} />
          </div>
          <div className="col-12 col-md-4 d-flex align-items-end">
            <button className="btn btn-dark w-100" type="submit">Filtrar</button>
          </div>
        </form>
      </AdminFiltersBar>
      {query.isLoading ? <LoadingState /> : null}
      {query.isError ? <ErrorState /> : null}
      {!query.isLoading && !query.isError ? <div className="card border-0 shadow-sm"><div className="card-body"><SanitizedMetadata value={query.data ?? {}} /></div></div> : null}
    </section>
  );
}
