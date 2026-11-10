"use client";

import { useEffect, useState } from "react";
import NextLink from "@/components/shared/NextLink";
import { Alert, Button, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

type Me = {
  profile: {
    full_name: string;
    role: "STAFF" | "MANAGER";
    facility_id: string | null;
    facility?: { name: string } | null;
  };
};

export default function StaffDashboardPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/staff/profile", { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.message || "Không thể tải hồ sơ.");
        return body.data as Me["profile"];
      })
      .then((profile) => setMe({ profile }))
      .catch((cause: Error) => setError(cause.message));
  }, []);

  const isManager = me?.profile.role === "MANAGER";
  const facilityName = me?.profile.facility?.name ?? "Chưa được phân công";

  return (
    <Stack spacing={3}>
      <Stack>
        <Typography variant="h5" fontWeight={900}>Xin chào, {me?.profile.full_name ?? "nhân viên"}</Typography>
        <Typography variant="body2" color="text.secondary">Khu vực làm việc dành cho nhân viên và quản lý Trạm Y tế xã Tuyên Sơn.</Typography>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}
      {me && !isManager && !me.profile.facility_id && (
        <Alert severity="warning">Tài khoản của bạn chưa được phân công cơ sở. Bạn vẫn có thể cập nhật hồ sơ cá nhân, nhưng chưa thể tạo thông báo.</Alert>
      )}
      {isManager && (
        <Alert severity="info">Bạn có quyền đăng thông báo chung áp dụng cho cả hai điểm trạm. Cơ sở công tác hiện tại: {facilityName}.</Alert>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <CampaignOutlinedIcon color="primary" sx={{ fontSize: 34 }} />
              <Typography variant="h6" fontWeight={800} sx={{ mt: 1 }}>{isManager ? "Thông báo toàn trạm" : "Thông báo cơ sở"}</Typography>
              <Typography color="text.secondary" variant="body2" sx={{ mt: .5, mb: 2 }}>
                {isManager ? "Đăng và quản lý thông báo chung cho cả hai điểm trạm." : "Xem thông báo của cơ sở và quản lý các thông báo do bạn tạo."}
              </Typography>
              <Button component={NextLink} href="/staff/announcements" variant="contained">Mở thông báo</Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <PersonOutlineOutlinedIcon color="primary" sx={{ fontSize: 34 }} />
              <Typography variant="h6" fontWeight={800} sx={{ mt: 1 }}>Thông tin cá nhân</Typography>
              <Typography color="text.secondary" variant="body2" sx={{ mt: .5, mb: 2 }}>Kiểm tra và cập nhật thông tin liên hệ, chức vụ.</Typography>
              <Button component={NextLink} href="/staff/profile" variant="outlined">Cập nhật hồ sơ</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography fontWeight={800}>Thông tin công tác</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Vai trò: {isManager ? "Quản lý" : "Nhân viên"}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>Cơ sở công tác: {facilityName}</Typography>
          {isManager && <Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>Phạm vi đăng thông báo: Toàn trạm (cả hai điểm).</Typography>}
        </CardContent>
      </Card>
    </Stack>
  );
}
