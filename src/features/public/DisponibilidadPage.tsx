import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { queryKeys } from '@/services/api/queryKeys';
import { getDisponibilidad } from '@/services/agenda/agendaApi';
import { EmptyState } from '@/shared/components/EmptyState';
import { Seo } from '@/shared/components/Seo';
import { disponibilidadSchema, type DisponibilidadForm } from './schemas';

export function DisponibilidadPage() {
  const [filters, setFilters] = useState<DisponibilidadForm | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<DisponibilidadForm>({ resolver: zodResolver(disponibilidadSchema) });
  const disponibilidad = useQuery({ queryKey: queryKeys.agenda.disponibilidad(filters), queryFn: () => getDisponibilidad(filters!), enabled: Boolean(filters) });

  return (
    <main className="container py-5">
      <Seo title="Disponibilidad" description="Consulta disponibilidad para fechas de eventos." />
      <h1 className="h3">Disponibilidad</h1>
      <form className="row g-3 mb-4" onSubmit={handleSubmit(setFilters)} noValidate>
        <div className="col-md-5"><label className="form-label" htmlFor="desde">Desde</label><input id="desde" className="form-control" type="date" {...register('desde')} />{errors.desde ? <div className="text-danger small">{errors.desde.message}</div> : null}</div>
        <div className="col-md-5"><label className="form-label" htmlFor="hasta">Hasta</label><input id="hasta" className="form-control" type="date" {...register('hasta')} />{errors.hasta ? <div className="text-danger small">{errors.hasta.message}</div> : null}</div>
        <div className="col-md-2 d-flex align-items-end"><button className="btn btn-dark w-100" type="submit">Consultar</button></div>
      </form>
      {!filters ? <EmptyState title="Elegir fechas" message="Selecciona un rango para consultar disponibilidad." /> : null}
      {disponibilidad.data?.length === 0 ? <EmptyState title="Sin eventos bloqueantes" message="No se informan ocupaciones para el rango." /> : null}
      <div className="row g-3">{(disponibilidad.data ?? []).map((item, index) => <div className="col-md-4" key={index}><div className="card border-0 shadow-sm"><div className="card-body"><strong>{item.fecha ?? item.fechaInicioUtc ?? '-'}</strong><p className="mb-0 text-secondary">{item.disponible === false ? 'Ocupado' : item.estado ?? 'Disponible'}</p></div></div></div>)}</div>
    </main>
  );
}
