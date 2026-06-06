import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { queryKeys } from '@/services/api/queryKeys';
import { createEventoAdmin } from '@/services/admin/eventosAdminApi';
import { AdminFormSection, AdminPageHeader } from '@/shared/components/admin/AdminPrimitives';

const schema = z.object({ nombre: z.string().min(2, 'Nombre requerido'), fechaEventoUtc: z.string().min(1, 'Fecha requerida'), visibilidad: z.string().optional() });
type Form = z.infer<typeof schema>;

export function AdminEventFormPage() {
  const qc = useQueryClient();
  const { register, handleSubmit, formState:{errors} } = useForm<Form>({ resolver: zodResolver(schema), defaultValues:{nombre:'',fechaEventoUtc:''} });
  const mutation = useMutation({ mutationFn: createEventoAdmin, onSuccess:()=>qc.invalidateQueries({queryKey:queryKeys.admin.eventos()}) });
  return <section><AdminPageHeader title="Evento" description="Crear o editar evento" /><AdminFormSection title="Datos"><form className="row g-3" onSubmit={handleSubmit((v)=>mutation.mutate(v))}><div className="col-md-6"><label className="form-label">Nombre</label><input className="form-control" aria-invalid={Boolean(errors.nombre)} {...register('nombre')} />{errors.nombre?<div className="text-danger small">{errors.nombre.message}</div>:null}</div><div className="col-md-6"><label className="form-label">Fecha</label><input className="form-control" type="date" aria-invalid={Boolean(errors.fechaEventoUtc)} {...register('fechaEventoUtc')} />{errors.fechaEventoUtc?<div className="text-danger small">{errors.fechaEventoUtc.message}</div>:null}</div><div className="col-12"><button className="btn btn-dark">Guardar</button></div></form></AdminFormSection></section>;
}
