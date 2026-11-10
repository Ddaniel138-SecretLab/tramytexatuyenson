
"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Container,
  Grid,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

import { usePagedApi } from "@/hooks/usePagedApi";
import type { Facility, Profile } from "@/types/database";
import PaginationBar from "@/components/shared/PaginationBar";
import LoadingState from "@/components/shared/LoadingState";
import EmptyState from "@/components/shared/EmptyState";
import PublicPageHeader from "../shared/PublicPageHeader";
import PublicSearchField from "../shared/PublicSearchField";
import StaffCard from "./StaffCard";

const FILTER_HEIGHT = 44;

export function PublicStaffPage() {
  const [search, setSearch] = useState("");
  const [facilityId, setFacilityId] = useState("");

  const { data: facilities } = usePagedApi<Facility>(
    "/api/public/facilities",
    {},
    50,
  );

  const {
    data,
    pagination,
    page,
    goToPage,
    setPage,
    loading,
    error,
  } = usePagedApi<Profile>(
    "/api/public/staff",
    { search, facilityId },
    12,
  );

  useEffect(() => {
    const queryFacilityId = new URLSearchParams(
      window.location.search,
    ).get("facilityId");

    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (queryFacilityId) setFacilityId(queryFacilityId);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, facilityId, setPage]);

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, sm: 5, md: 7 } }}>
      <PublicPageHeader
        eyebrow="ĐỘI NGŨ Y TẾ"
        title="Đội ngũ cán bộ"
        description="Thông tin cán bộ đang công tác tại các cơ sở trực thuộc Trạm Y tế xã Tuyên Sơn."
      />

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        alignItems="stretch"
        sx={{ mb: 3 }}
      >
        <PublicSearchField
          value={search}
          onChange={setSearch}
          placeholder="Tìm theo tên hoặc chức vụ..."
          sx={{
            flex: "1 1 0",
            minWidth: 0,
            "& .MuiOutlinedInput-root": {
              height: FILTER_HEIGHT,
              minHeight: FILTER_HEIGHT,
              boxSizing: "border-box",
              borderRadius: 2.5,
            },
            "& .MuiOutlinedInput-input": {
              boxSizing: "border-box",
            },
          }}
        />

        <TextField
          select
          value={facilityId}
          onChange={(event) => setFacilityId(event.target.value)}
          size="small"
          label="Cơ sở"
          sx={{
            width: { xs: "100%", sm: 260 },
            minWidth: { xs: "100%", sm: 260 },
            flexShrink: 0,
            "& .MuiOutlinedInput-root": {
              height: FILTER_HEIGHT,
              minHeight: FILTER_HEIGHT,
              boxSizing: "border-box",
              borderRadius: 2.5,
            },
          }}
        >
          <MenuItem value="">Tất cả cơ sở</MenuItem>
          {facilities.map((facility) => (
            <MenuItem key={facility.id} value={facility.id}>
              {facility.name}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <LoadingState />
      ) : data.length === 0 ? (
        <EmptyState title="Chưa có cán bộ phù hợp" />
      ) : (
        <Grid container spacing={2.5}>
          {data.map((person) => (
            <Grid
              key={person.id}
              size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
            >
              <StaffCard person={person} />
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
