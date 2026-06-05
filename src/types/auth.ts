export type UserRole = 'Admin' | 'Usuario' | 'Cliente' | 'Invitado' | string;

export interface AuthUser {
  id?: string;
  email: string;
  name?: string;
  roles: UserRole[];
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
