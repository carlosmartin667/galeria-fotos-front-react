import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from '@/app/layouts/AdminLayout/AdminLayout';
import { PublicLayout } from '@/app/layouts/PublicLayout/PublicLayout';
import { UserLayout } from '@/app/layouts/UserLayout/UserLayout';
import { LoginPage } from '@/features/auth/LoginPage';
import { RegisterPage } from '@/features/auth/RegisterPage';
import { AdminBitacoraPage } from '@/features/admin/AdminBitacoraPage';
import { AdminDashboardPage } from '@/features/admin/AdminDashboardPage';
import { AdminDevToolsPage } from '@/features/admin/AdminDevToolsPage';
import { HomePage } from '@/features/public/HomePage';
import { UserDashboardPage } from '@/features/user/UserDashboardPage';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="home" element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<UserLayout />}>
            <Route path="dashboard" element={<UserDashboardPage />} />
          </Route>

          <Route element={<RoleRoute roles={['Admin']} />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="bitacora" element={<AdminBitacoraPage />} />
              <Route path="dev-tools" element={<AdminDevToolsPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
