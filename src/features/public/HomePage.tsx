import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { routes } from '@/config/routes';
import { queryKeys } from '@/services/api/queryKeys';
import { getPerfilFotografaPublico, getSitioHome } from '@/services/sitio/sitioApi';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { LoadingState } from '@/shared/components/LoadingState';
import { Seo } from '@/shared/components/Seo';
import { PublicCard } from './components/PublicCards';

export function HomePage() {
  const home = useQuery({ queryKey: queryKeys.sitio.home(), queryFn: getSitioHome });
  const perfil = useQuery({ queryKey: queryKeys.sitio.perfilFotografa(), queryFn: getPerfilFotografaPublico });

  if (home.isLoading) return <LoadingState />;
  if (home.isError) return <main className="container py-5"><ErrorState /></main>;

  const data = home.data ?? {};
  const perfilPublico = perfil.data ?? {};

  return (
    <>
      <Seo title="Home" description="Fotografia profesional para eventos, sesiones privadas y galerias digitales." />
      <section className="gf-public-hero">
        <div className="container">
          <div className="col-12 col-lg-7">
            <h1 className="display-5 fw-semibold">{data.titulo || perfilPublico.nombre || 'GaleriaFotos'}</h1>
            <p className="lead">{data.subtitulo || perfilPublico.textoBienvenida || data.descripcion || perfilPublico.descripcion || 'Fotografia de eventos con entrega digital segura.'}</p>
            <div className="d-flex gap-2 flex-wrap">
              <Link className="btn btn-light" to={routes.public.presupuesto}>Solicitar presupuesto</Link>
              <Link className="btn btn-outline-light" to={routes.public.portfolio}>Ver portfolio</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <h2 className="h4 mb-3">Servicios destacados</h2>
        <div className="row g-3">
          {(data.serviciosDestacados ?? []).slice(0, 3).map((servicio) => (
            <div className="col-12 col-md-4" key={servicio.id}>
              <PublicCard title={servicio.nombre} description={servicio.descripcion} imageUrl={servicio.imagenUrl} to={routes.public.servicioDetail(servicio.id)} />
            </div>
          ))}
        </div>
        {(data.serviciosDestacados ?? []).length === 0 ? <EmptyState /> : null}
      </section>

      <section className="container py-5 border-top">
        <h2 className="h4 mb-3">Portfolio</h2>
        <div className="row g-3">
          {(data.portfolioDestacado ?? []).slice(0, 3).map((item) => (
            <div className="col-12 col-md-4" key={item.id}>
              <PublicCard title={item.titulo} description={item.descripcion} imageUrl={item.imagenUrl} to={routes.public.portfolioDetail(item.id)} meta={item.categoria} />
            </div>
          ))}
        </div>
      </section>

      <section className="container py-5 border-top">
        <h2 className="h4 mb-3">Testimonios</h2>
        <div className="row g-3">
          {(data.testimoniosDestacados ?? []).slice(0, 3).map((testimonio) => (
            <div className="col-12 col-md-4" key={testimonio.id}>
              <blockquote className="card border-0 shadow-sm h-100 mb-0">
                <div className="card-body">
                  <p>{testimonio.texto}</p>
                  <footer className="small text-secondary">{testimonio.nombreCliente}</footer>
                </div>
              </blockquote>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
