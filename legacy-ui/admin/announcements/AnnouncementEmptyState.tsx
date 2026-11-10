import Link from "next/link";
import { Box, Button, Typography } from "@mui/material";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

export default function AnnouncementEmptyState() {
  return (
    <Box
      sx={{
        py: 7,
        px: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: 3,
          bgcolor: "action.hover",
          display: "grid",
          placeItems: "center",
          color: "text.secondary",
        }}
      >
        <CampaignOutlinedIcon sx={{ fontSize: 32 }} />
      </Box>

      <Typography sx={{ mt: 2, fontWeight: 700 }}>
        Chưa có thông báo nào
      </Typography>

      <Typography
        sx={{
          mt: 0.75,
          color: "text.secondary",
          fontSize: 13,
          maxWidth: 380,
        }}
      >
        Tạo thông báo đầu tiên để đăng tải tin tức và các hoạt động của trạm y tế.
      </Typography>

      <Button
        component={Link}
        href="/admin/announcements/new"
        variant="contained"
        startIcon={<AddOutlinedIcon />}
        sx={{ mt: 2.5 }}
      >
        Tạo thông báo
      </Button>
    </Box>
  );
}