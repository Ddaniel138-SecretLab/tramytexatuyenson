
"use client";

import { useEffect, useState } from "react";

import {
  Alert,
  Container,
  Grid,
} from "@mui/material";

import { usePagedApi } from "@/hooks/usePagedApi";
import type { Facility } from "@/types/database";

import PaginationBar from "@/components/shared/PaginationBar";
import LoadingState from "@/components/shared/LoadingState";
import EmptyState from "@/components/shared/EmptyState";

import PublicPageHeader from "../shared/PublicPageHeader";
import PublicSearchField from "../shared/PublicSearchField";
import FacilityCard from "./FacilityCard";

export function FacilitiesPage() {
  const [search, setSearch] = useState("");

  const {
    data,
    pagination,
    page,
    goToPage,
    setPage,
    loading,
    error,
  } = usePagedApi<Facility>(
    "/api/public/facilities",
    { search },
    9,
  );

  useEffect(() => {
    setPage(1);
  }, [search, setPage]);

  return (
    <Container
      maxWidth="xl"
      sx={{ py: { xs: 4, sm: 5, md: 7 } }}
    >
      <PublicPageHeader
        eyebrow="HỆ THỐNG Y TẾ CƠ SỞ"
        title="Các cơ sở y tế"
        description="Thông tin các điểm hoạt động trực thuộc Trạm Y tế xã Tuyên Sơn."
      />

      <PublicSearchField
        value={search}
        onChange={setSearch}
        placeholder="Tìm tên hoặc địa chỉ cơ sở..."
        fullWidth={false}
        sx={{
          width: { xs: "100%", sm: 420 },
          mb: 1,
        }}
      />

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <LoadingState />
      ) : data.length === 0 ? (
        <EmptyState title="Chưa có cơ sở phù hợp" />
      ) : (
        <Grid
          container
          spacing={2.5}
          sx={{ mt: 0.5 }}
        >
          {data.map((facility) => (
            <Grid
              key={facility.id}
              size={{ xs: 12, sm: 6, lg: 4 }}
            >
              <FacilityCard facility={facility} />
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && (
        <PaginationBar
          page={page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          perPage={pagination.perPage}
          onChange={goToPage}
        />
      )}
    </Container>
  );
}
