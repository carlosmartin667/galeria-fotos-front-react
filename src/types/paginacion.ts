export interface PaginacionFilters {
  page?: number;
  pageSize?: number;
  all?: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  total?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}
