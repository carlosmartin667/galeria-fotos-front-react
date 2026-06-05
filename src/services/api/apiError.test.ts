import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';
import { normalizeApiError } from './apiError';

describe('normalizeApiError', () => {
  it('normaliza status conocidos y expone correlationId', () => {
    const error = new AxiosError('Request failed');
    error.response = {
      status: 403,
      statusText: 'Forbidden',
      headers: { 'x-correlation-id': 'corr-123' },
      config: { headers: new AxiosHeaders() },
      data: { message: 'No autorizado token=abc123' },
    };

    expect(normalizeApiError(error)).toEqual({
      status: 403,
      message: 'No autorizado token=[redacted]',
      correlationId: 'corr-123',
      details: { message: 'No autorizado token=[redacted]' },
    });
  });

  it('usa mensaje seguro para errores de servidor', () => {
    const error = new AxiosError('Server failed');
    error.response = {
      status: 500,
      statusText: 'Internal Server Error',
      headers: {},
      config: { headers: new AxiosHeaders() },
      data: { stack: 'at secret password=12345678' },
    };

    const normalized = normalizeApiError(error);

    expect(normalized.message).toBe('Ocurrio un error interno controlado.');
    expect(JSON.stringify(normalized.details)).not.toContain('12345678');
  });
});
