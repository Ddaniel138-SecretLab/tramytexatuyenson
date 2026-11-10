"use client";

import Link from "next/link";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import SearchIcon from "@mui/icons-material/Search";
import StaffEmptyState from "./StaffEmptyState";

export default function StaffManagementPage() {
  return (
    <Stack spacing={3}>
      {/* Page heading */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            sx={{ fontSize: { xs: 21, sm: 24 }, fontWeight: 800 }}
          >
            Quản lý cán bộ
          </Typography>

          <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>
            Quản lý hồ sơ và thông tin đội ngũ cán bộ y tế.
          </Typography>
        </Box>

        <Button
          component={Link}
          href="/admin/staff/new"
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            alignSelf: { xs: "stretch", sm: "auto" },
            textTransform: "none",
            fontWeight: 700,
            py: 1.1,
          }}
        >
          Thêm cán bộ
        </Button>
      </Stack>

      {/* Summary */}
      <Card
        sx={{
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
        }}
      >
        <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
          <Stack sx={{ flexDirection: 'row', alignItems: 'center' }} spacing={2} >
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: 2.5,
                display: "grid",
                placeItems: "center",
                bgcolor: "primary.light",
                color: "primary.main",
                flexShrink: 0,
              }}
            >
              <GroupsOutlinedIcon />
            </Box>

            <Box>
              <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                Tổng số hồ sơ cán bộ
              </Typography>

              <Typography sx={{ mt: 0.25, fontSize: 25, fontWeight: 800 }}>
                —
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Search and filters */}
      <Card
        sx={{
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
        }}
      >
        <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
          <Typography sx={{ mb: 2, fontSize: 15, fontWeight: 700 }}>
            Danh sách cán bộ
          </Typography>

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.5}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Tìm theo tên cán bộ..."
              aria-label="Tìm kiếm cán bộ"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <FormControl
              size="small"
              sx={{ minWidth: { xs: "100%", md: 210 } }}
            >
              <InputLabel id="staff-facility-label">Cơ sở y tế</InputLabel>
              <Select
                labelId="staff-facility-label"
                defaultValue="all"
                label="Cơ sở y tế"
              >
                <MenuItem value="all">Tất cả cơ sở</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              size="small"
              sx={{ minWidth: { xs: "100%", md: 170 } }}
            >
              <InputLabel id="staff-status-label">Trạng thái</InputLabel>
              <Select
                labelId="staff-status-label"
                defaultValue="all"
                label="Trạng thái"
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="active">Đang hoạt động</MenuItem>
                <MenuItem value="inactive">Ngừng hoạt động</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Box
            sx={{
              mt: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <StaffEmptyState />
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}