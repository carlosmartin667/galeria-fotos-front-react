import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { queryKeys } from '@/services/api/queryKeys';
import { getDescargaAdmin, regenerarDescargaAdmin } from '@/services/admin/descargasAdminApi';
import { AdminPageHeader } from '@/shared/components/admin/AdminPrimitives';
import { LoadingState } from '@/shared/components/LoadingState';
export function AdminDescargaDetailPage(){const{id=''}=useParams();const qc=useQueryClient();const q=useQuery({queryKey:['admin','descarga',id],queryFn:()=>getDescargaAdmin(id)});const m=useMutation({mutationFn:()=>regenerarDescargaAdmin(id),onSuccess:()=>qc.invalidateQueries({queryKey:queryKeys.admin.descargas()})});if(q.isLoading)return <LoadingState/>;return <section><AdminPageHeader title={`Descarga ${q.data?.nombreArchivo??id}`}/><p>Estado: {q.data?.estado}</p><button className="btn btn-dark" onClick={()=>m.mutate()}>Regenerar</button></section>}
