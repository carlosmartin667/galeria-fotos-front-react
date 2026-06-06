import { apiClient } from '@/services/api/apiClient';
import { sanitizeSensitiveData } from '@/shared/utils/sensitiveText';

export const devToolEndpoints = [
  { label: 'Ping', path: '/dev-tools/ping' },
  { label: 'Bad Request', path: '/dev-tools/errors/bad-request' },
  { label: 'Internal Controlled', path: '/dev-tools/errors/internal-controlled' },
  { label: 'Null Data', path: '/dev-tools/payloads/null-data' },
  { label: 'Sensitive Metadata', path: '/dev-tools/payloads/sensitive-metadata' },
] as const;

export type DevToolEndpoint = (typeof devToolEndpoints)[number];

export async function callDevTool(path: string) {
  const response = await apiClient.get(path);
  return sanitizeSensitiveData(response.data);
}
