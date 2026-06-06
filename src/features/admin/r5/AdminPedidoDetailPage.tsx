import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { queryKeys } from '@/services/api/queryKeys';
import { cambiarEstadoPedidoAdmin, getPedidoAdmin, getPedidoHistorialEstadosAdmin } from '@/services/admin/pedidosAdminApi';
import { AdminPageHeader, MoneyValue } from '@/shared/components/admin/AdminPrimitives';
import { LoadingState } from '@/shared/components/LoadingState';
export function AdminPedidoDetailPage(){const{id=''}=useParams();const qc=useQueryClient();const q=useQuery({queryKey:['admin','pedido',id],queryFn:()=>getPedidoAdmin(id)});const hist=useQuery({queryKey:['admin','pedido-hist',id],queryFn:()=>getPedidoHistorialEstadosAdmin(id)});const m=useMutation({mutationFn:(estado:string)=>cambiarEstadoPedidoAdmin(id,estado),onSuccess:()=>qc.invalidateQueries({queryKey:queryKeys.admin.pedidos()})});if(q.isLoading)return <LoadingState/>;return <section><AdminPageHeader title={`Pedido ${q.data?.numero??id}`}/><p>Estado: {q.data?.estado}</p><p>Total <MoneyValue value={q.data?.total}/></p><button className="btn btn-sm btn-dark" onClick={()=>m.mutate('Completado')}>Cambiar estado</button><h2 className="h5 mt-4">Historial</h2>{(hist.data??[]).map((h:any,i)=><div key={i}>{h.estado??h.titulo??'-'}</div>)}</section>}
