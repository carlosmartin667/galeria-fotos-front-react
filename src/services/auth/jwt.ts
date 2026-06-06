export interface JwtPayload {
  exp?: number;
  email?: string;
  name?: string;
  sub?: string;
  role?: string | string[];
  roles?: string | string[];
  [claim: string]: unknown;
}

function decodeBase64Url(value: string) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  return atob(padded);
}

export function getTokenPayload(token: string | null | undefined): JwtPayload | null {
  if (!token) {
    return null;
  }

  const [, payload] = token.split('.');
  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(decodeBase64Url(payload)) as JwtPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string | null | undefined, now = Date.now()) {
  const payload = getTokenPayload(token);
  if (!payload?.exp || typeof payload.exp !== 'number') {
    return false;
  }

  return payload.exp * 1000 <= now;
}
