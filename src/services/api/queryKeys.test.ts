import { describe, expect, it } from 'vitest';
import { queryKeys } from './queryKeys';

describe('queryKeys', () => {
  it('expone keys iniciales estables', () => {
    expect(queryKeys.auth.session()).toEqual(['auth', 'session']);
    expect(queryKeys.bitacora.resumen()).toEqual(['bitacora', 'resumen']);
    expect(queryKeys.devTools.call('/dev-tools/ping')).toEqual(['dev-tools', '/dev-tools/ping']);
    expect(queryKeys.publicHome.root).toEqual(['public-home']);
    expect(queryKeys.adminDashboard.root).toEqual(['admin-dashboard']);
  });
});
