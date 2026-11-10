import { Box, Button, Typography } from "@mui/material";
import AddBusinessOutlinedIcon from "@mui/icons-material/AddBusinessOutlined";
import Link from "next/link";

export default function FacilityEmptyState() {
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
        <AddBusinessOutlinedIcon sx={{ fontSize: 32 }} />
      </Box>

      <Typography sx={{ mt: 2, fontWeight: 700 }}>
        Chưa có cơ sở y tế nào
      </Typography>

      <Typography
        sx={{
          mt: 0.75,
          color: "text.secondary",
          fontSize: 13,
          maxWidth: 360,
        }}
      >
        Thêm cơ sở y tế để quản lý thông tin, địa chỉ và thông tin liên hệ.
      </Typography>

      <Button
        component={Link}
        href="/admin/facilities/new"
        variant="contained"
        startIcon={<AddBusinessOutlinedIcon />}
        sx={{ mt: 2.5 }}
      >
        Thêm cơ sở y tế
      </Button>
    </Box>
  );
}