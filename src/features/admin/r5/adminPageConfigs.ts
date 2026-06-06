import { queryKeys } from '@/services/api/queryKeys';
import { getAgendaAdmin } from '@/services/admin/agendaAdminApi';
import { getCarritosAbandonadosAdmin } from '@/services/admin/carritosAbandonadosApi';
import { getClientesAdmin } from '@/services/admin/clientesAdminApi';
import { getCuponesAdmin } from '@/services/admin/cuponesAdminApi';
import { getDescargasAdmin } from '@/services/admin/descargasAdminApi';
import { getEventosAdmin } from '@/services/admin/eventosAdminApi';
import { getFaqAdmin } from '@/services/admin/faqAdminApi';
import { getFotosAdmin } from '@/services/admin/fotosAdminApi';
import { getNotificacionesAdmin, getPlantillasAdmin } from '@/services/admin/notificacionesAdminApi';
import { getOperacionesResumen } from '@/services/admin/operacionesApi';
import { getPedidosAdmin } from '@/services/admin/pedidosAdminApi';
import { getPortfolioAdmin } from '@/services/admin/portfolioAdminApi';
import { getPresupuestosAdmin } from '@/services/admin/presupuestosAdminApi';
import { getPromocionesAdmin } from '@/services/admin/promocionesAdminApi';
import { getReporteVentasAdmin } from '@/services/admin/reportesVentasApi';
import { getServiciosAdmin } from '@/services/admin/serviciosAdminApi';
import { getSesionesPrivadasAdmin } from '@/services/admin/sesionesPrivadasAdminApi';
import { getTestimoniosAdmin } from '@/services/admin/testimoniosAdminApi';
import { getVentasResumenAdmin } from '@/services/admin/ventasAdminApi';

export const adminListConfigs = {
  eventos: { title: 'Eventos', queryKey: queryKeys.admin.eventos(), queryFn: getEventosAdmin },
  fotos: { title: 'Fotos', queryKey: queryKeys.admin.fotos(), queryFn: getFotosAdmin },
  clientes: { title: 'Clientes', queryKey: queryKeys.admin.clientes(), queryFn: getClientesAdmin },
  pedidos: { title: 'Pedidos', queryKey: queryKeys.admin.pedidos(), queryFn: getPedidosAdmin },
  descargas: { title: 'Descargas', queryKey: queryKeys.admin.descargas(), queryFn: getDescargasAdmin },
  presupuestos: { title: 'Presupuestos', queryKey: queryKeys.admin.presupuestos(), queryFn: getPresupuestosAdmin },
  agenda: { title: 'Agenda', queryKey: queryKeys.admin.agenda(), queryFn: getAgendaAdmin },
  sesiones: { title: 'Sesiones privadas', queryKey: queryKeys.admin.sesionesPrivadas(), queryFn: getSesionesPrivadasAdmin },
  portfolio: { title: 'Portfolio', queryKey: queryKeys.admin.portfolio(), queryFn: getPortfolioAdmin },
  servicios: { title: 'Servicios', queryKey: queryKeys.admin.servicios(), queryFn: getServiciosAdmin },
  faq: { title: 'FAQ', queryKey: queryKeys.admin.faq(), queryFn: getFaqAdmin },
  notificaciones: { title: 'Notificaciones', queryKey: queryKeys.admin.notificaciones(), queryFn: getNotificacionesAdmin },
  plantillas: { title: 'Plantillas', queryKey: queryKeys.admin.plantillas(), queryFn: getPlantillasAdmin },
  cupones: { title: 'Cupones', queryKey: queryKeys.admin.cupones(), queryFn: getCuponesAdmin },
  promociones: { title: 'Promociones', queryKey: queryKeys.admin.promociones(), queryFn: getPromocionesAdmin },
  testimonios: { title: 'Testimonios', queryKey: queryKeys.admin.testimonios(), queryFn: getTestimoniosAdmin },
  carritos: { title: 'Carritos abandonados', queryKey: queryKeys.admin.carritosAbandonados(), queryFn: getCarritosAbandonadosAdmin },
} as const;

export const adminSummaryConfigs = {
  operaciones: { title: 'Operaciones', queryKey: queryKeys.admin.operaciones(), queryFn: getOperacionesResumen },
  ventas: { title: 'Ventas', queryKey: queryKeys.admin.ventas(), queryFn: getVentasResumenAdmin },
  reportesVentas: { title: 'Reporte de ventas', queryKey: queryKeys.admin.reportesVentas(), queryFn: getReporteVentasAdmin },
} as const;
