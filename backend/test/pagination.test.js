import test from "node:test";
import assert from "node:assert/strict";
import {
  buildPage,
  parsePagination,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from "../src/shared/pagination.js";

test("parsePagination usa 12 por defecto y respeta el máximo de 50", () => {
  assert.deepEqual(parsePagination({}), {
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
    offset: 0,
  });
  assert.deepEqual(parsePagination({ page: "2", limit: "20" }), {
    page: 2,
    limit: 20,
    offset: 20,
  });
  assert.throws(() => parsePagination({ limit: MAX_PAGE_SIZE + 1 }), {
    code: "VALIDATION_ERROR",
  });
});

test("buildPage calcula totalPages sin inventar filas", () => {
  assert.deepEqual(
    buildPage({ items: [{ id: 1 }], total: 25, page: 1, limit: 12 }),
    {
      items: [{ id: 1 }],
      pagination: { total: 25, page: 1, limit: 12, totalPages: 3 },
    },
  );
  assert.equal(
    buildPage({ items: [], total: 0, page: 1, limit: 12 }).pagination
      .totalPages,
    0,
  );
});
