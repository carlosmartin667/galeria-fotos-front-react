import { hasAnyRole, roles } from './roles';
import type { UserRole } from '@/types/auth';

export function canAccessAdmin(userRoles: UserRole[] | undefined) {
  return hasAnyRole(userRoles, [roles.admin]);
}

export function canAccessUserArea(userRoles: UserRole[] | undefined) {
  return hasAnyRole(userRoles, [roles.admin, roles.usuario, roles.cliente]);
}

export function canViewPrivateDownloads(userRoles: UserRole[] | undefined) {
  return hasAnyRole(userRoles, [roles.admin, roles.usuario, roles.cliente]);
}

export function canViewAudit(userRoles: UserRole[] | undefined) {
  return hasAnyRole(userRoles, [roles.admin]);
}

export function canUseDevTools(userRoles: UserRole[] | undefined) {
  return hasAnyRole(userRoles, [roles.admin]);
}
