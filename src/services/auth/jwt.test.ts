import { describe, expect, it } from 'vitest';
import { createFakeJwt } from '@/test/msw/handlers';
import { getTokenPayload, isTokenExpired } from './jwt';

describe('jwt helpers', () => {
  it('lee payload de token valido', () => {
    const token = createFakeJwt({ email: 'test@test.local', role: 'Admin' });

    expect(getTokenPayload(token)).toMatchObject({ email: 'test@test.local', role: 'Admin' });
    expect(isTokenExpired(token)).toBe(false);
  });

  it('detecta token expirado', () => {
    const token = createFakeJwt({ exp: Math.floor(Date.now() / 1000) - 10 });

    expect(isTokenExpired(token)).toBe(true);
  });

  it('maneja token invalido', () => {
    expect(getTokenPayload('no-es-jwt')).toBeNull();
    expect(isTokenExpired('no-es-jwt')).toBe(false);
  });
});
