import { describe, expect, it } from 'vitest';
import { getApiUrl } from '@/config/env';

describe('msw', () => {
  it('responde un endpoint mock simple', async () => {
    const response = await fetch(`${getApiUrl()}/dev-tools/ping`);
    const body = await response.json();

    expect(response.ok).toBe(true);
    expect(body).toEqual({ ok: true, source: 'msw' });
  });
});
