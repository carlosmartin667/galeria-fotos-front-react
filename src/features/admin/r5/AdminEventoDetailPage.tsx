import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import { z } from 'zod';
import { queryKeys } from '@/services/api/queryKeys';
import { createPaqueteEventoAdmin, deletePaqueteEventoAdmin, getEventoAdmin, getPaquetesEventoAdmin, updatePaqueteEventoAdmin } from '@/services/admin/eventosAdminApi';
import { AdminFormSection, AdminPageHeader, MoneyValue, SanitizedMetadata, StatusBadge } from '@/shared/components/admin/AdminPrimitives';
import { AdminTable } from '@/shared/components/admin/AdminTable';
import { NotasInternasPanel } from '@/shared/components/admin/NotasInternasPanel';
import { ComentariosPanel } from '@/shared/components/ComentariosPanel';
import { EmptyState } from '@/shared/components/EmptyState';
import { LoadingState } from '@/shared/components/LoadingState';

const paqueteSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio.').max(180),
  descripcion: z.string().max(1000).optional(),
  precio: z.coerce.number().min(0).optional(),
  incluyeTodasLasFotos: z.boolean().optional(),
  activo: z.boolean().optional(),
  destacado: z.boolean().optional(),
  ordenDestacado: z.number().nullable().optional(),
});
type PaqueteForm = z.infer<typeof paqueteSchema>;

export function AdminEventoDetailPage() {
  const { id = '' } = useParams();
  const queryClient = useQueryClient();
  const evento = useQuery({ queryKey: queryKeys.eventos.detail(id), queryFn: () => getEventoAdmin(id), enabled: Boolean(id) });
  const paquetes = useQuery({ queryKey: queryKeys.admin.paquetesEvento(id), queryFn: () => getPaquetesEventoAdmin(id), enabled: Boolean(id) });
  const form = useForm<PaqueteForm>({ resolver: zodResolver(paqueteSchema), defaultValues: { nombre: '', descripcion: '', precio: 0, incluyeTodasLasFotos: false, activo: true, destacado: false } });
  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.paquetesEvento(id) });
  const create = useMutation({ mutationFn: (payload: PaqueteForm) => createPaqueteEventoAdmin(id, payload), onSuccess: () => { form.reset(); invalidate(); } });
  const update = useMutation({ mutationFn: ({ paqueteId, payload }: { paqueteId: string; payload: PaqueteForm }) => updatePaqueteEventoAdmin(paqueteId, payload), onSuccess: invalidate });
  const remove = useMutation({ mutationFn: deletePaqueteEventoAdmin, onSuccess: invalidate });

  if (evento.isLoading) return <LoadingState />;
  if (!evento.data) return <EmptyState title="Evento no encontrado" />;

  return (
    <section>
      <AdminPageHeader title={evento.data.nombre ?? 'Evento'} description="Detalle administrativo de evento" action={<Link className="btn btn-outline-dark btn-sm" to="/admin/eventos">Volver</Link>} />
      <div className="card border-0 shadow-sm mb-3"><div className="card-body"><SanitizedMetadata value={evento.data} /></div></div>
      <AdminFormSection title="Nuevo paquete">
        <form className="row g-2" onSubmit={form.handleSubmit((values) => create.mutate(values))}>
          <div className="col-12 col-md-4"><input className="form-control" placeholder="Nombre" aria-label="Nombre paquete" {...form.register('nombre')} /></div>
          <div className="col-12 col-md-3"><input className="form-control" type="number" min="0" step="0.01" aria-label="Precio paquete" {...form.register('precio')} /></div>
          <div className="col-12 col-md-5"><input className="form-control" placeholder="Descripcion" aria-label="Descripcion paquete" {...form.register('descripcion')} /></div>
          <div className="col-12 d-flex gap-3 flex-wrap">
            <label className="form-check"><input className="form-check-input" type="checkbox" {...form.register('incluyeTodasLasFotos')} /> <span className="form-check-label">Incluye todas</span></label>
            <label className="form-check"><input className="form-check-input" type="checkbox" {...form.register('activo')} /> <span className="form-check-label">Activo</span></label>
            <label className="form-check"><input className="form-check-input" type="checkbox" {...form.register('destacado')} /> <span className="form-check-label">Destacado</span></label>
          </div>
          {form.formState.errors.nombre ? <div className="text-danger small">{form.formState.errors.nombre.message}</div> : null}
          <div className="col-12"><button className="btn btn-dark btn-sm" type="submit">Crear paquete</button></div>
        </form>
      </AdminFormSection>
      <AdminTable
        caption="Paquetes del evento"
        rows={paquetes.data ?? []}
        columns={[
          { header: 'Nombre', render: (paquete) => paquete.nombre },
          { header: 'Precio', render: (paquete) => <MoneyValue value={paquete.precio} /> },
          { header: 'Estado', render: (paquete) => <StatusBadge value={paquete.activo} /> },
          { header: 'Acciones', render: (paquete) => (
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-outline-dark" type="button" onClick={() => {
                const nombre = window.prompt('Nombre del paquete', paquete.nombre)?.trim();
                if (nombre && window.confirm('Confirmar cambios')) update.mutate({
                  paqueteId: paquete.id,
                  payload: {
                    nombre,
                    descripcion: paquete.descripcion ?? undefined,
                    precio: paquete.precio,
                    incluyeTodasLasFotos: paquete.incluyeTodasLasFotos,
                    activo: paquete.activo,
                    destacado: paquete.destacado,
                    ordenDestacado: paquete.ordenDestacado,
                  },
                });
              }}>Editar</button>
              <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => window.confirm('Confirmar eliminacion') && remove.mutate(paquete.id)}>Eliminar</button>
            </div>
          ) },
        ]}
      />
      <ComentariosPanel targetType="evento" targetId={id} canModerate />
      <NotasInternasPanel entidadTipo="Evento" entidadId={id} />
    </section>
  );
}
