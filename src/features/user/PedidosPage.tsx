import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { routes } from '@/config/routes';
import { queryKeys } from '@/services/api/queryKeys';
import { getPedidosPaginado } from '@/services/pedidos/pedidosApi';
import { EmptyState } from '@/shared/components/EmptyState';
import { LoadingState } from '@/shared/components/LoadingState';
import { PaginationControls } from '@/shared/components/PaginationControls';
import { Seo } from '@/shared/components/Seo';
import { UserCard } from './components/UserList';

export function PedidosPage() {
  const [page, setPage] = useState(1);
  const filters = { page, pageSize: 10, all: false };
  const q = useQuery({ queryKey: queryKeys.pedidos.paginado(filters), queryFn: () => getPedidosPaginado(filters) });
  if (q.isLoading) return <LoadingState />;
  const pedidos = q.data?.items ?? [];
  return <section><Seo title="Pedidos" description="Mis pedidos" /><h1 className="h3">Mis pedidos</h1>{pedidos.length === 0 ? <EmptyState title="Sin pedidos" /> : null}<div className="row g-3">{pedidos.map((p) => <div className="col-md-4" key={p.id}><UserCard title={p.numero || p.id} description={`${p.estado ?? ''} Total $${p.total ?? 0} Cupon ${p.cuponCodigo ?? '-'}`} to={routes.user.pedidoDetail(p.id)} /></div>)}</div><PaginationControls page={page} pageSize={filters.pageSize} total={q.data?.total} onPageChange={setPage} /></section>;
}
