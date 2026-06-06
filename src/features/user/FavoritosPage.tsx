import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { queryKeys } from '@/services/api/queryKeys';
import { getFavoritosEventosPaginado, getFavoritosFotosPaginado, removeFotoFavorito } from '@/services/favoritos/favoritosApi';
import { EmptyState } from '@/shared/components/EmptyState';
import { LoadingState } from '@/shared/components/LoadingState';
import { PaginationControls } from '@/shared/components/PaginationControls';
import { Seo } from '@/shared/components/Seo';
import { UserCard } from './components/UserList';

export function FavoritosPage() {
  const [page, setPage] = useState(1);
  const filters = { page, pageSize: 12, all: false };
  const qc = useQueryClient();
  const eventos = useQuery({ queryKey: queryKeys.favoritos.eventosPaginado(filters), queryFn: () => getFavoritosEventosPaginado(filters) });
  const fotos = useQuery({ queryKey: queryKeys.favoritos.fotosPaginado(filters), queryFn: () => getFavoritosFotosPaginado(filters) });
  const rm = useMutation({ mutationFn: removeFotoFavorito, onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.favoritos.root }) });
  if (eventos.isLoading || fotos.isLoading) return <LoadingState />;
  const favoritos = [...(eventos.data?.items ?? []), ...(fotos.data?.items ?? [])];
  return <section><Seo title="Favoritos" description="Favoritos" /><h1 className="h3">Favoritos</h1>{favoritos.length === 0 ? <EmptyState title="Sin favoritos" /> : null}<div className="row g-3">{favoritos.map((f, i) => <div className="col-md-4" key={f.id || f.fotoId || i}><UserCard title={f.foto?.titulo || f.evento?.nombre || 'Favorito'} action={f.fotoId ? <button className="btn btn-sm btn-outline-danger" onClick={() => rm.mutate(f.fotoId!)}>Quitar favorito</button> : null} /></div>)}</div><PaginationControls page={page} pageSize={filters.pageSize} total={(eventos.data?.total ?? 0) + (fotos.data?.total ?? 0)} onPageChange={setPage} /></section>;
}
