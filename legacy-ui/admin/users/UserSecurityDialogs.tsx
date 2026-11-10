
"use client";

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";

export type UserSecurityAction = "lock" | "unlock" | "reset-password";

interface UserSecurityDialogsProps {
  open: boolean;
  action: UserSecurityAction | null;
  onClose: () => void;
  onConfirm: () => void;
}

const actionContent = {
  lock: {
    title: "Xác nhận khóa tài khoản",
    description:
      "Tài khoản này sẽ không thể đăng nhập hệ thống sau khi bị khóa. Bạn có chắc chắn muốn tiếp tục?",
    confirmLabel: "Khóa tài khoản",
    icon: LockOutlinedIcon,
    color: "warning" as const,
  },
  unlock: {
    title: "Xác nhận mở khóa tài khoản",
    description:
      "Tài khoản sẽ được phép đăng nhập hệ thống trở lại. Bạn có chắc chắn muốn tiếp tục?",
    confirmLabel: "Mở khóa tài khoản",
    icon: LockOpenOutlinedIcon,
    color: "success" as const,
  },
  "reset-password": {
    title: "Đặt lại mật khẩu",
    description:
      "Hệ thống sẽ gửi email hướng dẫn đặt lại mật khẩu đến địa chỉ email đã đăng ký của tài khoản.",
    confirmLabel: "Xác nhận gửi email",
    icon: LockResetOutlinedIcon,
    color: "primary" as const,
  },
};

export default function UserSecurityDialogs({
  open,
  action,
  onClose,
  onConfirm,
}: UserSecurityDialogsProps) {
  if (!action) return null;

  const content = actionContent[action];
  const Icon = content.icon;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="user-security-dialog-title"
    >
      <DialogTitle id="user-security-dialog-title">
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Icon color={content.color} />
          <Typography sx={{ fontSize: 17, fontWeight: 700 }}>
            {content.title}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <Typography sx={{ fontSize: 14, color: "text.secondary", lineHeight: 1.7 }}>
            {content.description}
          </Typography>

          {action === "reset-password" && (
            <Alert severity="info">
              Không gửi hoặc lưu mật khẩu dạng văn bản. Người dùng sẽ tự đặt
              mật khẩu mới thông qua liên kết trong email.
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button onClick={onClose} color="inherit" variant="outlined">
          Hủy
        </Button>

        <Button
          onClick={onConfirm}
          color={content.color}
          variant="contained"
        >
          {content.confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
