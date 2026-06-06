import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { routes } from '@/config/routes';
import { useBootstrapBundle } from '@/shared/hooks/useBootstrapBundle';

export function PublicLayout() {
  useBootstrapBundle();
  const { isAuthenticated, isAdmin } = useAuth();
  const panelPath = isAdmin ? routes.admin.dashboard : routes.user.dashboard;

  return (
    <div className="app-shell bg-white">
      <nav className="navbar navbar-expand-lg bg-white border-bottom">
        <div className="container">
          <Link className="navbar-brand fw-semibold" to={routes.public.root}>
            GaleriaFotos
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#publicNav"
            aria-controls="publicNav"
            aria-expanded="false"
            aria-label="Abrir navegacion"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="publicNav">
            <div className="navbar-nav me-auto">
              <NavLink className="nav-link" to={routes.public.home}>
                Home
              </NavLink>
              <NavLink className="nav-link" to={routes.public.servicios}>
                Servicios
              </NavLink>
              <NavLink className="nav-link" to={routes.public.portfolio}>
                Portfolio
              </NavLink>
              <NavLink className="nav-link" to={routes.public.promociones}>
                Promociones
              </NavLink>
              <NavLink className="nav-link" to={routes.public.faq}>
                FAQ
              </NavLink>
              <NavLink className="nav-link" to={routes.public.contacto}>
                Contacto
              </NavLink>
            </div>
            <Link className="btn btn-outline-dark btn-sm" to={isAuthenticated ? panelPath : routes.auth.login}>
              {isAuthenticated ? 'Panel' : 'Login'}
            </Link>
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
