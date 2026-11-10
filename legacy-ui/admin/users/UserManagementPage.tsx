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
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import SearchIcon from "@mui/icons-material/Search";

import UserEmptyState from "./UserEmptyState";

export default function UserManagementPage() {
  return (
    <Stack spacing={3}>
      {/* Heading */}
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
            Quản lý tài khoản
          </Typography>

          <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>
            Quản lý tài khoản đăng nhập và quyền truy cập của nhân viên.
          </Typography>
        </Box>

        <Button
          component={Link}
          href="/admin/users/new"
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            alignSelf: { xs: "stretch", sm: "auto" },
            textTransform: "none",
            fontWeight: 700,
            py: 1.1,
          }}
        >
          Tạo tài khoản
        </Button>
      </Stack>

      {/* Summary */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(3, minmax(0, 1fr))",
          },
          gap: 2,
        }}
      >
        {[
          {
            label: "Tổng tài khoản",
            value: "—",
            description: "Tất cả tài khoản trong hệ thống",
          },
          {
            label: "Đang hoạt động",
            value: "—",
            description: "Tài khoản được phép đăng nhập",
          },
          {
            label: "Tài khoản STAFF",
            value: "—",
            description: "Tài khoản nhân viên",
          },
        ].map((item) => (
          <Card
            key={item.label}
            sx={{
              height: "100%",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Stack sx={{ direction: "row", spacing: 1.5, alignItems: "center" }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 2.5,
                    bgcolor: "primary.light",
                    color: "primary.main",
                    flexShrink: 0,
                  }}
                >
                  <ManageAccountsOutlinedIcon />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                    {item.label}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.25,
                      fontSize: 25,
                      lineHeight: 1.3,
                      fontWeight: 800,
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              </Stack>

              <Typography
                sx={{ mt: 1.5, fontSize: 11, color: "text.secondary" }}
              >
                {item.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Account list */}
      <Card
        sx={{
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Typography sx={{ mb: 2, fontSize: 15, fontWeight: 700 }}>
            Danh sách tài khoản
          </Typography>

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.5}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Tìm theo email hoặc tên..."
              aria-label="Tìm kiếm tài khoản"
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
              sx={{ minWidth: { xs: "100%", md: 170 } }}
            >
              <InputLabel id="user-role-label">Vai trò</InputLabel>
              <Select
                labelId="user-role-label"
                defaultValue="all"
                label="Vai trò"
              >
                <MenuItem value="all">Tất cả vai trò</MenuItem>
                <MenuItem value="admin">ADMIN</MenuItem>
                <MenuItem value="staff">STAFF</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              size="small"
              sx={{ minWidth: { xs: "100%", md: 170 } }}
            >
              <InputLabel id="user-status-label">Trạng thái</InputLabel>
              <Select
                labelId="user-status-label"
                defaultValue="all"
                label="Trạng thái"
              >
                <MenuItem value="all">Tất cả trạng thái</MenuItem>
                <MenuItem value="active">Đang hoạt động</MenuItem>
                <MenuItem value="inactive">Đã khóa</MenuItem>
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
            <UserEmptyState />
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}