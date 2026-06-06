import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getApiUrl } from '@/config/env';
import { server } from '@/test/msw/server';
import { apiClient, configureApiAuth } from './apiClient';

describe('apiClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    configureApiAuth({ getToken: () => null, onUnauthorized: () => undefined });
  });

  it('agrega Bearer si hay token', async () => {
    configureApiAuth({ getToken: () => 'token-123', onUnauthorized: () => undefined });
    server.use(
      http.get(`${getApiUrl()}/dev-tools/ping`, ({ request }) =>
        HttpResponse.json({ authorization: request.headers.get('authorization') }),
      ),
    );

    const response = await apiClient.get('/dev-tools/ping');

    expect(response.data.authorization).toBe('Bearer token-123');
  });

  it('no agrega Authorization si no hay token', async () => {
    server.use(
      http.get(`${getApiUrl()}/dev-tools/ping`, ({ request }) =>
        HttpResponse.json({ authorization: request.headers.get('authorization') }),
      ),
    );

    const response = await apiClient.get('/dev-tools/ping');

    expect(response.data.authorization).toBeNull();
  });

  it('401 limpia sesion local', async () => {
    const onUnauthorized = vi.fn();
    configureApiAuth({ getToken: () => 'token-123', onUnauthorized });
    server.use(http.get(`${getApiUrl()}/dev-tools/ping`, () => HttpResponse.json({}, { status: 401 })));

    await expect(apiClient.get('/dev-tools/ping')).rejects.toMatchObject({ status: 401 });

    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });

  it('403 no limpia sesion local', async () => {
    const onUnauthorized = vi.fn();
    configureApiAuth({ getToken: () => 'token-123', onUnauthorized });
    server.use(http.get(`${getApiUrl()}/dev-tools/ping`, () => HttpResponse.json({}, { status: 403 })));

    await expect(apiClient.get('/dev-tools/ping')).rejects.toMatchObject({ status: 403 });

    expect(onUnauthorized).not.toHaveBeenCalled();
  });
});
