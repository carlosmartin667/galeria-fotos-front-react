import axios from 'axios';
import { normalizeApiError } from './apiError';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5200/api';

let authTokenProvider: (() => string | null) | null = null;
let unauthorizedHandler: (() => void) | null = null;

export const apiClient = axios.create({
  baseURL: API_URL,
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
