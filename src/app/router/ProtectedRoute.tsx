import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { getLoginRoute } from '@/config/routes';

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={getLoginRoute(`${location.pathname}${location.search}`)} replace />;
  }

  return <Outlet />;
}
