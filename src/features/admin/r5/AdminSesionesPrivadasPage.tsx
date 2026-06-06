import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { queryKeys } from '@/services/api/queryKeys';
import { createSesionPrivadaAdmin, getSesionesPrivadasAdmin } from '@/services/admin/sesionesPrivadasAdminApi';
import { AdminFormSection, AdminPageHeader, DateValue, MoneyValue, StatusBadge } from '@/shared/components/admin/AdminPrimitives';
import { AdminTable } from '@/shared/components/admin/AdminTable';

const schema = z.object({
  clienteId: z.string().trim().min(1, 'Cliente requerido.'),
  titulo: z.string().trim().min(1, 'Titulo requerido.').max(180),
  fechaSesionUtc: z.string().min(1, 'Fecha requerida.'),
  precioPaquete: z.coerce.number().min(0).optional(),
});
type Form = z.infer<typeof schema>;

export function AdminSesionesPrivadasPage() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: queryKeys.admin.sesionesPrivadas(), queryFn: getSesionesPrivadasAdmin });
  const form = useForm<Form>({ resolver: zodResolver(schema), defaultValues: { clienteId: '', titulo: '', fechaSesionUtc: '', precioPaquete: 0 } });
  const create = useMutation({ mutationFn: createSesionPrivadaAdmin, onSuccess: () => { form.reset(); queryClient.invalidateQueries({ queryKey: queryKeys.admin.sesionesPrivadas() }); } });

  return (
    <section>
      <AdminPageHeader title="Sesiones privadas" />
      <AdminFormSection title="Nueva sesion privada">
        <form className="row g-2" onSubmit={form.handleSubmit((values) => create.mutate({ ...values, estado: 'Pendiente' }))}>
          <div className="col-12 col-md-3"><input className="form-control" placeholder="ClienteId" aria-label="ClienteId" {...form.register('clienteId')} /></div>
          <div className="col-12 col-md-3"><input className="form-control" placeholder="Titulo" aria-label="Titulo" {...form.register('titulo')} /></div>
          <div className="col-12 col-md-3"><input className="form-control" type="datetime-local" aria-label="Fecha sesion" {...form.register('fechaSesionUtc')} /></div>
          <div className="col-12 col-md-2"><input className="form-control" type="number" min="0" step="0.01" aria-label="Precio paquete" {...form.register('precioPaquete')} /></div>
          <div className="col-12 col-md-1"><button className="btn btn-dark w-100" type="submit">Crear</button></div>
        </form>
      </AdminFormSection>
      <AdminTable
        caption="Listado de sesiones privadas"
        rows={query.data ?? []}
        columns={[
          { header: 'Titulo', render: (sesion) => <Link to={`/admin/sesiones-privadas/${sesion.id}`}>{sesion.titulo ?? sesion.id}</Link> },
          { header: 'Cliente', render: (sesion) => sesion.clienteNombre ?? sesion.clienteId ?? '-' },
          { header: 'Fecha', render: (sesion) => <DateValue value={sesion.fechaSesionUtc} /> },
          { header: 'Precio', render: (sesion) => <MoneyValue value={sesion.precioPaquete ?? undefined} /> },
          { header: 'Estado', render: (sesion) => <StatusBadge value={sesion.estado ?? sesion.activa} /> },
        ]}
      />
    </section>
  );
}
