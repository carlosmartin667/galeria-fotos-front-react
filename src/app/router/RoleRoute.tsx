import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { isAdminRole } from '@/config/roles';
import { routes } from '@/config/routes';
import type { UserRole } from '@/types/auth';

export function RoleRoute({ roles }: { roles: UserRole[] }) {
  const { hasAnyRole, session } = useAuth();

  if (!hasAnyRole(roles)) {
    if (session?.user.roles.some(isAdminRole)) {
      return <Navigate to={routes.admin.dashboard} replace />;
    }
    return <Navigate to={routes.accessDenied} replace />;
  }

  return <Outlet />;
}
