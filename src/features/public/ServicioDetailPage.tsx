import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { routes } from '@/config/routes';
import { queryKeys } from '@/services/api/queryKeys';
import { getServicio } from '@/services/servicios/serviciosApi';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { LoadingState } from '@/shared/components/LoadingState';
import { Seo } from '@/shared/components/Seo';

export function ServicioDetailPage() {
  const { id = '' } = useParams();
  const servicio = useQuery({ queryKey: queryKeys.servicios.detail(id), queryFn: () => getServicio(id), enabled: Boolean(id) });
  if (servicio.isLoading) return <LoadingState />;
  if (servicio.isError) return <main className="container py-5"><ErrorState /></main>;
  if (!servicio.data) return <main className="container py-5"><EmptyState title="Servicio no encontrado" /></main>;

  return (
    <main className="container py-5">
      <Seo title={servicio.data.nombre} description={servicio.data.descripcion || 'Detalle de servicio fotografico.'} />
      <Link to={routes.public.servicios} className="small">Volver a servicios</Link>
      <h1 className="h3 mt-2">{servicio.data.nombre}</h1>
      <p className="text-secondary">{servicio.data.descripcion}</p>
      <dl className="row">
        <dt className="col-sm-3">Duracion</dt><dd className="col-sm-9">{servicio.data.duracionEstimada || '-'}</dd>
        <dt className="col-sm-3">Fotos incluidas</dt><dd className="col-sm-9">{servicio.data.cantidadFotosIncluidas ?? '-'}</dd>
      </dl>
      <Link className="btn btn-dark" to={`${routes.public.presupuesto}?servicioId=${encodeURIComponent(servicio.data.id)}`}>Solicitar presupuesto</Link>
    </main>
  );
}
