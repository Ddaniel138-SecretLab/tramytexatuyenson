
import Link from "next/link";

import {
  Box,
  Button,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import StaffProfileCard from "./StaffProfileCard";
import StaffAccountCard from "./StaffAccountCard";

interface StaffDetailPageProps {
  staffId: string;
}

export default function StaffDetailPage({
  staffId,
}: StaffDetailPageProps) {
  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between" }}
      >
        <Box>
          <Typography
            sx={{ fontSize: { xs: 20, sm: 24 }, fontWeight: 800 }}
          >
            Chi tiết cán bộ
          </Typography>

          <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>
            Xem hồ sơ và quản lý tài khoản cán bộ.
          </Typography>
        </Box>

        <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }} >
          <Button
            component={Link}
            href="/admin/staff"
            variant="outlined"
            color="inherit"
            startIcon={<ArrowBackOutlinedIcon />}
          >
            Quay lại
          </Button>

          <Button
            component={Link}
            href={`/admin/staff/${staffId}/edit`}
            variant="contained"
            startIcon={<EditOutlinedIcon />}
          >
            Chỉnh sửa
          </Button>

          <Button
            disabled
            variant="outlined"
            color="error"
            startIcon={<DeleteOutlineOutlinedIcon />}
          >
            Xóa hồ sơ
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={2.5} sx={{ alignItems: "flex-start" }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <StaffProfileCard staffId={staffId} />
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <StaffAccountCard />
        </Grid>
      </Grid>
    </Stack>
  );
}
