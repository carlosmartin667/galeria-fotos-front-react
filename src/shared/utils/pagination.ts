import { asArray, unwrapData } from './apiData';
import type { PaginatedResult } from '@/types/paginacion';

export function toPaginatedResult<T>(value: unknown): PaginatedResult<T> {
  const data = unwrapData<unknown>(value, value);
  if (Array.isArray(data)) {
    return { items: data as T[], total: data.length };
  }

  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    const items = asArray<T>(record);
    return {
      items,
      total: typeof record.total === 'number' ? record.total : typeof record.totalCount === 'number' ? record.totalCount : items.length,
      page: typeof record.page === 'number' ? record.page : undefined,
      pageSize: typeof record.pageSize === 'number' ? record.pageSize : undefined,
      totalPages: typeof record.totalPages === 'number' ? record.totalPages : undefined,
    };
  }

  return { items: [], total: 0 };
}

export function paginatedParams(filters: { page?: number; pageSize?: number; all?: boolean } = {}) {
  return { Page: filters.page, PageSize: filters.pageSize, All: filters.all };
}
