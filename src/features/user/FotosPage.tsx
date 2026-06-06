import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { routes } from '@/config/routes';
import { queryKeys } from '@/services/api/queryKeys';
import { getFotosEventoPaginado } from '@/services/fotos/fotosApi';
import { addFotoFavorito } from '@/services/favoritos/favoritosApi';
import { addFotoCarrito } from '@/services/carrito/carritoApi';
import { EmptyState } from '@/shared/components/EmptyState';
import { LoadingState } from '@/shared/components/LoadingState';
import { PaginationControls } from '@/shared/components/PaginationControls';
import { Seo } from '@/shared/components/Seo';
import { UserCard } from './components/UserList';

export function FotosPage() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const eventoId = searchParams.get('eventoId') ?? '';
  const filters = { page, pageSize: 12, all: false };
  const qc = useQueryClient();
  const q = useQuery({ queryKey: queryKeys.fotos.paginadasPorEvento(eventoId, filters), queryFn: () => getFotosEventoPaginado(eventoId, filters), enabled: Boolean(eventoId) });
  const fav = useMutation({ mutationFn: addFotoFavorito, onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.favoritos.root }) });
  const cart = useMutation({ mutationFn: addFotoCarrito, onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.carrito.root }) });
  if (!eventoId) return <section><Seo title="Fotos" description="Fotos disponibles por evento" /><h1 className="h3">Fotos</h1><EmptyState title="Selecciona un evento" message="El backend lista fotos por evento. Entra desde Eventos o usa ?eventoId=..." /><Link className="btn btn-outline-dark" to={routes.user.eventos}>Ver eventos</Link></section>;
  if (q.isLoading) return <LoadingState />;
  const fotos = q.data?.items ?? [];
  return <section><Seo title="Fotos" description="Fotos disponibles" /><h1 className="h3">Fotos</h1>{fotos.length === 0 ? <EmptyState title="Sin fotos" /> : null}<div className="row g-3">{fotos.map((f) => <div className="col-md-3" key={f.id}><UserCard title={f.titulo || f.nombreArchivo || 'Foto'} to={routes.user.fotoDetail(f.id)} action={<div className="d-flex gap-2 mt-2"><button className="btn btn-sm btn-outline-dark" onClick={(e) => { e.preventDefault(); fav.mutate(f.id); }}>Favorito</button><button className="btn btn-sm btn-dark" onClick={(e) => { e.preventDefault(); cart.mutate(f.id); }}>Carrito</button></div>} /></div>)}</div><PaginationControls page={page} pageSize={filters.pageSize} total={q.data?.total} onPageChange={setPage} /></section>;
}
