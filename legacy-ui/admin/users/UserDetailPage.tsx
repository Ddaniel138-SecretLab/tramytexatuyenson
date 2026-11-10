
"use client";

import { useState } from "react";
import Link from "next/link";

import {
  Alert,
  Box,
  Button,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import UserDetailInfoCard from "./UserDetailInfoCard";
import UserPermissionsCard from "./UserPermissionsCard";
import UserSecurityDialogs, {
  type UserSecurityAction,
} from "./UserSecurityDialogs";

interface UserDetailPageProps {
  userId: string;
}

export default function UserDetailPage({ userId }: UserDetailPageProps) {
  const [isActive, setIsActive] = useState(true);
  const [canPostAnnouncement] = useState(false);
  const [dialogAction, setDialogAction] =
    useState<UserSecurityAction | null>(null);
  const [notice, setNotice] = useState("");

  const handleConfirmAction = () => {
    if (!dialogAction) return;

    if (dialogAction === "lock") {
      setIsActive(false);
      setNotice(
        "Đã mô phỏng thao tác khóa tài khoản. Trạng thái thật chưa được cập nhật.",
      );
    }

    if (dialogAction === "unlock") {
      setIsActive(true);
      setNotice(
        "Đã mô phỏng thao tác mở khóa tài khoản. Trạng thái thật chưa được cập nhật.",
      );
    }

    if (dialogAction === "reset-password") {
      setNotice(
        "Giao diện đã ghi nhận yêu cầu đặt lại mật khẩu. Email chưa được gửi vì API chưa kết nối.",
      );
    }

    setDialogAction(null);
  };

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" }}}
      >
        <Box>
          <Typography
            sx={{ fontSize: { xs: 20, sm: 24 }, fontWeight: 800 }}
          >
            Chi tiết tài khoản
          </Typography>

          <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>
            Xem thông tin đăng nhập và quản lý quyền người dùng.
          </Typography>
        </Box>

        <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
          <Button
            component={Link}
            href="/admin/users"
            variant="outlined"
            color="inherit"
            startIcon={<ArrowBackOutlinedIcon />}
          >
            Quay lại
          </Button>

          <Button
            component={Link}
            href={`/admin/users/${userId}/edit`}
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
            Xóa tài khoản
          </Button>
        </Stack>
      </Stack>

      {notice && (
        <Alert severity="info" onClose={() => setNotice("")}>
          {notice}
        </Alert>
      )}

      <Grid container spacing={2.5} sx={{ alignItems: 'flex-start' }} >
        <Grid size={{ xs: 12, lg: 7 }}>
          <UserDetailInfoCard userId={userId} />
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <UserPermissionsCard
            isActive={isActive}
            canPostAnnouncement={canPostAnnouncement}
            onLock={() => setDialogAction("lock")}
            onUnlock={() => setDialogAction("unlock")}
            onResetPassword={() => setDialogAction("reset-password")}
          />
        </Grid>
      </Grid>

      <UserSecurityDialogs
        open={Boolean(dialogAction)}
        action={dialogAction}
        onClose={() => setDialogAction(null)}
        onConfirm={handleConfirmAction}
      />
    </Stack>
  );
}
