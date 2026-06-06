import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { queryKeys } from '@/services/api/queryKeys';
import { createCuponAdmin, getCuponesAdmin } from '@/services/admin/cuponesAdminApi';
import { AdminFormSection, AdminPageHeader } from '@/shared/components/admin/AdminPrimitives';
import { AdminTable } from '@/shared/components/admin/AdminTable';

const schema=z.object({codigo:z.string().min(2),tipoDescuento:z.string().min(1),valorDescuento:z.coerce.number().min(1).max(100)});
type Form=z.infer<typeof schema>;
export function AdminCuponesPage(){ const qc=useQueryClient(); const q=useQuery({queryKey:queryKeys.admin.cupones(),queryFn:getCuponesAdmin}); const f=useForm<Form>({resolver:zodResolver(schema),defaultValues:{tipoDescuento:'Porcentaje'}}); const m=useMutation({mutationFn:createCuponAdmin,onSuccess:()=>qc.invalidateQueries({queryKey:queryKeys.admin.cupones()})}); return <section><AdminPageHeader title="Cupones"/><AdminFormSection title="Nuevo cupon"><form className="row g-2" onSubmit={f.handleSubmit(v=>m.mutate(v))}><input className="form-control" placeholder="Codigo" {...f.register('codigo')}/><input className="form-control" placeholder="Tipo" {...f.register('tipoDescuento')}/><input className="form-control" type="number" aria-invalid={Boolean(f.formState.errors.valorDescuento)} {...f.register('valorDescuento')}/>{f.formState.errors.valorDescuento?<div className="text-danger small">Porcentaje 1-100</div>:null}<button className="btn btn-dark">Guardar</button></form></AdminFormSection><AdminTable rows={q.data??[]} columns={[{header:'Codigo',render:(r)=>r.codigo},{header:'Valor',render:(r)=>r.valorDescuento}]}/></section>}
