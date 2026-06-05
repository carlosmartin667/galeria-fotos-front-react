import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';

const userLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dashboard#eventos', label: 'Eventos' },
  { to: '/dashboard#carrito', label: 'Carrito' },
  { to: '/dashboard#pedidos', label: 'Pedidos' },
  { to: '/dashboard#descargas', label: 'Descargas' },
];

export function UserLayout() {
  const { logout, session, isAdmin } = useAuth();

  return (
    <div className="app-shell">
      <nav className="navbar navbar-expand-lg bg-white border-bottom">
        <div className="container-fluid px-4">
          <Link className="navbar-brand fw-semibold" to="/dashboard">
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
                <NavLink className="nav-link" to="/admin/dashboard">
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
