import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { routes } from '@/config/routes';
import { queryKeys } from '@/services/api/queryKeys';
import { getPortfolioItems } from '@/services/portfolio/portfolioApi';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { LoadingState } from '@/shared/components/LoadingState';
import { Seo } from '@/shared/components/Seo';
import { PublicCard } from './components/PublicCards';

export function PortfolioPage() {
  const [category, setCategory] = useState('Todas');
  const portfolio = useQuery({ queryKey: queryKeys.portfolio.list(), queryFn: getPortfolioItems });
  const categories = useMemo(() => ['Todas', ...new Set((portfolio.data ?? []).map((item) => item.categoria).filter(Boolean) as string[])], [portfolio.data]);
  const items = (portfolio.data ?? []).filter((item) => category === 'Todas' || item.categoria === category);

  if (portfolio.isLoading) return <LoadingState />;
  if (portfolio.isError) return <main className="container py-5"><ErrorState /></main>;

  return (
    <main className="container py-5">
      <Seo title="Portfolio" description="Trabajos destacados de fotografia profesional." />
      <h1 className="h3">Portfolio</h1>
      <div className="d-flex flex-wrap gap-2 my-3">
        {categories.map((item) => (
          <button className={`btn btn-sm ${item === category ? 'btn-dark' : 'btn-outline-secondary'}`} type="button" key={item} onClick={() => setCategory(item)}>{item}</button>
        ))}
      </div>
      {items.length === 0 ? <EmptyState title="Sin trabajos" message="No hay piezas de portfolio para mostrar." /> : null}
      <div className="row g-3">
        {items.map((item) => (
          <div className="col-12 col-md-6 col-xl-4" key={item.id}>
            <PublicCard title={item.titulo} description={item.descripcion} imageUrl={item.imagenUrl} meta={item.categoria} to={routes.public.portfolioDetail(item.id)} />
          </div>
        ))}
      </div>
    </main>
  );
}
