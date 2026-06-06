import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { routes } from '@/config/routes';
import { queryKeys } from '@/services/api/queryKeys';
import { getPromocion } from '@/services/promociones/promocionesApi';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { LoadingState } from '@/shared/components/LoadingState';
import { Seo } from '@/shared/components/Seo';

export function PromocionDetailPage() {
  const { id = '' } = useParams();
  const promo = useQuery({ queryKey: queryKeys.promociones.detail(id), queryFn: () => getPromocion(id), enabled: Boolean(id) });
  if (promo.isLoading) return <LoadingState />;
  if (promo.isError) return <main className="container py-5"><ErrorState /></main>;
  if (!promo.data) return <main className="container py-5"><EmptyState title="Promocion no encontrada" /></main>;
  return <main className="container py-5"><Seo title={promo.data.titulo} description={promo.data.descripcion || 'Detalle de promocion.'} /><Link to={routes.public.promociones} className="small">Volver a promociones</Link><h1 className="h3 mt-2">{promo.data.titulo}</h1><p className="text-secondary">{promo.data.descripcion}</p><Link className="btn btn-dark" to={routes.public.presupuesto}>Consultar promocion</Link></main>;
}
