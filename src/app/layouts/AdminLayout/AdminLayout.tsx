import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';

const navGroups = [
  {
    label: 'Principal',
    links: [{ to: '/admin/dashboard', label: 'Dashboard' }],
  },
  {
    label: 'Sistema',
    links: [
      { to: '/admin/bitacora', label: 'Bitacora' },
      { to: '/admin/dev-tools', label: 'DevTools' },
    ],
  },
];

function SidebarContent() {
  return (
    <div className="p-3 h-100">
      <Link className="d-block h5 text-white mb-4" to="/admin/dashboard">
        GaleriaFotos
      </Link>
      {navGroups.map((group) => (
        <div className="mb-4" key={group.label}>
          <div className="text-uppercase small text-secondary fw-semibold mb-2">{group.label}</div>
          <div className="nav nav-pills flex-column gap-1">
            {group.links.map((link) => (
              <NavLink className="nav-link" key={link.to} to={link.to}>
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminLayout() {
  const { logout, session } = useAuth();

  return (
    <div className="app-shell d-lg-flex">
      <aside className="gf-admin-sidebar gf-admin-desktop-sidebar d-none d-lg-block">
        <SidebarContent />
      </aside>

      <div
        className="offcanvas offcanvas-start gf-admin-sidebar"
        tabIndex={-1}
        id="adminSidebar"
        aria-labelledby="adminSidebarLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title text-white" id="adminSidebarLabel">
            GaleriaFotos
          </h5>
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Cerrar" />
        </div>
        <div className="offcanvas-body p-0">
          <SidebarContent />
        </div>
      </div>

      <div className="gf-admin-content">
        <header className="navbar bg-white border-bottom px-3 px-lg-4">
          <button
            className="btn btn-outline-secondary btn-sm d-lg-none"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#adminSidebar"
            aria-controls="adminSidebar"
          >
            Menu
          </button>
          <div className="ms-auto d-flex align-items-center gap-3">
            <button className="btn btn-outline-secondary btn-sm" type="button" aria-label="Cambiar tema">
              Theme
            </button>
            <span className="small text-secondary">{session?.user.email}</span>
            <button className="btn btn-dark btn-sm" type="button" onClick={logout}>
              Salir
            </button>
          </div>
        </header>
        <main className="p-3 p-lg-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
