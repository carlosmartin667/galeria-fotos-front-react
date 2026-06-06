import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { routes } from '@/config/routes';
import { queryKeys } from '@/services/api/queryKeys';
import { getPortfolioItem } from '@/services/portfolio/portfolioApi';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { LoadingState } from '@/shared/components/LoadingState';
import { Seo } from '@/shared/components/Seo';

export function PortfolioDetailPage() {
  const { id = '' } = useParams();
  const detail = useQuery({ queryKey: queryKeys.portfolio.detail(id), queryFn: () => getPortfolioItem(id), enabled: Boolean(id) });
  if (detail.isLoading) return <LoadingState />;
  if (detail.isError) return <main className="container py-5"><ErrorState /></main>;
  if (!detail.data) return <main className="container py-5"><EmptyState title="Portfolio no encontrado" /></main>;

  return (
    <main className="container py-5">
      <Seo title={detail.data.titulo} description={detail.data.descripcion || 'Detalle de portfolio.'} />
      <Link to={routes.public.portfolio} className="small">Volver al portfolio</Link>
      <h1 className="h3 mt-2">{detail.data.titulo}</h1>
      {detail.data.imagenUrl ? <img className="img-fluid rounded mb-3" src={detail.data.imagenUrl} alt="" /> : null}
      <p className="text-secondary">{detail.data.descripcion}</p>
    </main>
  );
}
