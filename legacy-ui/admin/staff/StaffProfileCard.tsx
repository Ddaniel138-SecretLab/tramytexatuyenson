
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";

interface StaffProfileCardProps {
  staffId: string;
}

const profileFields = [
  {
    label: "Họ và tên",
    value: "—",
    icon: PersonOutlineOutlinedIcon,
  },
  {
    label: "Số điện thoại",
    value: "—",
    icon: PhoneOutlinedIcon,
  },
  {
    label: "Chức vụ",
    value: "—",
    icon: WorkOutlineOutlinedIcon,
  },
  {
    label: "Cơ sở công tác",
    value: "—",
    icon: BusinessOutlinedIcon,
  },
];

export default function StaffProfileCard({
  staffId,
}: StaffProfileCardProps) {
  return (
    <Card
      sx={{
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "none",
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ alignItems: { xs: "flex-start", sm: "center" } }}
        >
          <Avatar
            sx={{
              width: 88,
              height: 88,
              bgcolor: "primary.light",
              color: "primary.dark",
              fontSize: 32,
            }}
          >
            <PersonOutlineOutlinedIcon fontSize="large" />
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: 700,
                color: "text.primary",
              }}
            >
              Chưa có thông tin cán bộ
            </Typography>

            <Typography
              sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}
            >
              Mã hồ sơ: {staffId}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
              <Chip
                size="small"
                label="Chưa xác định trạng thái"
                variant="outlined"
                color="default"
              />
            </Stack>
          </Box>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Typography sx={{ mb: 2, fontSize: 15, fontWeight: 700 }}>
          Thông tin cơ bản
        </Typography>

        <Grid container spacing={2.5}>
          {profileFields.map((field) => {
            const Icon = field.icon;

            return (
              <Grid key={field.label} size={{ xs: 12, sm: 6 }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}>
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
                    <Typography
                      sx={{ fontSize: 12, color: "text.secondary" }}
                    >
                      {field.label}
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.5,
                        fontSize: 14,
                        fontWeight: 600,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {field.value}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
}
