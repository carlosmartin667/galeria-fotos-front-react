import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { routes } from '@/config/routes';
import { queryKeys } from '@/services/api/queryKeys';
import { getEventosPaginado } from '@/services/eventos/eventosApi';
import { EmptyState } from '@/shared/components/EmptyState';
import { LoadingState } from '@/shared/components/LoadingState';
import { PaginationControls } from '@/shared/components/PaginationControls';
import { Seo } from '@/shared/components/Seo';
import { UserCard } from './components/UserList';

export function EventosPage() {
  const [page, setPage] = useState(1);
  const filters = { page, pageSize: 12, all: false };
  const q = useQuery({ queryKey: queryKeys.eventos.paginado(filters), queryFn: () => getEventosPaginado(filters) });
  if (q.isLoading) return <LoadingState />;
  const eventos = q.data?.items ?? [];
  return <section><Seo title="Eventos" description="Eventos disponibles" /><h1 className="h3">Eventos</h1>{eventos.length === 0 ? <EmptyState title="Sin eventos" /> : null}<div className="row g-3">{eventos.map((e) => <div className="col-md-4" key={e.id}><UserCard title={e.nombre} description={e.fechaEventoUtc || e.estado} to={routes.user.eventoDetail(e.id)} /></div>)}</div><PaginationControls page={page} pageSize={filters.pageSize} total={q.data?.total} onPageChange={setPage} /></section>;
}
