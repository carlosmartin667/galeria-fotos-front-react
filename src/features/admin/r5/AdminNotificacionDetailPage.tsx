import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { queryKeys } from '@/services/api/queryKeys';
import { cancelarNotificacionAdmin, getNotificacionAdmin, reenviarNotificacionAdmin } from '@/services/admin/notificacionesAdminApi';
import { AdminPageHeader, SanitizedMetadata } from '@/shared/components/admin/AdminPrimitives';
export function AdminNotificacionDetailPage(){const{id=''}=useParams();const qc=useQueryClient();const q=useQuery({queryKey:['admin','notificacion',id],queryFn:()=>getNotificacionAdmin(id)});const done=()=>qc.invalidateQueries({queryKey:queryKeys.admin.notificaciones()});const reenviar=useMutation({mutationFn:()=>reenviarNotificacionAdmin(id),onSuccess:done});const cancelar=useMutation({mutationFn:()=>cancelarNotificacionAdmin(id),onSuccess:done});return <section><AdminPageHeader title="Notificacion"/><SanitizedMetadata value={q.data}/><button className="btn btn-dark me-2" onClick={()=>reenviar.mutate()}>Reenviar</button><button className="btn btn-outline-danger" onClick={()=>cancelar.mutate()}>Cancelar</button></section>}
