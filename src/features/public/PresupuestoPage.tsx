import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { queryKeys } from '@/services/api/queryKeys';
import { createSolicitudPresupuesto } from '@/services/presupuestos/presupuestosApi';
import { getServicios } from '@/services/servicios/serviciosApi';
import { ErrorState } from '@/shared/components/ErrorState';
import { Seo } from '@/shared/components/Seo';
import type { ApiError } from '@/services/api/apiError';
import { presupuestoSchema, type PresupuestoForm } from './schemas';

export function PresupuestoPage() {
  const [searchParams] = useSearchParams();
  const servicios = useQuery({ queryKey: queryKeys.servicios.list(), queryFn: getServicios });
  const mutation = useMutation({ mutationKey: queryKeys.presupuestos.create(), mutationFn: createSolicitudPresupuesto });
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PresupuestoForm>({
    resolver: zodResolver(presupuestoSchema),
    defaultValues: { nombre: '', email: '', mensaje: '', servicioId: searchParams.get('servicioId') ?? '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync({
        ...values,
        cantidadInvitados: values.cantidadInvitados === '' ? undefined : values.cantidadInvitados,
        fechaTentativaUtc: values.fechaTentativaUtc || undefined,
      });
      reset();
    } catch {
      // El mensaje seguro se renderiza desde el estado de la mutation.
    }
  });

  return (
    <main className="container py-5">
      <Seo title="Presupuesto" description="Solicita un presupuesto de fotografia profesional." />
      <h1 className="h3">Solicitud de presupuesto</h1>
      {mutation.isSuccess ? <div className="alert alert-success">Solicitud enviada. Te contactaremos pronto.</div> : null}
      {mutation.isError ? <ErrorState message={(mutation.error as ApiError).message} /> : null}
      <form className="row g-3" onSubmit={onSubmit} noValidate>
        <div className="col-md-6"><label className="form-label" htmlFor="nombre">Nombre</label><input id="nombre" className="form-control" aria-invalid={Boolean(errors.nombre)} aria-describedby={errors.nombre ? 'presupuesto-nombre-error' : undefined} {...register('nombre')} />{errors.nombre ? <div className="text-danger small" id="presupuesto-nombre-error">{errors.nombre.message}</div> : null}</div>
        <div className="col-md-6"><label className="form-label" htmlFor="email">Email</label><input id="email" className="form-control" type="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'presupuesto-email-error' : undefined} {...register('email')} />{errors.email ? <div className="text-danger small" id="presupuesto-email-error">{errors.email.message}</div> : null}</div>
        <div className="col-md-6"><label className="form-label" htmlFor="whatsApp">Telefono</label><input id="whatsApp" className="form-control" {...register('whatsApp')} /></div>
        <div className="col-md-6"><label className="form-label" htmlFor="servicioId">Servicio</label><select id="servicioId" className="form-select" {...register('servicioId')}><option value="">Seleccionar</option>{(servicios.data ?? []).map((servicio) => <option key={servicio.id} value={servicio.id}>{servicio.nombre}</option>)}</select></div>
        <div className="col-md-6"><label className="form-label" htmlFor="fechaTentativaUtc">Fecha tentativa</label><input id="fechaTentativaUtc" className="form-control" type="date" {...register('fechaTentativaUtc')} /></div>
        <div className="col-md-6"><label className="form-label" htmlFor="cantidadInvitados">Invitados</label><input id="cantidadInvitados" className="form-control" type="number" {...register('cantidadInvitados')} /></div>
        <div className="col-12"><label className="form-label" htmlFor="mensaje">Mensaje</label><textarea id="mensaje" className="form-control" rows={5} aria-invalid={Boolean(errors.mensaje)} aria-describedby={errors.mensaje ? 'presupuesto-mensaje-error' : undefined} {...register('mensaje')} />{errors.mensaje ? <div className="text-danger small" id="presupuesto-mensaje-error">{errors.mensaje.message}</div> : null}</div>
        <div className="col-12"><button className="btn btn-dark" type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Enviando...' : 'Enviar solicitud'}</button></div>
      </form>
    </main>
  );
}
