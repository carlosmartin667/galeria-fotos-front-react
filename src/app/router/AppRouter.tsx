import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from '@/app/layouts/AdminLayout/AdminLayout';
import { PublicLayout } from '@/app/layouts/PublicLayout/PublicLayout';
import { UserLayout } from '@/app/layouts/UserLayout/UserLayout';
import { roles } from '@/config/roles';
import { routes } from '@/config/routes';
import { AccessDeniedPage } from '@/features/auth/AccessDeniedPage';
import { RegisterPage } from '@/features/auth/RegisterPage';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { LoadingState } from '@/shared/components/LoadingState';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';

const HomePage = lazy(() => import('@/features/public/HomePage').then((module) => ({ default: module.HomePage })));
const PortfolioPage = lazy(() => import('@/features/public/PortfolioPage').then((module) => ({ default: module.PortfolioPage })));
const PortfolioDetailPage = lazy(() => import('@/features/public/PortfolioDetailPage').then((module) => ({ default: module.PortfolioDetailPage })));
const ServiciosPage = lazy(() => import('@/features/public/ServiciosPage').then((module) => ({ default: module.ServiciosPage })));
const ServicioDetailPage = lazy(() => import('@/features/public/ServicioDetailPage').then((module) => ({ default: module.ServicioDetailPage })));
const FaqPage = lazy(() => import('@/features/public/FaqPage').then((module) => ({ default: module.FaqPage })));
const ContactoPage = lazy(() => import('@/features/public/ContactoPage').then((module) => ({ default: module.ContactoPage })));
const PresupuestoPage = lazy(() => import('@/features/public/PresupuestoPage').then((module) => ({ default: module.PresupuestoPage })));
const DisponibilidadPage = lazy(() => import('@/features/public/DisponibilidadPage').then((module) => ({ default: module.DisponibilidadPage })));
const PromocionesPage = lazy(() => import('@/features/public/PromocionesPage').then((module) => ({ default: module.PromocionesPage })));
const PromocionDetailPage = lazy(() => import('@/features/public/PromocionDetailPage').then((module) => ({ default: module.PromocionDetailPage })));
const TestimoniosPage = lazy(() => import('@/features/public/TestimoniosPage').then((module) => ({ default: module.TestimoniosPage })));
const LoginPage = lazy(() => import('@/features/auth/LoginPage').then((module) => ({ default: module.LoginPage })));
const UserDashboardPage = lazy(() =>
  import('@/features/user/UserDashboardPage').then((module) => ({ default: module.UserDashboardPage })),
);
const EventosPage = lazy(() => import('@/features/user/EventosPage').then((m) => ({ default: m.EventosPage })));
const EventoDetailPage = lazy(() => import('@/features/user/EventoDetailPage').then((m) => ({ default: m.EventoDetailPage })));
const FotosPage = lazy(() => import('@/features/user/FotosPage').then((m) => ({ default: m.FotosPage })));
const FotoDetailPage = lazy(() => import('@/features/user/FotoDetailPage').then((m) => ({ default: m.FotoDetailPage })));
const FavoritosPage = lazy(() => import('@/features/user/FavoritosPage').then((m) => ({ default: m.FavoritosPage })));
const CarritoPage = lazy(() => import('@/features/user/CarritoPage').then((m) => ({ default: m.CarritoPage })));
const PedidosPage = lazy(() => import('@/features/user/PedidosPage').then((m) => ({ default: m.PedidosPage })));
const PedidoDetailPage = lazy(() => import('@/features/user/PedidoDetailPage').then((m) => ({ default: m.PedidoDetailPage })));
const DescargasPage = lazy(() => import('@/features/user/DescargasPage').then((m) => ({ default: m.DescargasPage })));
const DescargaDetailPage = lazy(() => import('@/features/user/DescargaDetailPage').then((m) => ({ default: m.DescargaDetailPage })));
const HistorialPage = lazy(() => import('@/features/user/HistorialPage').then((m) => ({ default: m.HistorialPage })));
const NotificacionesPage = lazy(() => import('@/features/user/NotificacionesPage').then((m) => ({ default: m.NotificacionesPage })));
const ProfilePage = lazy(() =>
  import('@/features/user/profile/ProfilePage').then((module) => ({ default: module.ProfilePage })),
);
const AdminDashboardPage = lazy(() =>
  import('@/features/admin/AdminDashboardPage').then((module) => ({ default: module.AdminDashboardPage })),
);
const AdminBitacoraPage = lazy(() =>
  import('@/features/admin/AdminBitacoraPage').then((module) => ({ default: module.AdminBitacoraPage })),
);
const AdminDevToolsPage = lazy(() =>
  import('@/features/admin/AdminDevToolsPage').then((module) => ({ default: module.AdminDevToolsPage })),
);
const AdminGenericListPage = lazy(() =>
  import('@/features/admin/r5/AdminGenericListPage').then((module) => ({ default: module.AdminGenericListPage })),
);
const AdminSummaryPage = lazy(() =>
  import('@/features/admin/r5/AdminSummaryPage').then((module) => ({ default: module.AdminSummaryPage })),
);
const AdminEventFormPage = lazy(() =>
  import('@/features/admin/r5/AdminEventFormPage').then((module) => ({ default: module.AdminEventFormPage })),
);
const AdminEventoDetailPage = lazy(() =>
  import('@/features/admin/r5/AdminEventoDetailPage').then((module) => ({ default: module.AdminEventoDetailPage })),
);
const AdminFotosToolsPage = lazy(() =>
  import('@/features/admin/r5/AdminFotosToolsPage').then((module) => ({ default: module.AdminFotosToolsPage })),
);
const AdminFotosEventoPage = lazy(() =>
  import('@/features/admin/r5/AdminFotosEventoPage').then((module) => ({ default: module.AdminFotosEventoPage })),
);
const AdminFotoDetailPage = lazy(() =>
  import('@/features/admin/r5/AdminFotoDetailPage').then((module) => ({ default: module.AdminFotoDetailPage })),
);
const AdminClienteHistorialPage = lazy(() =>
  import('@/features/admin/r5/AdminClienteHistorialPage').then((module) => ({ default: module.AdminClienteHistorialPage })),
);
const AdminPedidoDetailPage = lazy(() =>
  import('@/features/admin/r5/AdminPedidoDetailPage').then((module) => ({ default: module.AdminPedidoDetailPage })),
);
const AdminDescargaDetailPage = lazy(() =>
  import('@/features/admin/r5/AdminDescargaDetailPage').then((module) => ({ default: module.AdminDescargaDetailPage })),
);
const AdminPresupuestoDetailPage = lazy(() =>
  import('@/features/admin/r5/AdminPresupuestoDetailPage').then((module) => ({ default: module.AdminPresupuestoDetailPage })),
);
const AdminNotificacionDetailPage = lazy(() =>
  import('@/features/admin/r5/AdminNotificacionDetailPage').then((module) => ({ default: module.AdminNotificacionDetailPage })),
);
const AdminAgendaPage = lazy(() =>
  import('@/features/admin/r5/AdminAgendaPage').then((module) => ({ default: module.AdminAgendaPage })),
);
const AdminSesionesPrivadasPage = lazy(() =>
  import('@/features/admin/r5/AdminSesionesPrivadasPage').then((module) => ({ default: module.AdminSesionesPrivadasPage })),
);
const AdminSesionPrivadaDetailPage = lazy(() =>
  import('@/features/admin/r5/AdminSesionPrivadaDetailPage').then((module) => ({ default: module.AdminSesionPrivadaDetailPage })),
);
const AdminCuponesPage = lazy(() =>
  import('@/features/admin/r5/AdminCuponesPage').then((module) => ({ default: module.AdminCuponesPage })),
);
const AdminReportesVentasPage = lazy(() =>
  import('@/features/admin/r5/AdminReportesVentasPage').then((module) => ({ default: module.AdminReportesVentasPage })),
);
const AdminMiPerfilPage = lazy(() =>
  import('@/features/admin/r5/AdminMiPerfilPage').then((module) => ({ default: module.AdminMiPerfilPage })),
);

export function AppRouter() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingState label="Cargando seccion..." />}>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="home" element={<HomePage />} />
              <Route path="portfolio" element={<PortfolioPage />} />
              <Route path="portfolio/:id" element={<PortfolioDetailPage />} />
              <Route path="servicios" element={<ServiciosPage />} />
              <Route path="servicios/:id" element={<ServicioDetailPage />} />
              <Route path="faq" element={<FaqPage />} />
              <Route path="contacto" element={<ContactoPage />} />
              <Route path="presupuesto" element={<PresupuestoPage />} />
              <Route path="disponibilidad" element={<DisponibilidadPage />} />
              <Route path="promociones" element={<PromocionesPage />} />
              <Route path="promociones/:id" element={<PromocionDetailPage />} />
              <Route path="testimonios" element={<TestimoniosPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route element={<UserLayout />}>
                <Route path="dashboard" element={<UserDashboardPage />} />
                <Route path="eventos" element={<EventosPage />} />
                <Route path="eventos/:id" element={<EventoDetailPage />} />
                <Route path="fotos" element={<FotosPage />} />
                <Route path="fotos/:id" element={<FotoDetailPage />} />
                <Route path="favoritos" element={<FavoritosPage />} />
                <Route path="carrito" element={<CarritoPage />} />
                <Route path="pedidos" element={<PedidosPage />} />
                <Route path="pedidos/:id" element={<PedidoDetailPage />} />
                <Route path="descargas" element={<DescargasPage />} />
                <Route path="descargas/:id" element={<DescargaDetailPage />} />
                <Route path="mi-historial" element={<HistorialPage />} />
                <Route path="notificaciones" element={<NotificacionesPage />} />
                <Route path="perfil" element={<ProfilePage />} />
                <Route path="access-denied" element={<AccessDeniedPage />} />
              </Route>

              <Route element={<RoleRoute roles={[roles.admin]} />}>
                <Route path="admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to={routes.admin.dashboard} replace />} />
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                  <Route path="operaciones" element={<AdminSummaryPage configKey="operaciones" />} />
                  <Route path="eventos" element={<AdminGenericListPage configKey="eventos" />} />
                  <Route path="eventos/nuevo" element={<AdminEventFormPage />} />
                  <Route path="eventos/editar/:id" element={<AdminEventFormPage />} />
                  <Route path="eventos/:id" element={<AdminEventoDetailPage />} />
                  <Route path="fotos" element={<AdminFotosEventoPage />} />
                  <Route path="fotos/evento" element={<AdminFotosEventoPage />} />
                  <Route path="fotos/evento/:eventoId" element={<AdminFotosEventoPage />} />
                  <Route path="fotos/bulk" element={<AdminFotosToolsPage mode="bulk" />} />
                  <Route path="fotos/metadata" element={<AdminFotosToolsPage mode="metadata" />} />
                  <Route path="fotos/editar/:id" element={<AdminFotosToolsPage mode="metadata" />} />
                  <Route path="fotos/:id" element={<AdminFotoDetailPage />} />
                  <Route path="clientes" element={<AdminGenericListPage configKey="clientes" />} />
                  <Route path="clientes/nuevo" element={<AdminGenericListPage configKey="clientes" />} />
                  <Route path="clientes/editar/:id" element={<AdminGenericListPage configKey="clientes" />} />
                  <Route path="clientes/:id/historial" element={<AdminClienteHistorialPage />} />
                  <Route path="pedidos" element={<AdminGenericListPage configKey="pedidos" />} />
                  <Route path="pedidos/:id" element={<AdminPedidoDetailPage />} />
                  <Route path="descargas" element={<AdminGenericListPage configKey="descargas" />} />
                  <Route path="descargas/:id" element={<AdminDescargaDetailPage />} />
                  <Route path="presupuestos" element={<AdminGenericListPage configKey="presupuestos" />} />
                  <Route path="presupuestos/:id" element={<AdminPresupuestoDetailPage />} />
                  <Route path="agenda" element={<AdminAgendaPage />} />
                  <Route path="sesiones-privadas" element={<AdminSesionesPrivadasPage />} />
                  <Route path="sesiones-privadas/:id" element={<AdminSesionPrivadaDetailPage />} />
                  <Route path="portfolio" element={<AdminGenericListPage configKey="portfolio" />} />
                  <Route path="servicios" element={<AdminGenericListPage configKey="servicios" />} />
                  <Route path="faq" element={<AdminGenericListPage configKey="faq" />} />
                  <Route path="notificaciones" element={<AdminGenericListPage configKey="notificaciones" />} />
                  <Route path="notificaciones/plantillas" element={<AdminGenericListPage configKey="plantillas" />} />
                  <Route path="notificaciones/:id" element={<AdminNotificacionDetailPage />} />
                  <Route path="ventas" element={<AdminSummaryPage configKey="ventas" />} />
                  <Route path="cupones" element={<AdminCuponesPage />} />
                  <Route path="promociones" element={<AdminGenericListPage configKey="promociones" />} />
                  <Route path="testimonios" element={<AdminGenericListPage configKey="testimonios" />} />
                  <Route path="carritos-abandonados" element={<AdminGenericListPage configKey="carritos" />} />
                  <Route path="reportes/ventas" element={<AdminReportesVentasPage />} />
                  <Route path="pexels/importar-fotos" element={<AdminFotosToolsPage mode="pexels" />} />
                  <Route path="mi-perfil" element={<AdminMiPerfilPage />} />
                  <Route path="bitacora" element={<AdminBitacoraPage />} />
                  <Route path="dev-tools" element={<AdminDevToolsPage />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<Navigate to={routes.public.root} replace />} />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </ErrorBoundary>
  );
}
