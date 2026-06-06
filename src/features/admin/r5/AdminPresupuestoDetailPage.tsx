import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { queryKeys } from '@/services/api/queryKeys';
import { getPresupuestoAdmin, updatePresupuestoEstadoAdmin } from '@/services/admin/presupuestosAdminApi';
import { AdminPageHeader, SanitizedMetadata } from '@/shared/components/admin/AdminPrimitives';
import { LoadingState } from '@/shared/components/LoadingState';
export function AdminPresupuestoDetailPage(){const{id=''}=useParams();const qc=useQueryClient();const q=useQuery({queryKey:['admin','presupuesto',id],queryFn:()=>getPresupuestoAdmin(id)});const m=useMutation({mutationFn:()=>updatePresupuestoEstadoAdmin(id,'Contactado'),onSuccess:()=>qc.invalidateQueries({queryKey:queryKeys.admin.presupuestos()})});if(q.isLoading)return <LoadingState/>;return <section><AdminPageHeader title="Presupuesto"/><SanitizedMetadata value={q.data}/><div><button className="btn btn-dark mt-3" onClick={()=>m.mutate()}>Cambiar estado</button></div></section>}
