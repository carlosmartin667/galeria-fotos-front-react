import { Navigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { routes } from '@/config/routes';
import { getCurrentSessionProfile } from '@/services/auth/profileApi';

export function ProfilePage() {
  const { session } = useAuth();
  const profile = getCurrentSessionProfile(session);

  if (!profile) {
    return <Navigate to={routes.auth.login} replace />;
  }

  return (
    <section>
      <h1 className="h3">Mi perfil</h1>
      <p className="text-secondary">Datos seguros disponibles para la sesion actual.</p>
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <dl className="row mb-0">
            <dt className="col-sm-3">Nombre</dt>
            <dd className="col-sm-9">{profile.name || '-'}</dd>
            <dt className="col-sm-3">Email</dt>
            <dd className="col-sm-9">{profile.email}</dd>
            <dt className="col-sm-3">Roles</dt>
            <dd className="col-sm-9">{profile.roles.join(', ')}</dd>
          </dl>
        </div>
      </div>
    </section>
  );
}
