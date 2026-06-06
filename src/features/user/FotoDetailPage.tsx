import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/services/api/queryKeys';
import { getFoto } from '@/services/fotos/fotosApi';
import { ComentariosPanel } from '@/shared/components/ComentariosPanel';
import { EmptyState } from '@/shared/components/EmptyState';
import { LoadingState } from '@/shared/components/LoadingState';
import { Seo } from '@/shared/components/Seo';

export function FotoDetailPage() {
  const { id = '' } = useParams();
  const q = useQuery({ queryKey: queryKeys.fotos.detail(id), queryFn: () => getFoto(id) });
  if (q.isLoading) return <LoadingState />;
  if (!q.data) return <EmptyState title="Foto no encontrada" />;
  return <section><Seo title={q.data.titulo || 'Foto'} description="Detalle de foto" /><h1 className="h3">{q.data.titulo || q.data.nombreArchivo}</h1>{q.data.previewUrl ? <img className="img-fluid rounded" src={q.data.previewUrl} alt="" /> : null}<p className="text-secondary">Precio: {q.data.precioUnitario ?? '-'}</p><ComentariosPanel targetType="foto" targetId={id} /></section>;
}
