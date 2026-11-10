
"use client";

import NextLink from "@/components/shared/NextLink";

import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function HomeHeroContent() {
  return (
    <>
      <Chip
        label="CỔNG THÔNG TIN Y TẾ CỘNG ĐỒNG"
        sx={{
          mb: 2.5,
          color: "#FFFFFF",
          bgcolor: "rgba(255,255,255,0.15)",
          fontWeight: 700,
          fontSize: { xs: 10, sm: 12 },
          letterSpacing: 0.5,
          border: "1px solid rgba(255,255,255,0.16)",
        }}
      />

      <Typography
        component="h1"
        sx={{
          fontSize: {
            xs: 30,
            sm: 40,
            md: 48,
            lg: 54,
          },
          fontWeight: 800,
          lineHeight: 1.2,
          maxWidth: 720,
        }}
      >
        TRẠM Y TẾ
        <Box
          component="span"
          sx={{
            display: "block",
            color: "#C9F29C",
          }}
        >
          XÃ TUYÊN SƠN
        </Box>
      </Typography>

      <Typography
        sx={{
          mt: 2.5,
          maxWidth: 620,
          fontSize: { xs: 15, sm: 17 },
          lineHeight: 1.9,
          color: "rgba(255,255,255,0.85)",
        }}
      >
        Cập nhật thông tin y tế, lịch khám, lịch tiêm chủng và hoạt
        động chăm sóc sức khỏe cộng đồng. Đồng hành cùng người dân
        xây dựng cuộc sống khỏe mạnh.
      </Typography>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{
          mt: 4,
          maxWidth: { xs: "100%", sm: "none" },
        }}
      >
        <Button
          component={NextLink}
          href="/announcements"
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          sx={{
            px: 3.5,
            py: 1.4,
            minHeight: 48,
            bgcolor: "#C9F29C",
            color: "#075B53",
            fontWeight: 800,
            borderRadius: 2.5,
            textTransform: "none",
            boxShadow: "0 5px 16px rgba(0,0,0,0.12)",
            "&:hover": {
              bgcolor: "#B8E987",
              boxShadow: "0 7px 20px rgba(0,0,0,0.16)",
            },
          }}
        >
          Xem thông báo
        </Button>

        <Button
          component={NextLink}
          href="/contact"
          variant="outlined"
          sx={{
            px: 3,
            py: 1.4,
            minHeight: 48,
            color: "#FFFFFF",
            borderColor: "rgba(255,255,255,0.65)",
            borderRadius: 2.5,
            fontWeight: 700,
            textTransform: "none",
            "&:hover": {
              borderColor: "#FFFFFF",
              bgcolor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          Thông tin liên hệ
        </Button>
      </Stack>
    </>
  );
}
