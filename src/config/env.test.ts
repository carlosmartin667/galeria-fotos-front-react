import { describe, expect, it } from 'vitest';
import { env, getApiUrl } from './env';

describe('env', () => {
  it('usa API URL segura por defecto cuando no hay override', () => {
    expect(env.apiUrl).toBe('http://localhost:5200/api');
    expect(getApiUrl()).toBe(env.apiUrl);
  });
});
