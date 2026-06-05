import axios, { AxiosError } from 'axios';
import { sanitizeSensitiveData, sanitizeSensitiveText } from '@/shared/utils/sensitiveText';

export interface ApiError {
  status?: number;
  message: string;
  correlationId?: string;
  details?: unknown;
}

const STATUS_MESSAGES: Record<number, string> = {
  400: 'La solicitud no es valida.',
  401: 'Tu sesion expiro o no estas autenticado.',
  403: 'No tenes permisos para realizar esta accion.',
  404: 'No encontramos el recurso solicitado.',
  409: 'La operacion entra en conflicto con el estado actual.',
  429: 'Demasiados intentos. Proba nuevamente en unos minutos.',
  500: 'Ocurrio un error interno controlado.',
  502: 'El servicio no esta disponible temporalmente.',
  503: 'El servicio no esta disponible temporalmente.',
};

function getHeader(headers: unknown, name: string) {
  if (!headers || typeof headers !== 'object') {
    return undefined;
  }
  const record = headers as Record<string, unknown>;
  return (record[name] ?? record[name.toLowerCase()])?.toString();
}

function getBodyMessage(data: unknown) {
  if (!data || typeof data !== 'object') {
    return undefined;
  }
  const record = data as Record<string, unknown>;
  const value = record.message ?? record.mensaje ?? record.title ?? record.error;
  return typeof value === 'string' ? sanitizeSensitiveText(value) : undefined;
}

function getCorrelationId(error: AxiosError) {
  const data = error.response?.data;
  const bodyId =
    data && typeof data === 'object'
      ? ((data as Record<string, unknown>).correlationId ?? (data as Record<string, unknown>).traceId)
      : undefined;

  return (
    getHeader(error.response?.headers, 'x-correlation-id') ??
    getHeader(error.response?.headers, 'correlation-id') ??
    (typeof bodyId === 'string' ? bodyId : undefined)
  );
}

export function normalizeApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const fallbackMessage = status ? STATUS_MESSAGES[status] : 'No pudimos comunicarnos con el servidor.';
    const message = getBodyMessage(error.response?.data) ?? fallbackMessage;

    return {
      status,
      message,
      correlationId: getCorrelationId(error),
      details: sanitizeSensitiveData(error.response?.data),
    };
  }

  if (error instanceof Error) {
    return {
      message: sanitizeSensitiveText(error.message) || 'Ocurrio un error inesperado.',
    };
  }

  return {
    message: 'Ocurrio un error inesperado.',
  };
}
