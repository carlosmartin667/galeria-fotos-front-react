import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { queryKeys } from '@/services/api/queryKeys';
import { createComentarioEvento, createComentarioFoto, deleteComentarioEvento, deleteComentarioFoto, getComentariosEvento, getComentariosFoto, updateComentarioEvento, updateComentarioFoto } from '@/services/comentarios/comentariosApi';
import { sanitizeSensitiveText } from '@/shared/utils/sensitiveText';

const schema = z.object({ texto: z.string().trim().min(1, 'El comentario no puede estar vacio.').max(1000) });
type ComentarioForm = z.infer<typeof schema>;

export function ComentariosPanel({ targetType, targetId, canModerate = false }: { targetType: 'evento' | 'foto'; targetId: string; canModerate?: boolean }) {
  const queryClient = useQueryClient();
  const queryKey = targetType === 'evento' ? queryKeys.eventos.comentarios(targetId) : queryKeys.comentariosFotos.list(targetId);
  const comentarios = useQuery({
    queryKey,
    queryFn: () => targetType === 'evento' ? getComentariosEvento(targetId) : getComentariosFoto(targetId),
    enabled: Boolean(targetId),
  });
  const form = useForm<ComentarioForm>({ resolver: zodResolver(schema), defaultValues: { texto: '' } });
  const invalidate = () => queryClient.invalidateQueries({ queryKey });
  const create = useMutation({
    mutationFn: (payload: ComentarioForm) => targetType === 'evento' ? createComentarioEvento(targetId, payload) : createComentarioFoto(targetId, payload),
    onSuccess: () => { form.reset(); invalidate(); },
  });
  const remove = useMutation({
    mutationFn: (comentarioId: string) => targetType === 'evento' ? deleteComentarioEvento(comentarioId) : deleteComentarioFoto(comentarioId),
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: ({ comentarioId, texto }: { comentarioId: string; texto: string }) => targetType === 'evento' ? updateComentarioEvento(comentarioId, { texto }) : updateComentarioFoto(comentarioId, { texto }),
    onSuccess: invalidate,
  });

  return (
    <section className="mt-4">
      <h2 className="h5">Comentarios</h2>
      <form className="mb-3" onSubmit={form.handleSubmit((values) => create.mutate(values))}>
        <label className="form-label" htmlFor={`comentario-${targetType}-${targetId}`}>Nuevo comentario</label>
        <textarea id={`comentario-${targetType}-${targetId}`} className="form-control" rows={3} aria-invalid={Boolean(form.formState.errors.texto)} {...form.register('texto')} />
        {form.formState.errors.texto ? <div className="text-danger small">{form.formState.errors.texto.message}</div> : null}
        <button className="btn btn-dark btn-sm mt-2" type="submit">Comentar</button>
      </form>
      {(comentarios.data ?? []).map((comentario) => (
        <article className="card border-0 shadow-sm mb-2" key={comentario.id}>
          <div className="card-body">
            <p className="mb-1">{sanitizeSensitiveText(comentario.texto ?? '')}</p>
            <p className="small text-secondary mb-0">{comentario.autorNombre ?? 'Usuario'}</p>
            {canModerate ? (
              <div className="d-flex gap-2 mt-2">
                <button className="btn btn-sm btn-outline-dark" type="button" onClick={() => {
                  const texto = window.prompt('Editar comentario', comentario.texto ?? '')?.trim();
                  if (texto && window.confirm('Confirmar cambios')) update.mutate({ comentarioId: comentario.id, texto });
                }}>Editar</button>
                <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => window.confirm('Confirmar eliminacion') && remove.mutate(comentario.id)}>Eliminar</button>
              </div>
            ) : null}
          </div>
        </article>
      ))}
    </section>
  );
}
