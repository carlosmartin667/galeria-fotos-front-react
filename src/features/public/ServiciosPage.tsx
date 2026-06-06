import { useQuery } from '@tanstack/react-query';
import { routes } from '@/config/routes';
import { queryKeys } from '@/services/api/queryKeys';
import { getServicios } from '@/services/servicios/serviciosApi';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { LoadingState } from '@/shared/components/LoadingState';
import { Seo } from '@/shared/components/Seo';
import { PublicCard } from './components/PublicCards';

export function ServiciosPage() {
  const servicios = useQuery({ queryKey: queryKeys.servicios.list(), queryFn: getServicios });
  if (servicios.isLoading) return <LoadingState />;
  if (servicios.isError) return <main className="container py-5"><ErrorState /></main>;

  return (
    <main className="container py-5">
      <Seo title="Servicios" description="Servicios fotograficos para eventos y sesiones." />
      <h1 className="h3">Servicios</h1>
      {servicios.data?.length === 0 ? <EmptyState title="Sin servicios" /> : null}
      <div className="row g-3">
        {(servicios.data ?? []).map((servicio) => (
          <div className="col-12 col-md-6 col-xl-4" key={servicio.id}>
            <PublicCard title={servicio.nombre} description={servicio.descripcion} imageUrl={servicio.imagenUrl} to={routes.public.servicioDetail(servicio.id)} meta={servicio.precioDesde ? `Desde $${servicio.precioDesde}` : undefined} />
          </div>
        ))}
      </div>
    </main>
  );
}
