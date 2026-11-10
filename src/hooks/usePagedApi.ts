"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ApiListResponse, PaginationMeta } from "@/types/database";

const EMPTY_PAGINATION: PaginationMeta = { page: 1, perPage: 10, total: 0, totalPages: 0, hasMore: false };

export function usePagedApi<T>(endpoint: string, filters: Record<string, string> = {}, perPage = 10) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(EMPTY_PAGINATION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const query = useMemo(() => {
    const params = new URLSearchParams({ page: String(page), perPage: String(perPage) });
    Object.entries(filters).forEach(([key, value]) => { if (value) params.set(key, value); });
    return params.toString();
  // filter values are serialized deliberately to keep dependencies stable.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, JSON.stringify(filters)]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    fetch(`${endpoint}?${query}`, { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json() as ApiListResponse<T>;
        if (!response.ok) throw new Error(body.message || "Không thể tải dữ liệu.");
        return body;
      })
      .then((body) => {
        if (!active) return;
        setData(body.data ?? []);
        setPagination(body.pagination ?? EMPTY_PAGINATION);
      })
      .catch((err: Error) => { if (active) { setData([]); setPagination(EMPTY_PAGINATION); setError(err.message); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [endpoint, query, refreshKey]);

  const reload = useCallback(() => setRefreshKey((value) => value + 1), []);
  const goToPage = useCallback((nextPage: number) => setPage(nextPage), []);
  const resetPage = useCallback(() => setPage(1), []);
  return { data, pagination, page, setPage, goToPage, resetPage, loading, error, reload };
}
