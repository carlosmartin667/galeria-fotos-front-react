import { useQuery } from '@tanstack/react-query';
import { routes } from '@/config/routes';
import { queryKeys } from '@/services/api/queryKeys';
import { getPromociones } from '@/services/promociones/promocionesApi';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { LoadingState } from '@/shared/components/LoadingState';
import { Seo } from '@/shared/components/Seo';
import { PublicCard } from './components/PublicCards';

export function PromocionesPage() {
  const promociones = useQuery({ queryKey: queryKeys.promociones.list(), queryFn: getPromociones });
  if (promociones.isLoading) return <LoadingState />;
  if (promociones.isError) return <main className="container py-5"><ErrorState /></main>;
  return <main className="container py-5"><Seo title="Promociones" description="Promociones vigentes de fotografia." /><h1 className="h3">Promociones</h1>{promociones.data?.length === 0 ? <EmptyState title="Sin promociones" /> : null}<div className="row g-3">{(promociones.data ?? []).map((promo) => <div className="col-md-4" key={promo.id}><PublicCard title={promo.titulo} description={promo.descripcion} imageUrl={promo.imagenUrl} meta={promo.tipo} to={routes.public.promocionDetail(promo.id)} /></div>)}</div></main>;
}
