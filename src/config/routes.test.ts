import { describe, expect, it } from 'vitest';
import { getLoginRoute, routes } from './routes';

describe('routes', () => {
  it('centraliza rutas principales', () => {
    expect(routes.public.home).toBe('/home');
    expect(routes.auth.login).toBe('/login');
    expect(routes.user.dashboard).toBe('/dashboard');
    expect(routes.user.profile).toBe('/perfil');
    expect(routes.accessDenied).toBe('/access-denied');
    expect(routes.admin.dashboard).toBe('/admin/dashboard');
    expect(routes.admin.bitacora).toBe('/admin/bitacora');
    expect(routes.admin.devTools).toBe('/admin/dev-tools');
  });

  it('genera login con returnUrl codificado', () => {
    expect(getLoginRoute('/admin/dashboard?x=1')).toBe('/login?returnUrl=%2Fadmin%2Fdashboard%3Fx%3D1');
    expect(getLoginRoute('/login')).toBe('/login');
    expect(getLoginRoute('https://evil.test')).toBe('/login');
  });
});
