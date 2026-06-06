import { apiClient } from '@/services/api/apiClient';
import { sanitizeSensitiveData } from '@/shared/utils/sensitiveText';

export const devToolEndpoints = [
  { label: 'Ping', method: 'GET', path: '/dev-tools/ping' },
  { label: 'Current User', method: 'GET', path: '/dev-tools/current-user' },
  { label: 'Correlation Id', method: 'GET', path: '/dev-tools/correlation-id' },
  { label: 'Bad Request', method: 'GET', path: '/dev-tools/errors/bad-request' },
  { label: 'Unauthorized', method: 'GET', path: '/dev-tools/errors/unauthorized' },
  { label: 'Forbidden', method: 'GET', path: '/dev-tools/errors/forbidden' },
  { label: 'Not Found', method: 'GET', path: '/dev-tools/errors/not-found' },
  { label: 'Conflict', method: 'GET', path: '/dev-tools/errors/conflict' },
  { label: 'External Dependency', method: 'GET', path: '/dev-tools/errors/external-dependency' },
  { label: 'Internal Controlled', method: 'GET', path: '/dev-tools/errors/internal-controlled' },
  { label: 'Throw', method: 'GET', path: '/dev-tools/errors/throw' },
  { label: 'Audit Test Entry', method: 'POST', path: '/dev-tools/audit/test-entry' },
  { label: 'Rate Limit Probe', method: 'GET', path: '/dev-tools/rate-limit/probe' },
  { label: 'Null Data', method: 'GET', path: '/dev-tools/payloads/null-data' },
  { label: 'Missing Fields', method: 'GET', path: '/dev-tools/payloads/missing-fields' },
  { label: 'Wrong Shape', method: 'GET', path: '/dev-tools/payloads/wrong-shape' },
  { label: 'Null Items', method: 'GET', path: '/dev-tools/payloads/null-items' },
  { label: 'Invalid Date', method: 'GET', path: '/dev-tools/payloads/invalid-date' },
  { label: 'Sensitive Metadata', method: 'GET', path: '/dev-tools/payloads/sensitive-metadata' },
  { label: 'Empty List', method: 'GET', path: '/dev-tools/payloads/empty-list' },
  { label: 'Large List', method: 'GET', path: '/dev-tools/payloads/large-list' },
] as const;

export type DevToolEndpoint = (typeof devToolEndpoints)[number];

export async function callDevTool(path: string) {
  const endpoint = devToolEndpoints.find((tool) => tool.path === path);
  const response = endpoint?.method === 'POST' ? await apiClient.post(path) : await apiClient.get(path);
  return sanitizeSensitiveData(response.data);
}
