import type { AuthSession } from '@/types/auth';

export interface CurrentUserProfile {
  email: string;
  name?: string;
  roles: string[];
}

export function getCurrentSessionProfile(session: AuthSession | null): CurrentUserProfile | null {
  if (!session) {
    return null;
  }

  return {
    email: session.user.email,
    name: session.user.name,
    roles: session.user.roles.map(String),
  };
}
