import type { PaginationMeta } from "@/types/database";

export function readPagination(params: URLSearchParams, defaultPerPage = 10, maxPerPage = 50) {
  const rawPage = Number(params.get("page") ?? 1);
  const rawPerPage = Number(params.get("perPage") ?? defaultPerPage);
  const page = Number.isFinite(rawPage) ? Math.max(1, Math.floor(rawPage)) : 1;
  const perPage = Number.isFinite(rawPerPage)
    ? Math.min(maxPerPage, Math.max(1, Math.floor(rawPerPage)))
    : defaultPerPage;
  return { page, perPage, from: (page - 1) * perPage, to: page * perPage - 1 };
}

export function createPagination(page: number, perPage: number, total: number): PaginationMeta {
  const totalPages = Math.ceil(total / perPage);
  return { page, perPage, total, totalPages, hasMore: page < totalPages };
}
