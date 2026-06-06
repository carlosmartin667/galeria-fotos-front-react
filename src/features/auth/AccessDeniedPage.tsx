import { Link } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { routes } from '@/config/routes';

export function AccessDeniedPage() {
  const { isAdmin } = useAuth();
  const destination = isAdmin ? routes.admin.dashboard : routes.user.dashboard;

  return (
    <section className="container py-5">
      <div className="alert alert-warning" role="alert">
        <h1 className="h4">Acceso denegado</h1>
        <p>No tenes permisos para acceder a esta seccion.</p>
        <Link className="btn btn-dark btn-sm" to={destination}>
          Volver al panel
        </Link>
      </div>
    </section>
  );
}
