const REDACTED = '[redacted]';

const KEY_PATTERNS = [
  /("?(?:token|password|apiKey|apikey|bearer|storageKey|marcaAguaStorageKey|signedUrl)"?\s*[:=]\s*)("[^"]*"|'[^']*'|[^\s,;}\]]+)/gi,
  /((?:token|password|apiKey|apikey|bearer|StorageKey|MarcaAguaStorageKey|signedUrl)=)([^&\s]+)/gi,
  /(Bearer\s+)[A-Za-z0-9._~+/=-]+/gi,
];

const SENSITIVE_QUERY_KEYS = [
  'token',
  'sig',
  'signature',
  'x-amz-signature',
  'x-amz-credential',
  'x-amz-security-token',
  'se',
  'sp',
  'sv',
  'skoid',
  'sktid',
  'skt',
  'ske',
  'sks',
  'skv',
];

function sanitizeUrlQueries(input: string) {
  return input.replace(/https?:\/\/[^\s"'<>]+/gi, (rawUrl) => {
    try {
      const url = new URL(rawUrl);
      let touched = false;
      for (const key of Array.from(url.searchParams.keys())) {
        if (SENSITIVE_QUERY_KEYS.includes(key.toLowerCase())) {
          url.searchParams.set(key, REDACTED);
          touched = true;
        }
      }
      return touched ? url.toString() : rawUrl;
    } catch {
      return rawUrl.replace(/\?.+$/, `?${REDACTED}`);
    }
  });
}

export function sanitizeSensitiveText(value: unknown): string {
  const text = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
  if (!text) {
    return '';
  }

  return KEY_PATTERNS.reduce(
    (current, pattern) => current.replace(pattern, `$1${REDACTED}`),
    sanitizeUrlQueries(text),
  );
}

export function sanitizeSensitiveData<T>(value: T): T {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === 'string') {
    return sanitizeSensitiveText(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeSensitiveData(item)) as T;
  }

  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => {
        const isSensitiveKey = /token|password|apikey|bearer|storagekey|marcaaguastoragekey|signedurl/i.test(key);
        return [key, isSensitiveKey ? REDACTED : sanitizeSensitiveData(nested)];
      }),
    ) as T;
  }

  return value;
}
