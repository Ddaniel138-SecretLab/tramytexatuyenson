"use client";

import { useEffect, useState } from "react";
import NextLink from "@/components/shared/NextLink";
import { Alert, Box, Button, Card, CardContent, Chip, Grid, Skeleton, Stack, Typography } from "@mui/material";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import DraftsOutlinedIcon from "@mui/icons-material/DraftsOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { AdminPageHeader } from "./ui";

type DashboardData = {
  staff: number;
  facilities: number;
  publishedAnnouncements: number;
  draftAnnouncements: number;
  recentAnnouncements: {
    id: string;
    title: string;
    type: string;
    status: string;
    created_at: string;
  }[];
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/dashboard", { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.message || "Không thể tải tổng quan.");
        return body.data as DashboardData;
      })
      .then(setData)
      .catch((cause: Error) => setError(cause.message));
  }, []);

  const cards = [
    { label: "Cán bộ", value: data?.staff, icon: GroupsOutlinedIcon, color: "#E5F3F0" },
    { label: "Cơ sở đang hoạt động", value: data?.facilities, icon: BusinessOutlinedIcon, color: "#EAF2FA" },
    { label: "Thông báo đã xuất bản", value: data?.publishedAnnouncements, icon: CampaignOutlinedIcon, color: "#FFF4E5" },
    { label: "Bản nháp", value: data?.draftAnnouncements, icon: DraftsOutlinedIcon, color: "#F1EEFA" },
  ];

  return (
    <Stack spacing={{ xs: 2.25, md: 3 }}>
      <AdminPageHeader
        eyebrow="TRUNG TÂM ĐIỀU HÀNH"
        title="Tổng quan hệ thống"
        description="Theo dõi tình hình hoạt động của Trạm Y tế xã Tuyên Sơn."
      />
      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={2}>
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Grid key={card.label} size={{ xs: 12, sm: 6, xl: 3 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                  <Stack direction="row" alignItems="center" spacing={1.8}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        flexShrink: 0,
                        borderRadius: 2.5,
                        bgcolor: card.color,
                        display: "grid",
                        placeItems: "center",
                        color: "primary.dark",
                        "& svg": { fontSize: 25 },
                      }}
                    >
                      <Icon />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" color="text.secondary">
                        {card.label}
                      </Typography>
                      {data ? (
                        <Typography variant="h4" fontWeight={900} sx={{ mt: 0.25 }}>
                          {card.value ?? 0}
                        </Typography>
                      ) : (
                        <Skeleton width={64} height={42} />
                      )}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                gap={1}
                sx={{ mb: 1.5 }}
              >
                <Box>
                  <Typography fontWeight={850}>Thông báo gần đây</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Các nội dung được cập nhật mới nhất.
                  </Typography>
                </Box>
                <Button
                  component={NextLink}
                  href="/admin/announcements"
                  endIcon={<ArrowForwardOutlinedIcon />}
                  sx={{ whiteSpace: "nowrap" }}
                >
                  Xem tất cả
                </Button>
              </Stack>

              {!data ? (
                <Stack spacing={1.5} sx={{ py: 1 }}>
                  <Skeleton height={52} />
                  <Skeleton height={52} />
                  <Skeleton height={52} />
                </Stack>
              ) : data.recentAnnouncements.length === 0 ? (
                <Typography color="text.secondary" variant="body2" sx={{ py: 4, textAlign: "center" }}>
                  Chưa có thông báo.
                </Typography>
              ) : (
                <Stack divider={<Box sx={{ borderBottom: "1px solid", borderColor: "divider" }} />}>
                  {data.recentAnnouncements.map((item) => (
                    <Stack
                      key={item.id}
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      sx={{ py: 1.5 }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography fontWeight={750}>{item.title}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.type} · {new Date(item.created_at).toLocaleDateString("vi-VN")}
                        </Typography>
                      </Box>
                      <Chip
                        size="small"
                        color={item.status === "PUBLISHED" ? "success" : "warning"}
                        label={item.status === "PUBLISHED" ? "Đã đăng" : "Bản nháp"}
                      />
                    </Stack>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Typography fontWeight={850}>Thao tác nhanh</Typography>
              <Typography variant="caption" color="text.secondary">
                Truy cập các chức năng quản trị thường dùng.
              </Typography>
              <Stack spacing={1.25} sx={{ mt: 2.25 }}>
                <Button
                  component={NextLink}
                  href="/admin/announcements"
                  variant="contained"
                  startIcon={<AddOutlinedIcon />}
                  fullWidth
                  sx={{ justifyContent: "flex-start", py: 1.25 }}
                >
                  Tạo thông báo
                </Button>
                <Button
                  component={NextLink}
                  href="/admin/staff"
                  variant="outlined"
                  startIcon={<GroupsOutlinedIcon />}
                  fullWidth
                  sx={{ justifyContent: "flex-start", py: 1.25 }}
                >
                  Quản lý cán bộ
                </Button>
                <Button
                  component={NextLink}
                  href="/admin/facilities"
                  variant="outlined"
                  startIcon={<BusinessOutlinedIcon />}
                  fullWidth
                  sx={{ justifyContent: "flex-start", py: 1.25 }}
                >
                  Quản lý cơ sở
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
