import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { routes } from '@/config/routes';
import { queryKeys } from '@/services/api/queryKeys';
import { getDescargas } from '@/services/descargas/descargasApi';
import { getEventos } from '@/services/eventos/eventosApi';
import { getFavoritos } from '@/services/favoritos/favoritosApi';
import { getPedidos } from '@/services/pedidos/pedidosApi';
import { Seo } from '@/shared/components/Seo';

export function UserDashboardPage() {
  const { session } = useAuth();
  const eventos = useQuery({ queryKey: queryKeys.eventos.list(), queryFn: getEventos });
  const pedidos = useQuery({ queryKey: queryKeys.pedidos.list(), queryFn: getPedidos });
  const descargas = useQuery({ queryKey: queryKeys.descargas.list(), queryFn: getDescargas });
  const favoritos = useQuery({ queryKey: queryKeys.favoritos.list(), queryFn: getFavoritos });
  const cards = [
    { label: 'Eventos', value: eventos.data?.length ?? 0, to: routes.user.eventos },
    { label: 'Pedidos recientes', value: pedidos.data?.length ?? 0, to: routes.user.pedidos },
    { label: 'Descargas disponibles', value: descargas.data?.length ?? 0, to: routes.user.descargas },
    { label: 'Favoritos', value: favoritos.data?.length ?? 0, to: routes.user.favoritos },
  ];
  return <section><Seo title="Dashboard" description="Panel cliente"/><h1 className="h3">Dashboard</h1><p className="text-secondary">Sesion activa para {session?.user.email}.</p><div className="row g-3">{cards.map(c=><div className="col-12 col-md-6 col-xl-3" key={c.label}><Link className="card border-0 shadow-sm text-body h-100" to={c.to}><div className="card-body"><div className="h2">{c.value}</div><h2 className="h6">{c.label}</h2></div></Link></div>)}</div><div className="mt-4 d-flex gap-2"><Link className="btn btn-dark" to={routes.user.eventos}>Ver eventos</Link><Link className="btn btn-outline-dark" to={routes.user.carrito}>Ir al carrito</Link></div></section>;
}
