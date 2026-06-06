import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { queryKeys } from '@/services/api/queryKeys';
import { createAgendaAdmin, getAgendaAdmin } from '@/services/admin/agendaAdminApi';
import { AdminFormSection, AdminPageHeader } from '@/shared/components/admin/AdminPrimitives';
import { AdminTable } from '@/shared/components/admin/AdminTable';
import { NotasInternasPanel } from '@/shared/components/admin/NotasInternasPanel';

const schema = z.object({ titulo:z.string().min(2), tipo:z.string().min(1), fechaInicioUtc:z.string().min(1), fechaFinUtc:z.string().min(1) }).refine(v=>new Date(v.fechaFinUtc)>new Date(v.fechaInicioUtc),{path:['fechaFinUtc'],message:'La fecha fin debe ser posterior'});
type Form=z.infer<typeof schema>;
export function AdminAgendaPage(){ const qc=useQueryClient(); const [selectedId,setSelectedId]=useState(''); const q=useQuery({queryKey:queryKeys.admin.agenda(),queryFn:()=>getAgendaAdmin()}); const form=useForm<Form>({resolver:zodResolver(schema)}); const m=useMutation({mutationFn:createAgendaAdmin,onSuccess:()=>qc.invalidateQueries({queryKey:queryKeys.admin.agenda()})}); return <section><AdminPageHeader title="Agenda"/><AdminFormSection title="Nuevo item"><form className="row g-2" onSubmit={form.handleSubmit(v=>m.mutate(v))}><input className="form-control" placeholder="Titulo" aria-label="Titulo" {...form.register('titulo')}/><input className="form-control" placeholder="Tipo" aria-label="Tipo" {...form.register('tipo')}/><input className="form-control" type="datetime-local" aria-label="Fecha inicio" {...form.register('fechaInicioUtc')}/><input className="form-control" type="datetime-local" aria-label="Fecha fin" aria-invalid={Boolean(form.formState.errors.fechaFinUtc)} {...form.register('fechaFinUtc')}/>{form.formState.errors.fechaFinUtc?<div className="text-danger small">{form.formState.errors.fechaFinUtc.message}</div>:null}<button className="btn btn-dark">Guardar</button></form></AdminFormSection><AdminTable rows={q.data??[]} columns={[{header:'Titulo',render:(r:any)=>r.titulo},{header:'Estado',render:(r:any)=>r.estado??'-'},{header:'Notas',render:(r:any)=><button className="btn btn-sm btn-outline-dark" type="button" onClick={()=>setSelectedId(r.id)}>Ver notas</button>}]}/>{selectedId?<NotasInternasPanel entidadTipo="Agenda" entidadId={selectedId}/>:null}</section>}
