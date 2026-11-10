
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";

const fields = [
  { label: "Email đăng nhập", value: "—", icon: EmailOutlinedIcon },
  { label: "Hồ sơ cán bộ liên kết", value: "—", icon: PersonOutlineOutlinedIcon },
  { label: "Ngày tạo tài khoản", value: "—", icon: CalendarTodayOutlinedIcon },
  { label: "Vai trò", value: "—", icon: BadgeOutlinedIcon },
];

interface UserDetailInfoCardProps {
  userId: string;
}

export default function UserDetailInfoCard({
  userId,
}: UserDetailInfoCardProps) {
  return (
    <Card sx={{ border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: { sm: "center" } }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: "primary.light",
              color: "primary.dark",
            }}
          >
            <PersonOutlineOutlinedIcon fontSize="large" />
          </Avatar>

          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 19, fontWeight: 700 }}>
              Chưa có thông tin người dùng
            </Typography>
            <Typography
              sx={{
                mt: 0.5,
                fontSize: 12,
                color: "text.secondary",
                overflowWrap: "anywhere",
              }}
            >
              ID: {userId}
            </Typography>
            <Chip
              size="small"
              label="Chưa xác định trạng thái"
              variant="outlined"
              sx={{ mt: 1 }}
            />
          </Box>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Typography sx={{ mb: 2, fontSize: 15, fontWeight: 700 }}>
          Thông tin tài khoản
        </Typography>

        <Stack spacing={2.5}>
          {fields.map((field) => {
            const Icon = field.icon;

            return (
              <Stack
                key={field.label}
                direction="row"
                spacing={1.5}
                sx={{ alignItems: "center" }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 2,
                    bgcolor: "action.hover",
                    color: "text.secondary",
                  }}
                >
                  <Icon fontSize="small" />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                    {field.label}
                  </Typography>
                  <Typography
                    sx={{
                      mt: 0.25,
                      fontSize: 14,
                      fontWeight: 600,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {field.value}
                  </Typography>
                </Box>
              </Stack>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}
