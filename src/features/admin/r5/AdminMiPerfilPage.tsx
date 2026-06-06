import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { getMiPerfilAdmin, updateMiPerfilAdmin } from '@/services/admin/adminPerfilApi';
import { queryKeys } from '@/services/api/queryKeys';
import { AdminFormSection, AdminPageHeader, SanitizedMetadata } from '@/shared/components/admin/AdminPrimitives';

const schema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio.').max(160),
  descripcion: z.string().max(1000).optional(),
  whatsApp: z.string().max(64).optional(),
  instagram: z.string().max(120).optional(),
  correoPublico: z.string().email('Email invalido.').optional().or(z.literal('')),
  direccion: z.string().max(300).optional(),
});
type Form = z.infer<typeof schema>;

export function AdminMiPerfilPage() {
  const queryClient = useQueryClient();
  const perfil = useQuery({ queryKey: queryKeys.admin.miPerfil(), queryFn: getMiPerfilAdmin });
  const form = useForm<Form>({ resolver: zodResolver(schema), defaultValues: { nombre: '', descripcion: '', whatsApp: '', instagram: '', correoPublico: '', direccion: '' } });
  useEffect(() => {
    if (perfil.data) {
      form.reset({
        nombre: perfil.data.nombre ?? '',
        descripcion: perfil.data.descripcion ?? '',
        whatsApp: perfil.data.whatsApp ?? '',
        instagram: perfil.data.instagram ?? '',
        correoPublico: perfil.data.correoPublico ?? '',
        direccion: perfil.data.direccion ?? '',
      });
    }
  }, [form, perfil.data]);
  const update = useMutation({ mutationFn: updateMiPerfilAdmin, onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.miPerfil() }) });

  return (
    <section>
      <AdminPageHeader title="Mi perfil admin" description="Datos publicos editables del perfil fotografa." />
      <AdminFormSection title="Perfil">
        <form className="row g-2" onSubmit={form.handleSubmit((values) => update.mutate(values))}>
          <div className="col-12 col-md-6"><label className="form-label" htmlFor="admin-perfil-nombre">Nombre</label><input id="admin-perfil-nombre" className="form-control" aria-invalid={Boolean(form.formState.errors.nombre)} {...form.register('nombre')} /></div>
          <div className="col-12 col-md-6"><label className="form-label" htmlFor="admin-perfil-email">Correo publico</label><input id="admin-perfil-email" className="form-control" aria-invalid={Boolean(form.formState.errors.correoPublico)} {...form.register('correoPublico')} /></div>
          <div className="col-12"><label className="form-label" htmlFor="admin-perfil-descripcion">Descripcion</label><textarea id="admin-perfil-descripcion" className="form-control" rows={3} {...form.register('descripcion')} /></div>
          <div className="col-12 col-md-4"><input className="form-control" placeholder="WhatsApp" aria-label="WhatsApp" {...form.register('whatsApp')} /></div>
          <div className="col-12 col-md-4"><input className="form-control" placeholder="Instagram" aria-label="Instagram" {...form.register('instagram')} /></div>
          <div className="col-12 col-md-4"><input className="form-control" placeholder="Direccion" aria-label="Direccion" {...form.register('direccion')} /></div>
          {form.formState.errors.nombre ? <div className="text-danger small">{form.formState.errors.nombre.message}</div> : null}
          {form.formState.errors.correoPublico ? <div className="text-danger small">{form.formState.errors.correoPublico.message}</div> : null}
          <div className="col-12"><button className="btn btn-dark" type="submit">Guardar perfil</button></div>
        </form>
      </AdminFormSection>
      <div className="card border-0 shadow-sm"><div className="card-body"><SanitizedMetadata value={perfil.data ?? {}} /></div></div>
    </section>
  );
}
