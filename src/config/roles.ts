import type { UserRole } from '@/types/auth';

export const roles = {
  admin: 'Admin',
  usuario: 'Usuario',
  cliente: 'Cliente',
  invitado: 'Invitado',
} as const;

export type AppRole = (typeof roles)[keyof typeof roles];

export function normalizeRole(role: UserRole | null | undefined) {
  return String(role ?? '').trim().toLowerCase();
}

export function normalizeRoles(value: unknown): UserRole[] {
  if (Array.isArray(value)) {
    return value.map(String).map((role) => role.trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value.split(',').map((role) => role.trim()).filter(Boolean);
  }

  return [];
}

export function isAdminRole(role: UserRole | null | undefined) {
  return normalizeRole(role) === normalizeRole(roles.admin);
}

export function isUserRole(role: UserRole | null | undefined) {
  const normalized = normalizeRole(role);
  return normalized === normalizeRole(roles.usuario) || normalized === normalizeRole(roles.cliente);
}

export function hasAnyRole(userRoles: UserRole[] | undefined, expectedRoles: UserRole[]) {
  const normalizedExpected = expectedRoles.map(normalizeRole);
  return Boolean(userRoles?.some((role) => normalizedExpected.includes(normalizeRole(role))));
}
