import { describe, expect, it } from 'vitest';
import { hasAnyRole, isAdminRole, isUserRole, normalizeRole, normalizeRoles, roles } from './roles';

describe('roles', () => {
  it('normaliza roles de forma case-insensitive', () => {
    expect(normalizeRole(' Admin ')).toBe('admin');
    expect(isAdminRole('admin')).toBe(true);
    expect(isUserRole('cliente')).toBe(true);
    expect(isUserRole('Usuario')).toBe(true);
    expect(normalizeRoles(['Admin', ' Cliente '])).toEqual(['Admin', 'Cliente']);
    expect(normalizeRoles('Admin,Cliente')).toEqual(['Admin', 'Cliente']);
  });

  it('evalua roles esperados', () => {
    expect(hasAnyRole(['Cliente'], [roles.admin])).toBe(false);
    expect(hasAnyRole(['Admin'], [roles.admin])).toBe(true);
  });
});
