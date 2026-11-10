
"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Card,
  CardContent,
  Container,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { usePagedApi } from "@/hooks/usePagedApi";
import type { Facility, Profile } from "@/types/database";
import PaginationBar from "@/components/shared/PaginationBar";
import LoadingState from "@/components/shared/LoadingState";
import EmptyState from "@/components/shared/EmptyState";

type PublicStaff = Pick<
  Profile,
  "id" | "full_name" | "role" | "phone" | "position" | "avatar_url" | "facility_id"
> & {
  facility?: Pick<Facility, "id" | "name" | "code"> | null;
};

const FILTER_HEIGHT = 44;

const filterFieldSx = {
  "& .MuiOutlinedInput-root": {
    height: FILTER_HEIGHT,
    minHeight: FILTER_HEIGHT,
    boxSizing: "border-box",
    borderRadius: 2.5,
    alignItems: "center",
  },
};

export default function PublicStaffPage() {
  const [search, setSearch] = useState("");
  const [facilityId, setFacilityId] = useState("");

  const {
    data: facilities,
    error: facilitiesError,
  } = usePagedApi<Facility>("/api/public/facilities", {}, 50);

  const {
    data,
    pagination,
    page,
    goToPage,
    setPage,
    loading,
    error,
  } = usePagedApi<PublicStaff>(
    "/api/public/staff",
    { search, facilityId },
    12,
  );

  useEffect(() => {
    const requestedFacilityId = new URLSearchParams(
      window.location.search,
    ).get("facilityId");

    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (requestedFacilityId) setFacilityId(requestedFacilityId);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, facilityId, setPage]);

  const selectedFacility = facilities.find(
    (facility) => facility.id === facilityId,
  );

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, sm: 5, md: 7 } }}>
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography color="primary.main" fontWeight={800} variant="overline">
          ĐỘI NGŨ Y TẾ
        </Typography>

        <Typography variant="h4" sx={{ mt: 0.5, fontWeight: 900 }}>
          Đội ngũ nhân viên và quản lý
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Danh sách nhân viên và quản lý đang công tác tại tất cả các cơ sở trực thuộc Trạm Y tế xã Tuyên Sơn.
        </Typography>
      </Stack>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        alignItems="stretch"
        sx={{ mb: 3 }}
      >
        <TextField
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          size="small"
          placeholder="Tìm theo tên, chức vụ hoặc số điện thoại..."
          sx={{
            ...filterFieldSx,
            flex: "1 1 0",
            minWidth: 0,
            width: { xs: "100%", sm: "auto" },
            "& .MuiOutlinedInput-input": {
              boxSizing: "border-box",
              py: 0,
            },
            "& .MuiInputAdornment-root": {
              height: "100%",
              maxHeight: "none",
              alignItems: "center",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          select
          value={facilityId}
          onChange={(event) => setFacilityId(event.target.value)}
          size="small"
          label="Cơ sở công tác"
          sx={{
            ...filterFieldSx,
            width: { xs: "100%", sm: 280 },
            minWidth: { xs: "100%", sm: 280 },
            flexShrink: 0,
            "& .MuiSelect-select": {
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              py: 0,
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

      {(error || facilitiesError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || facilitiesError}
        </Alert>
      )}

      {selectedFacility && (
        <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
          Nhân sự tại cơ sở: <strong>{selectedFacility.name}</strong>
        </Typography>
      )}

      {loading ? (
        <LoadingState />
      ) : data.length === 0 ? (
        <EmptyState
          title="Chưa có nhân sự phù hợp"
          description={
            selectedFacility
              ? `Chưa có nhân viên hoặc quản lý được phân công tại ${selectedFacility.name}.`
              : "Danh sách nhân sự sẽ hiển thị tại đây khi có hồ sơ đang hoạt động và được phân công."
          }
        />
      ) : (
        <Grid container spacing={2.5}>
          {data.map((person) => (
            <Grid
              key={person.id}
              size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
            >
              <Card sx={{ height: "100%" }}>
                <CardContent sx={{ p: 2.5, textAlign: "center" }}>
                  <Avatar
                    src={person.avatar_url ?? undefined}
                    alt={person.full_name}
                    sx={{
                      width: 76,
                      height: 76,
                      mx: "auto",
                      bgcolor: "primary.light",
                      color: "primary.main",
                      fontSize: 28,
                      fontWeight: 800,
                    }}
                  >
                    {person.full_name.slice(0, 1)}
                  </Avatar>

                  <Typography fontWeight={800} sx={{ mt: 1.8 }}>
                    {person.full_name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="primary.main"
                    sx={{ mt: 0.5 }}
                  >
                    {person.position || "Chưa cập nhật chức vụ"}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={{ mt: 1.25 }}
                  >
                    Nơi công tác:{" "}
                    {person.facility?.name ?? "Trạm Y tế xã Tuyên Sơn"}
                  </Typography>

                  {person.phone && (
                    <Typography variant="body2" sx={{ mt: 0.75 }}>
                      {person.phone}
                    </Typography>
                  )}
                </CardContent>
              </Card>
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
