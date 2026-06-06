const DEFAULT_API_URL = 'http://localhost:5200/api';

function normalizeApiUrl(value: string | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) {
    return DEFAULT_API_URL;
  }
  return trimmed.replace(/\/+$/, '');
}

export const env = {
  apiUrl: normalizeApiUrl(import.meta.env.VITE_API_URL),
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;

export function getApiUrl() {
  return env.apiUrl;
}
