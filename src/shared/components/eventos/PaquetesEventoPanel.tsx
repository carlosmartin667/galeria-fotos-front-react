import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addPaqueteEventoCarrito } from '@/services/carrito/carritoApi';
import { queryKeys } from '@/services/api/queryKeys';
import { getPaquetesEvento } from '@/services/eventos/eventosApi';
import { sanitizeSensitiveText } from '@/shared/utils/sensitiveText';

export function PaquetesEventoPanel({ eventoId }: { eventoId: string }) {
  const queryClient = useQueryClient();
  const paquetes = useQuery({ queryKey: queryKeys.eventos.paquetes(eventoId), queryFn: () => getPaquetesEvento(eventoId), enabled: Boolean(eventoId) });
  const add = useMutation({ mutationFn: addPaqueteEventoCarrito, onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.carrito.root }) });

  if (!paquetes.data?.length) return null;

  return (
    <section className="mt-4">
      <h2 className="h5">Paquetes</h2>
      <div className="row g-3">
        {paquetes.data.map((paquete) => (
          <div className="col-12 col-md-4" key={paquete.id}>
            <article className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h3 className="h6">{sanitizeSensitiveText(paquete.nombre)}</h3>
                {paquete.descripcion ? <p className="text-secondary">{sanitizeSensitiveText(paquete.descripcion)}</p> : null}
                <p className="fw-semibold">${paquete.precio ?? 0}</p>
                <button className="btn btn-sm btn-dark" type="button" onClick={() => add.mutate(paquete.id)}>Agregar al carrito</button>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
