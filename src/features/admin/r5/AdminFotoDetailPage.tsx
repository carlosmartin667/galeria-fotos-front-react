import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { queryKeys } from '@/services/api/queryKeys';
import { getFotoAdmin } from '@/services/admin/fotosAdminApi';
import { AdminPageHeader, SanitizedMetadata } from '@/shared/components/admin/AdminPrimitives';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { LoadingState } from '@/shared/components/LoadingState';

export function AdminFotoDetailPage() {
  const { id = '' } = useParams();
  const query = useQuery({ queryKey: queryKeys.fotos.detail(id), queryFn: () => getFotoAdmin(id), enabled: Boolean(id) });

  if (query.isLoading) return <LoadingState />;
  if (query.isError) return <ErrorState />;
  if (!query.data) return <EmptyState title="Foto no encontrada" />;

  return (
    <section>
      <AdminPageHeader title={query.data.titulo ?? query.data.nombreArchivo ?? 'Foto'} description="Detalle administrativo de foto" action={query.data.eventoId ? <Link className="btn btn-outline-dark btn-sm" to={`/admin/fotos/evento/${query.data.eventoId}`}>Volver al evento</Link> : null} />
      <div className="card border-0 shadow-sm"><div className="card-body"><SanitizedMetadata value={query.data} /></div></div>
    </section>
  );
}
