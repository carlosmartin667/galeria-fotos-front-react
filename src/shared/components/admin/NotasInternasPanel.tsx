import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createNotaInternaAdmin, deleteNotaInternaAdmin, getNotasInternasAdmin, updateNotaInternaAdmin } from '@/services/admin/notasInternasApi';
import { queryKeys } from '@/services/api/queryKeys';
import { sanitizeSensitiveText } from '@/shared/utils/sensitiveText';

const notaSchema = z.object({ texto: z.string().trim().min(1, 'La nota no puede estar vacia.').max(2000) });
type NotaForm = z.infer<typeof notaSchema>;

export function NotasInternasPanel({ entidadTipo, entidadId }: { entidadTipo: string; entidadId: string }) {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState('');
  const [editingText, setEditingText] = useState('');
  const queryKey = queryKeys.admin.notasInternas(entidadTipo, entidadId);
  const notas = useQuery({ queryKey, queryFn: () => getNotasInternasAdmin(entidadTipo, entidadId), enabled: Boolean(entidadTipo && entidadId) });
  const form = useForm<NotaForm>({ resolver: zodResolver(notaSchema), defaultValues: { texto: '' } });
  const invalidate = () => queryClient.invalidateQueries({ queryKey });
  const create = useMutation({ mutationFn: (payload: NotaForm) => createNotaInternaAdmin(entidadTipo, entidadId, payload), onSuccess: () => { form.reset(); invalidate(); } });
  const update = useMutation({ mutationFn: ({ id, texto }: { id: string; texto: string }) => updateNotaInternaAdmin(id, { texto, activa: true }), onSuccess: () => { setEditingId(''); invalidate(); } });
  const remove = useMutation({ mutationFn: deleteNotaInternaAdmin, onSuccess: invalidate });

  return (
    <section className="card border-0 shadow-sm mt-4">
      <div className="card-body">
        <h2 className="h5">Notas internas</h2>
        <form className="mb-3" onSubmit={form.handleSubmit((values) => create.mutate(values))}>
          <label className="form-label" htmlFor={`nota-${entidadTipo}-${entidadId}`}>Nueva nota</label>
          <textarea id={`nota-${entidadTipo}-${entidadId}`} className="form-control" rows={3} aria-invalid={Boolean(form.formState.errors.texto)} {...form.register('texto')} />
          {form.formState.errors.texto ? <div className="text-danger small">{form.formState.errors.texto.message}</div> : null}
          <button className="btn btn-dark btn-sm mt-2" type="submit">Agregar nota</button>
        </form>
        {(notas.data ?? []).map((nota) => (
          <div className="border-top py-2" key={nota.id}>
            {editingId === nota.id ? (
              <div>
                <textarea className="form-control" aria-label="Editar nota" rows={3} value={editingText} onChange={(event) => setEditingText(event.target.value)} />
                <div className="d-flex gap-2 mt-2">
                  <button className="btn btn-sm btn-dark" type="button" onClick={() => editingText.trim() && window.confirm('Confirmar cambios') && update.mutate({ id: nota.id, texto: editingText.trim() })}>Guardar cambios</button>
                  <button className="btn btn-sm btn-outline-secondary" type="button" onClick={() => setEditingId('')}>Cancelar</button>
                </div>
              </div>
            ) : (
              <>
                <p className="mb-1">{sanitizeSensitiveText(nota.texto ?? '')}</p>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-dark" type="button" onClick={() => { setEditingId(nota.id); setEditingText(nota.texto ?? ''); }}>Editar</button>
                  <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => window.confirm('Confirmar eliminacion') && remove.mutate(nota.id)}>Eliminar</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
