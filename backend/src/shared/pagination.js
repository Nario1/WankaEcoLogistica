import { requireNumber } from "./validation.js";

export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 50;

export function parsePagination(query = {}) {
  const page = Math.trunc(
    requireNumber(query.page ?? 1, "page", { min: 1, max: 10_000 }),
  );
  const limit = Math.trunc(
    requireNumber(query.limit ?? DEFAULT_PAGE_SIZE, "limit", {
      min: 1,
      max: MAX_PAGE_SIZE,
    }),
  );
  return {
    page,
    limit,
    offset: (page - 1) * limit,
  };
}

export function buildPage({ items, total, page, limit }) {
  const safeTotal = Number(total) || 0;
  return {
    items,
    pagination: {
      total: safeTotal,
      page,
      limit,
      totalPages: safeTotal === 0 ? 0 : Math.ceil(safeTotal / limit),
    },
  };
}
