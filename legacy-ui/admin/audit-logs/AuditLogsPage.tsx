"use client";

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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/Refresh";

import AuditLogEmptyState from "./AuditLogEmptyState";

export default function AuditLogsPage() {
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
            Nhật ký hoạt động
          </Typography>

          <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>
            Theo dõi lịch sử thao tác và thay đổi dữ liệu trên hệ thống.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshOutlinedIcon />}
          onClick={() => window.location.reload()}
          sx={{
            alignSelf: { xs: "flex-start", sm: "auto" },
            textTransform: "none",
          }}
        >
          Làm mới
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
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Box
              sx={{
                width: 46,
                height: 46,
                display: "grid",
                placeItems: "center",
                borderRadius: 2.5,
                bgcolor: "primary.light",
                color: "primary.main",
                flexShrink: 0,
              }}
            >
              <HistoryOutlinedIcon />
            </Box>

            <Box>
              <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                Tổng số hoạt động được ghi nhận
              </Typography>

              <Typography sx={{ mt: 0.25, fontSize: 25, fontWeight: 800 }}>
                —
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card
        sx={{
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ mb: 2, alignItems: 'center' }}
          >
            <FilterAltOutlinedIcon
              sx={{ fontSize: 20, color: "primary.main" }}
            />

            <Typography sx={{ fontSize: 15, fontWeight: 700 }}>
              Bộ lọc nhật ký
            </Typography>
          </Stack>

          <Stack spacing={1.5}>
            <TextField
              fullWidth
              size="small"
              placeholder="Tìm theo người thực hiện, email hoặc nội dung..."
              aria-label="Tìm kiếm nhật ký"
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

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(4, minmax(0, 1fr))",
                },
                gap: 1.5,
              }}
            >
              <FormControl fullWidth size="small">
                <InputLabel id="audit-action-label">
                  Loại hành động
                </InputLabel>

                <Select
                  labelId="audit-action-label"
                  defaultValue="all"
                  label="Loại hành động"
                >
                  <MenuItem value="all">Tất cả hành động</MenuItem>
                  <MenuItem value="create">Tạo mới</MenuItem>
                  <MenuItem value="update">Cập nhật</MenuItem>
                  <MenuItem value="delete">Xóa</MenuItem>
                  <MenuItem value="password">Đổi / đặt lại mật khẩu</MenuItem>
                  <MenuItem value="permission">Thay đổi quyền</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel id="audit-target-label">
                  Đối tượng
                </InputLabel>

                <Select
                  labelId="audit-target-label"
                  defaultValue="all"
                  label="Đối tượng"
                >
                  <MenuItem value="all">Tất cả đối tượng</MenuItem>
                  <MenuItem value="staff">Cán bộ</MenuItem>
                  <MenuItem value="user">Tài khoản</MenuItem>
                  <MenuItem value="announcement">Thông báo</MenuItem>
                  <MenuItem value="facility">Cơ sở y tế</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                size="small"
                type="date"
                label="Từ ngày"
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />

              <TextField
                fullWidth
                size="small"
                type="date"
                label="Đến ngày"
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Logs table */}
      <Card
        sx={{
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ px: { xs: 2, sm: 2.5 }, pt: 2.5 }}>
            <Typography sx={{ fontSize: 15, fontWeight: 700 }}>
              Lịch sử hoạt động
            </Typography>

            <Typography
              sx={{ mt: 0.5, mb: 2, fontSize: 12, color: "text.secondary" }}
            >
              Nhật ký được sắp xếp theo thời gian mới nhất.
            </Typography>
          </Box>

          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 760 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "action.hover" }}>
                  {[
                    "Người thực hiện",
                    "Hành động",
                    "Đối tượng",
                    "Nội dung thay đổi",
                    "Thời gian",
                  ].map((heading) => (
                    <TableCell
                      key={heading}
                      sx={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "text.secondary",
                        whiteSpace: "nowrap",
                        py: 1.5,
                      }}
                    >
                      {heading}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} sx={{ p: 0, borderBottom: 0 }}>
                    <AuditLogEmptyState />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination placeholder */}
          <Box
            sx={{
              px: 2.5,
              py: 2,
              borderTop: "1px solid",
              borderColor: "divider",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
              Chưa có bản ghi
            </Typography>

            <Stack direction="row" spacing={1}>
              <Button size="small" variant="outlined" disabled>
                Trước
              </Button>

              <Button size="small" variant="outlined" disabled>
                Sau
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}