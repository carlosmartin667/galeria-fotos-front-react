import { apiClient } from '@/services/api/apiClient';
import type { LoginCredentials, RegisterPayload } from '@/types/auth';

export async function loginRequest(credentials: LoginCredentials) {
  const response = await apiClient.post('/Auth/login', credentials);
  return response.data;
}

export async function registerRequest(payload: RegisterPayload) {
  const response = await apiClient.post('/Auth/register', payload);
  return response.data;
}
