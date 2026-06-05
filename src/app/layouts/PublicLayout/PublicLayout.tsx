import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';

export function PublicLayout() {
  const { isAuthenticated, isAdmin } = useAuth();
  const panelPath = isAdmin ? '/admin/dashboard' : '/dashboard';

  return (
    <div className="app-shell bg-white">
      <nav className="navbar navbar-expand-lg bg-white border-bottom">
        <div className="container">
          <Link className="navbar-brand fw-semibold" to="/">
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
              <NavLink className="nav-link" to="/home">
                Home
              </NavLink>
              <a className="nav-link" href="/home#servicios">
                Servicios
              </a>
              <a className="nav-link" href="/home#portfolio">
                Portfolio
              </a>
              <a className="nav-link" href="/home#contacto">
                Contacto
              </a>
            </div>
            <Link className="btn btn-outline-dark btn-sm" to={isAuthenticated ? panelPath : '/login'}>
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
