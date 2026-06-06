export const routes = {
  public: {
    root: '/',
    home: '/home',
    portfolio: '/portfolio',
    portfolioDetail: (id: string) => `/portfolio/${id}`,
    servicios: '/servicios',
    servicioDetail: (id: string) => `/servicios/${id}`,
    faq: '/faq',
    contacto: '/contacto',
    presupuesto: '/presupuesto',
    disponibilidad: '/disponibilidad',
    promociones: '/promociones',
    promocionDetail: (id: string) => `/promociones/${id}`,
    testimonios: '/testimonios',
  },
  auth: {
    login: '/login',
    register: '/register',
  },
  user: {
    dashboard: '/dashboard',
    eventos: '/eventos',
    eventoDetail: (id: string) => `/eventos/${id}`,
    fotos: '/fotos',
    fotoDetail: (id: string) => `/fotos/${id}`,
    favoritos: '/favoritos',
    carrito: '/carrito',
    pedidos: '/pedidos',
    pedidoDetail: (id: string) => `/pedidos/${id}`,
    descargas: '/descargas',
    descargaDetail: (id: string) => `/descargas/${id}`,
    historial: '/mi-historial',
    notificaciones: '/notificaciones',
    profile: '/perfil',
  },
  accessDenied: '/access-denied',
  admin: {
    root: '/admin',
    dashboard: '/admin/dashboard',
    bitacora: '/admin/bitacora',
    devTools: '/admin/dev-tools',
  },
} as const;

export function getLoginRoute(returnUrl?: string) {
  const safeReturnUrl = getSafeReturnUrl(returnUrl);
  if (!safeReturnUrl) {
    return routes.auth.login;
  }
  return `${routes.auth.login}?returnUrl=${encodeURIComponent(safeReturnUrl)}`;
}

export function getSafeReturnUrl(returnUrl: string | null | undefined) {
  if (!returnUrl) {
    return null;
  }

  try {
    const decoded = decodeURIComponent(returnUrl);
    if (!decoded.startsWith('/') || decoded.startsWith('//')) {
      return null;
    }

    const [path] = decoded.split('?');
    if (path === routes.auth.login || path === routes.auth.register) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}
