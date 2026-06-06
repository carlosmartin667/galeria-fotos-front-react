import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { routes } from '@/config/routes';
import { queryKeys } from '@/services/api/queryKeys';
import { getSitioContacto } from '@/services/sitio/sitioApi';
import { ErrorState } from '@/shared/components/ErrorState';
import { LoadingState } from '@/shared/components/LoadingState';
import { Seo } from '@/shared/components/Seo';

export function ContactoPage() {
  const contacto = useQuery({ queryKey: queryKeys.sitio.contacto(), queryFn: getSitioContacto });
  if (contacto.isLoading) return <LoadingState />;
  if (contacto.isError) return <main className="container py-5"><ErrorState /></main>;
  const data = contacto.data ?? {};

  return (
    <main className="container py-5">
      <Seo title="Contacto" description="Contacta a GaleriaFotos para consultas y presupuestos." />
      <h1 className="h3">Contacto</h1>
      <p className="text-secondary">Escribinos para coordinar tu evento o sesion.</p>
      <dl className="row">
        <dt className="col-sm-3">Email</dt><dd className="col-sm-9">{data.email || '-'}</dd>
        <dt className="col-sm-3">Telefono</dt><dd className="col-sm-9">{data.telefono || data.whatsApp || '-'}</dd>
        <dt className="col-sm-3">Direccion</dt><dd className="col-sm-9">{data.direccion || '-'}</dd>
      </dl>
      <Link className="btn btn-dark" to={routes.public.presupuesto}>Solicitar presupuesto</Link>
    </main>
  );
}
