"use client";

import Link from "next/link";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AddBusinessOutlinedIcon from "@mui/icons-material/AddBusinessOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import FacilityEmptyState from "./FacilityEmptyState";

export default function FacilityManagementPage() {
  return (
    <Stack spacing={3}>
      {/* Page heading */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: { xs: 22, sm: 26 },
              fontWeight: 800,
              color: "text.primary",
            }}
          >
            Quản lý cơ sở y tế
          </Typography>

          <Typography
            sx={{ mt: 0.5, color: "text.secondary", fontSize: 13 }}
          >
            Quản lý thông tin các cơ sở thuộc Trạm Y tế xã Tuyên Sơn.
          </Typography>
        </Box>

        <Button
          component={Link}
          href="/admin/facilities/new"
          variant="contained"
          startIcon={<AddBusinessOutlinedIcon />}
          sx={{ alignSelf: { xs: "stretch", sm: "center" } }}
        >
          Thêm cơ sở
        </Button>
      </Stack>

      {/* Summary */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{
              height: "100%",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2.5,
                    bgcolor: "#E5F3F0",
                    color: "#087C70",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <BusinessOutlinedIcon />
                </Box>

                <Box>
                  <Typography
                    sx={{ fontSize: 13, color: "text.secondary" }}
                  >
                    Tổng số cơ sở
                  </Typography>

                  <Typography
                    sx={{ fontSize: 26, fontWeight: 800, lineHeight: 1.3 }}
                  >
                    —
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{
              height: "100%",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2.5,
                    bgcolor: "#EAF2FA",
                    color: "#2874B8",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <BusinessOutlinedIcon />
                </Box>

                <Box>
                  <Typography
                    sx={{ fontSize: 13, color: "text.secondary" }}
                  >
                    Đang hoạt động
                  </Typography>

                  <Typography
                    sx={{ fontSize: 26, fontWeight: 800, lineHeight: 1.3 }}
                  >
                    —
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card
        sx={{
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                fullWidth
                size="medium"
                placeholder="Tìm theo tên cơ sở, địa chỉ..."
                aria-label="Tìm kiếm cơ sở y tế"
                slotProps={{
                  input: {
                    startAdornment: (
                      <SearchOutlinedIcon
                        sx={{ mr: 1, color: "text.secondary" }}
                      />
                    ),
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                select
                fullWidth
                size="medium"
                label="Trạng thái"
                defaultValue="all"
              >
                <MenuItem value="all">Tất cả trạng thái</MenuItem>
                <MenuItem value="active">
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <Chip size="small" color="success" label="Hoạt động" />
                  </Stack>
                </MenuItem>
                <MenuItem value="inactive">
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <Chip size="small" color="default" label="Ngừng hoạt động" />
                  </Stack>
                </MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Data table */}
      <Card
        sx={{
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
        }}
      >
        <Box
          sx={{
            px: 2.5,
            py: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography sx={{ fontWeight: 700 }}>
            Danh sách cơ sở
          </Typography>

          <Typography sx={{ mt: 0.5, fontSize: 12, color: "text.secondary" }}>
            Danh sách các cơ sở y tế được quản lý trên hệ thống.
          </Typography>
        </Box>

        <FacilityEmptyState />
      </Card>
    </Stack>
  );
}