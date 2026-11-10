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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import DraftsOutlinedIcon from "@mui/icons-material/DraftsOutlined";
import PublishedWithChangesOutlinedIcon from "@mui/icons-material/PublishedWithChangesOutlined";

import AnnouncementEmptyState from "./AnnouncementEmptyState";

export default function AnnouncementManagementPage() {
  return (
    <Stack spacing={3}>
      {/* Heading */}
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
            }}
          >
            Quản lý thông báo
          </Typography>

          <Typography
            sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}
          >
            Tạo, chỉnh sửa và quản lý các thông báo trên website.
          </Typography>
        </Box>

        <Button
          component={Link}
          href="/admin/announcements/new"
          variant="contained"
          startIcon={<AddOutlinedIcon />}
          sx={{ alignSelf: { xs: "stretch", sm: "center" } }}
        >
          Tạo thông báo
        </Button>
      </Stack>

      {/* Summary */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SummaryCard
            label="Tổng thông báo"
            icon={<CampaignOutlinedIcon />}
            value="—"
            color="#087C70"
            background="#E5F3F0"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SummaryCard
            label="Đã xuất bản"
            icon={<PublishedWithChangesOutlinedIcon />}
            value="—"
            color="#2874B8"
            background="#EAF2FA"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SummaryCard
            label="Bản nháp"
            icon={<DraftsOutlinedIcon />}
            value="—"
            color="#9A6A17"
            background="#FBF3E4"
          />
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
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                placeholder="Tìm theo tiêu đề thông báo..."
                aria-label="Tìm kiếm thông báo"
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

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                select
                fullWidth
                label="Trạng thái"
                defaultValue="all"
              >
                <MenuItem value="all">Tất cả trạng thái</MenuItem>
                <MenuItem value="published">Đã xuất bản</MenuItem>
                <MenuItem value="draft">Bản nháp</MenuItem>
                <MenuItem value="archived">Đã lưu trữ</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                select
                fullWidth
                label="Danh mục"
                defaultValue="all"
              >
                <MenuItem value="all">Tất cả danh mục</MenuItem>
                <MenuItem value="announcement">Thông báo</MenuItem>
                <MenuItem value="news">Tin tức</MenuItem>
                <MenuItem value="health">Hoạt động y tế</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Announcement table */}
      <Card
        sx={{
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
          overflow: "hidden",
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
            Danh sách thông báo
          </Typography>

          <Typography
            sx={{ mt: 0.5, fontSize: 12, color: "text.secondary" }}
          >
            Quản lý nội dung và trạng thái xuất bản.
          </Typography>
        </Box>

        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 760 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "action.hover" }}>
                <TableCell sx={{ fontWeight: 700 }}>Tiêu đề</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Danh mục</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Người tạo</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Ngày đăng</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCell colSpan={6} sx={{ p: 0 }}>
                  <AnnouncementEmptyState />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            px: 2.5,
            py: 1.75,
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
            <Chip size="small" label="Trang 1" variant="outlined" />
          </Stack>
        </Box>
      </Card>
    </Stack>
  );
}

interface SummaryCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  background: string;
}

function SummaryCard({
  label,
  value,
  icon,
  color,
  background,
}: SummaryCardProps) {
  return (
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
              bgcolor: background,
              color,
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>

          <Box>
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
              {label}
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: 26,
                fontWeight: 800,
                lineHeight: 1.3,
              }}
            >
              {value}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}