import axios from 'axios';
import { getApiUrl } from '@/config/env';
import { normalizeApiError } from './apiError';

let authTokenProvider: (() => string | null) | null = null;
let unauthorizedHandler: (() => void) | null = null;

export const apiClient = axios.create({
  baseURL: getApiUrl(),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = authTokenProvider?.();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized = normalizeApiError(error);
    if (normalized.status === 401) {
      unauthorizedHandler?.();
    }
    return Promise.reject(normalized);
  },
);

export function configureApiAuth(options: {
  getToken: () => string | null;
  onUnauthorized: () => void;
}) {
  authTokenProvider = options.getToken;
  unauthorizedHandler = options.onUnauthorized;
}
