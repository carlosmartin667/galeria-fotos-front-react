import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { routes } from '@/config/routes';
import { useBootstrapBundle } from '@/shared/hooks/useBootstrapBundle';

const userLinks = [
  { to: routes.user.dashboard, label: 'Dashboard' },
  { to: routes.user.eventos, label: 'Eventos' },
  { to: routes.user.fotos, label: 'Fotos' },
  { to: routes.user.favoritos, label: 'Favoritos' },
  { to: routes.user.carrito, label: 'Carrito' },
  { to: routes.user.pedidos, label: 'Mis pedidos' },
  { to: routes.user.descargas, label: 'Mis descargas' },
  { to: routes.user.historial, label: 'Mi historial' },
  { to: routes.user.notificaciones, label: 'Notificaciones' },
  { to: routes.user.profile, label: 'Mi perfil' },
];

export function UserLayout() {
  useBootstrapBundle();
  const { logout, session, isAdmin } = useAuth();

  return (
    <div className="app-shell">
      <nav className="navbar navbar-expand-lg bg-white border-bottom">
        <div className="container-fluid px-4">
          <Link className="navbar-brand fw-semibold" to={routes.user.dashboard}>
            GaleriaFotos
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#userNav"
            aria-controls="userNav"
            aria-expanded="false"
            aria-label="Abrir navegacion"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="userNav">
            <div className="navbar-nav me-auto">
              {userLinks.map((link) => (
                <NavLink key={link.label} className="nav-link" to={link.to}>
                  {link.label}
                </NavLink>
              ))}
              {isAdmin ? (
                <NavLink className="nav-link" to={routes.admin.dashboard}>
                  Admin
                </NavLink>
              ) : null}
            </div>
            <div className="d-flex align-items-center gap-3">
              <span className="small text-secondary">{session?.user.email}</span>
              <button className="btn btn-outline-secondary btn-sm" type="button" onClick={logout}>
                Salir
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="container-fluid p-4">
        <Outlet />
      </main>
    </div>
  );
}
