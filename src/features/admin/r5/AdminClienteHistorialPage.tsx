import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getClienteHistorialAdmin } from '@/services/admin/clientesAdminApi';
import { AdminPageHeader, SanitizedMetadata } from '@/shared/components/admin/AdminPrimitives';
export function AdminClienteHistorialPage(){const{id=''}=useParams();const q=useQuery({queryKey:['admin','cliente-historial',id],queryFn:()=>getClienteHistorialAdmin(id)});return <section><AdminPageHeader title="Historial cliente"/>{(q.data??[]).map((item,i)=><div className="card mb-2" key={i}><div className="card-body"><SanitizedMetadata value={item}/></div></div>)}</section>}
