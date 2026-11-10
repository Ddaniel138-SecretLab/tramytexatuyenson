import NextLink from "@/components/shared/NextLink";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import { Box, Button, Chip, Container, Grid, Stack, Typography } from "@mui/material";

export default function HomeHero() {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(120deg, #075B53 0%, #087C70 55%, #2C9B7B 100%)",
        color: "#FFFFFF",
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={{ xs: 4, md: 5 }} sx={{ alignItems: "center", py: { xs: 7, sm: 9, md: 13 }, minHeight: { md: 500 } }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Chip
              label="CỔNG THÔNG TIN Y TẾ CỘNG ĐỒNG"
              sx={{ mb: 2.5, color: "#FFFFFF", bgcolor: "rgba(255,255,255,0.15)", fontWeight: 700, fontSize: { xs: 10, sm: 12 }, letterSpacing: 0.5, border: "1px solid rgba(255,255,255,0.16)" }}
            />
            <Typography component="h1" sx={{ fontSize: { xs: 30, sm: 40, md: 48, lg: 54 }, fontWeight: 800, lineHeight: 1.2, maxWidth: 720 }}>
              TRẠM Y TẾ
              <Box component="span" sx={{ display: "block", color: "#C9F29C" }}>XÃ TUYÊN SƠN</Box>
            </Typography>
            <Typography sx={{ mt: 2.5, maxWidth: 620, fontSize: { xs: 15, sm: 17 }, lineHeight: 1.9, color: "rgba(255,255,255,0.85)" }}>
              Cập nhật thông tin y tế, lịch khám, lịch tiêm chủng và hoạt động chăm sóc sức khỏe cộng đồng. Đồng hành cùng người dân xây dựng cuộc sống khỏe mạnh.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 4, maxWidth: { xs: "100%", sm: "none" } }}>
              <Button
                component={NextLink}
                href="/announcements"
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                sx={{ px: 3.5, py: 1.4, minHeight: 48, bgcolor: "#C9F29C", color: "#075B53", fontWeight: 800, borderRadius: 2.5, textTransform: "none", boxShadow: "0 5px 16px rgba(0,0,0,0.12)", "&:hover": { bgcolor: "#B8E987", boxShadow: "0 7px 20px rgba(0,0,0,0.16)" } }}
              >
                Xem thông báo
              </Button>
              <Button
                component={NextLink}
                href="/contact"
                variant="outlined"
                sx={{ px: 3, py: 1.4, minHeight: 48, color: "#FFFFFF", borderColor: "rgba(255,255,255,0.65)", borderRadius: 2.5, fontWeight: 700, textTransform: "none", "&:hover": { borderColor: "#FFFFFF", bgcolor: "rgba(255,255,255,0.1)" } }}
              >
                Thông tin liên hệ
              </Button>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: "none", md: "flex" }, justifyContent: "center" }}>
            <Box sx={{ width: { md: 280, lg: 340 }, height: { md: 280, lg: 340 }, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.25)", bgcolor: "rgba(255,255,255,0.08)", display: "grid", placeItems: "center", position: "relative", "&::before": { content: '""', position: "absolute", inset: 18, borderRadius: "50%", border: "1px dashed rgba(255,255,255,0.25)" } }}>
              <Box sx={{ width: "75%", height: "75%", borderRadius: "50%", bgcolor: "rgba(255,255,255,0.08)", display: "grid", placeItems: "center" }}>
                <MedicalServicesOutlinedIcon sx={{ fontSize: { md: 140, lg: 180 }, color: "#FFFFFF" }} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
