import { useMutation } from '@tanstack/react-query';
import { crearPreferenciaCheckoutPro, getCheckoutUrl } from '@/services/pagos/pagosApi';

function safeCheckoutUrl(rawUrl: string) {
  try {
    const url = new URL(rawUrl);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : '';
  } catch {
    return '';
  }
}

export function PagoCheckoutButton({ pedidoId }: { pedidoId: string }) {
  const checkout = useMutation({ mutationFn: () => crearPreferenciaCheckoutPro({ pedidoId }) });
  const checkoutUrl = checkout.data ? safeCheckoutUrl(getCheckoutUrl(checkout.data)) : '';

  if (checkoutUrl) {
    return <button className="btn btn-success" type="button" onClick={() => window.location.assign(checkoutUrl)}>Continuar al pago</button>;
  }

  return (
    <div className="d-flex align-items-center gap-2 flex-wrap">
      <button className="btn btn-dark" type="button" disabled={checkout.isPending} onClick={() => checkout.mutate()}>
        {checkout.isPending ? 'Preparando pago...' : 'Pagar con Mercado Pago'}
      </button>
      {checkout.isSuccess ? <span className="small text-secondary">Preferencia creada.</span> : null}
      {checkout.isError ? <span className="small text-danger">No se pudo preparar el pago.</span> : null}
    </div>
  );
}
