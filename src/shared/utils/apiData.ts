export function unwrapData<T>(value: unknown, fallback: T): T {
  if (value && typeof value === 'object' && 'data' in value) {
    return ((value as { data?: unknown }).data ?? fallback) as T;
  }
  return (value ?? fallback) as T;
}

export function asArray<T>(value: unknown): T[] {
  const data = unwrapData<unknown>(value, []);
  if (Array.isArray(data)) {
    return data as T[];
  }
  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    const items = record.items ?? record.resultados ?? record.data;
    return Array.isArray(items) ? (items as T[]) : [];
  }
  return [];
}
