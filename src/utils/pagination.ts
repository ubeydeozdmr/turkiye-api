export interface PaginationInput {
  readonly limit?: number;
  readonly offset?: number;
}

export interface Pagination {
  readonly limit: number;
  readonly offset: number;
}

export const DEFAULT_LIMIT = 100;
export const MAX_LIMIT = 1000;
export const DEFAULT_OFFSET = 0;

export function normalizePagination(input: PaginationInput = {}): Pagination {
  const limit = input.limit ?? DEFAULT_LIMIT;
  const offset = input.offset ?? DEFAULT_OFFSET;

  return {
    limit: Math.min(Math.max(limit, 1), MAX_LIMIT),
    offset: Math.max(offset, 0),
  };
}

export function paginate<Row>(rows: readonly Row[], pagination: Pagination): readonly Row[] {
  return rows.slice(pagination.offset, pagination.offset + pagination.limit);
}
