import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { queryKeys } from '@/services/api/queryKeys';
import { getFotosEventoAdmin } from '@/services/admin/fotosAdminApi';
import { AdminFiltersBar, AdminPageHeader, SanitizedMetadata, StatusBadge } from '@/shared/components/admin/AdminPrimitives';
import { AdminTable } from '@/shared/components/admin/AdminTable';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { LoadingState } from '@/shared/components/LoadingState';

export function AdminFotosEventoPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventoId = params.eventoId ?? searchParams.get('eventoId') ?? '';
  const [draftEventoId, setDraftEventoId] = useState(eventoId);
  const query = useQuery({
    queryKey: queryKeys.admin.fotosEvento(eventoId),
    queryFn: () => getFotosEventoAdmin(eventoId),
    enabled: Boolean(eventoId),
  });

  if (!eventoId) {
    return (
      <section>
        <AdminPageHeader title="Fotos" description="Consulta administrativa de fotos por evento." />
        <AdminFiltersBar>
          <form
            className="row g-2 w-100"
            onSubmit={(event) => {
              event.preventDefault();
              if (draftEventoId.trim()) navigate(`/admin/fotos/evento/${encodeURIComponent(draftEventoId.trim())}`);
            }}
          >
            <div className="col-12 col-md-9">
              <label className="form-label" htmlFor="admin-fotos-evento">Evento</label>
              <input id="admin-fotos-evento" className="form-control" value={draftEventoId} onChange={(event) => setDraftEventoId(event.target.value)} />
            </div>
            <div className="col-12 col-md-3 d-flex align-items-end">
              <button className="btn btn-dark w-100" type="submit">Buscar</button>
            </div>
          </form>
        </AdminFiltersBar>
        <EmptyState title="Selecciona un evento" message="Ingresa el identificador de evento para consultar sus fotos." />
      </section>
    );
  }

  if (query.isLoading) return <LoadingState />;
  if (query.isError) return <ErrorState />;

  return (
    <section>
      <AdminPageHeader title="Fotos" description={`Evento ${eventoId}`} action={<Link className="btn btn-outline-dark btn-sm" to="/admin/fotos">Cambiar evento</Link>} />
      <AdminTable
        caption="Fotos del evento"
        rows={query.data ?? []}
        columns={[
          { header: 'Nombre', render: (foto) => foto.titulo ?? foto.nombreArchivo ?? foto.id },
          { header: 'Estado', render: (foto) => <StatusBadge value={foto.destacada} /> },
          { header: 'Metadata', render: (foto) => <SanitizedMetadata value={foto} /> },
        ]}
      />
    </section>
  );
}
