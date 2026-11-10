
import {
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";

export default function StaffAccountCard() {
  return (
    <Card
      sx={{
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "none",
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
          Tài khoản đăng nhập
        </Typography>

        <Typography
          sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}
        >
          Quản lý tài khoản được liên kết với hồ sơ cán bộ.
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1.5}>
          <Stack
            direction="row"
            sx={{ alignItems: "center", gap: 1, justifyContent: "space-between" }}
          >
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
              Email đăng nhập
            </Typography>
            <Typography
              sx={{ fontSize: 13, fontWeight: 600, overflowWrap: "anywhere" }}
            >
              —
            </Typography>
          </Stack>

          <Stack
            direction="row"
            sx={{ alignItems: "center", gap: 1, justifyContent: "space-between" }}
          >
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
              Trạng thái tài khoản
            </Typography>
            <Chip size="small" label="Chưa liên kết" variant="outlined" />
          </Stack>

          <Stack
            direction="row"
            sx={{ alignItems: "center", gap: 1, justifyContent: "space-between" }}
          >
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
              Quyền đăng thông báo
            </Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
              —
            </Typography>
          </Stack>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography sx={{ mb: 1.5, fontSize: 13, fontWeight: 700 }}>
          Thao tác tài khoản
        </Typography>

        <Stack spacing={1}>
          <Button
            fullWidth
            disabled
            variant="outlined"
            color="warning"
            startIcon={<LockOutlinedIcon />}
          >
            Khóa tài khoản
          </Button>

          <Button
            fullWidth
            disabled
            variant="outlined"
            startIcon={<LockResetOutlinedIcon />}
          >
            Đặt lại mật khẩu
          </Button>

          <Button
            fullWidth
            disabled
            variant="outlined"
            color="error"
            startIcon={<PersonOffOutlinedIcon />}
          >
            Xóa tài khoản đăng nhập
          </Button>
        </Stack>

        <Typography
          sx={{
            mt: 1.5,
            fontSize: 11,
            color: "text.secondary",
            lineHeight: 1.6,
          }}
        >
          Các thao tác quản lý tài khoản sẽ được kích hoạt sau khi kết nối API
          và phân quyền quản trị.
        </Typography>
      </CardContent>
    </Card>
  );
}
