import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { queryKeys } from '@/services/api/queryKeys';
import { createTestimonio, getTestimonios } from '@/services/testimonios/testimoniosApi';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { LoadingState } from '@/shared/components/LoadingState';
import { Seo } from '@/shared/components/Seo';
import type { ApiError } from '@/services/api/apiError';
import { testimonioSchema, type TestimonioForm } from './schemas';

export function TestimoniosPage() {
  const testimonios = useQuery({ queryKey: queryKeys.testimonios.list(), queryFn: getTestimonios });
  const mutation = useMutation({ mutationKey: queryKeys.testimonios.create(), mutationFn: createTestimonio });
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TestimonioForm>({ resolver: zodResolver(testimonioSchema), defaultValues: { calificacion: 5 } });
  const onSubmit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync({ ...values, emailCliente: values.emailCliente || undefined });
      reset({ calificacion: 5 });
    } catch {
      // El mensaje seguro se renderiza desde el estado de la mutation.
    }
  });
  if (testimonios.isLoading) return <LoadingState />;
  return (
    <main className="container py-5">
      <Seo title="Testimonios" description="Opiniones de clientes de GaleriaFotos." />
      <h1 className="h3">Testimonios</h1>
      {testimonios.data?.length === 0 ? <EmptyState title="Sin testimonios" /> : null}
      <div className="row g-3 mb-5">{(testimonios.data ?? []).map((item) => <div className="col-md-4" key={item.id}><blockquote className="card border-0 shadow-sm h-100"><div className="card-body"><p>{item.texto}</p><footer className="small text-secondary">{item.nombreCliente}</footer></div></blockquote></div>)}</div>
      <h2 className="h4">Dejar testimonio</h2>
      {mutation.isSuccess ? <div className="alert alert-success">Gracias. Tu testimonio quedara pendiente de aprobacion.</div> : null}
      {mutation.isError ? <ErrorState message={(mutation.error as ApiError).message} /> : null}
      <form className="row g-3" onSubmit={onSubmit} noValidate>
        <div className="col-md-6"><label className="form-label" htmlFor="nombreCliente">Nombre</label><input id="nombreCliente" className="form-control" aria-invalid={Boolean(errors.nombreCliente)} aria-describedby={errors.nombreCliente ? 'testimonio-nombre-error' : undefined} {...register('nombreCliente')} />{errors.nombreCliente ? <div className="text-danger small" id="testimonio-nombre-error">{errors.nombreCliente.message}</div> : null}</div>
        <div className="col-md-6"><label className="form-label" htmlFor="emailCliente">Email</label><input id="emailCliente" className="form-control" type="email" aria-invalid={Boolean(errors.emailCliente)} aria-describedby={errors.emailCliente ? 'testimonio-email-error' : undefined} {...register('emailCliente')} />{errors.emailCliente ? <div className="text-danger small" id="testimonio-email-error">{errors.emailCliente.message}</div> : null}</div>
        <div className="col-md-3"><label className="form-label" htmlFor="calificacion">Calificacion</label><input id="calificacion" className="form-control" type="number" min={1} max={5} {...register('calificacion')} /></div>
        <div className="col-12"><label className="form-label" htmlFor="texto">Texto</label><textarea id="texto" className="form-control" rows={4} aria-invalid={Boolean(errors.texto)} aria-describedby={errors.texto ? 'testimonio-texto-error' : undefined} {...register('texto')} />{errors.texto ? <div className="text-danger small" id="testimonio-texto-error">{errors.texto.message}</div> : null}</div>
        <div className="col-12"><button className="btn btn-dark" type="submit">Enviar testimonio</button></div>
      </form>
    </main>
  );
}
