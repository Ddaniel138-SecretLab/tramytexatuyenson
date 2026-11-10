import NextLink from "@/components/shared/NextLink";
import { Box, Button, Card, CardContent, Container, Grid, Stack, Typography, Divider  } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneInTalkOutlinedIcon from "@mui/icons-material/PhoneInTalkOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import PublicPageHeader from "../shared/PublicPageHeader";

const contactItems = [
  {
    icon: <LocationOnOutlinedIcon />,
    title: "Địa chỉ",
    description: "Xã Tuyên Sơn, tỉnh Quảng Trị",
  },
  {
    icon: <AccessTimeOutlinedIcon />,
    title: "Thời gian làm việc",
    description:
      "Theo giờ hành chính và lịch trực y tế được thông báo tại cơ sở.",
  },
];

export function ContactPage() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 5, md: 8 } }}>
      <PublicPageHeader
        eyebrow="KẾT NỐI VỚI CHÚNG TÔI"
        title="Thông tin liên hệ"
        description="Thông tin để người dân tìm hiểu và liên hệ với Trạm Y tế xã Tuyên Sơn."
      />

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ height: "100%", borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "0 5px 22px rgba(22,72,57,0.035)" }}>
            <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box sx={{ width: 48, height: 48, borderRadius: 2.5, bgcolor: "primary.light", color: "primary.main", display: "grid", placeItems: "center" }}>
                  <BusinessOutlinedIcon />
                </Box>
                <Box>
                  <Typography fontWeight={800} variant="h6">Trạm Y tế xã Tuyên Sơn</Typography>
                  <Typography variant="caption" color="text.secondary">Cổng thông tin y tế cộng đồng</Typography>
                </Box>
              </Stack>

              <Stack spacing={2.5} sx={{ mt: 3 }}>
                {contactItems.map((item) => (
                  <Stack
                    key={item.title}
                    direction="row"
                    spacing={1.75}
                    alignItems="flex-start"
                  >
                    <Box
                      sx={{
                        mt: 0.25,
                        color: "primary.main",
                        display: "flex",
                        "& svg": { fontSize: 22 },
                      }}
                    >
                      {item.icon}
                    </Box>

                    <Box>
                      <Typography fontWeight={700} fontSize={14}>
                        {item.title}
                      </Typography>
                      <Typography
                        color="text.secondary"
                        variant="body2"
                        sx={{ mt: 0.4, lineHeight: 1.8 }}
                      >
                        {item.description}
                      </Typography>
                    </Box>
                  </Stack>
                ))}

                <Divider />

                <Box>
                  <Typography fontWeight={800} fontSize={15} sx={{ mb: 1.5 }}>
                    Thông tin liên hệ lãnh đạo
                  </Typography>

                  <Stack spacing={1.5}>
                    {[
                      {
                        position: "Giám đốc Trạm Y tế xã Tuyên Sơn",
                        name: "BS. Đinh Thanh Tuấn",
                        phone: process.env.NEXT_PUBLIC_DIRECTOR_PHONE_NUMBER ?? "Chưa cập nhật",
                      },
                      {
                        position: "Phó Giám đốc Trạm Y tế xã Tuyên Sơn",
                        name: "BS. Nguyễn Ánh Sáng",
                        phone: process.env.NEXT_PUBLIC_DEPUTY_DIRECTOR_PHONE_NUMBER ?? "Chưa cập nhật",
                      },
                    ].map((person) => (
                      <Box
                        key={person.position}
                        sx={{
                          p: 2,
                          borderRadius: 2.5,
                          bgcolor: "rgba(22, 128, 80, 0.055)",
                          border: "1px solid",
                          borderColor: "rgba(22, 128, 80, 0.12)",
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="primary.main"
                          fontWeight={800}
                        >
                          {person.position}
                        </Typography>

                        <Typography fontWeight={800} sx={{ mt: 0.5 }}>
                          {person.name}
                        </Typography>

                        <Stack
                          direction="row"
                          spacing={0.75}
                          alignItems="center"
                          sx={{ mt: 0.75 }}
                        >
                          <PhoneInTalkOutlinedIcon
                            sx={{ fontSize: 17, color: "primary.main" }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {person.phone}
                          </Typography>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: "100%", borderRadius: 3, overflow: "hidden", background: "linear-gradient(145deg, #075B53 0%, #087C70 100%)", color: "#FFFFFF" }}>
            <CardContent sx={{ p: { xs: 2.5, sm: 3.5 }, height: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <Typography sx={{ color: "#C9F29C", fontSize: 12, fontWeight: 800, letterSpacing: 1 }}>CHÚNG TÔI LUÔN SẴN SÀNG HỖ TRỢ</Typography>
              <Typography variant="h5" fontWeight={900} sx={{ mt: 1.5, lineHeight: 1.4 }}>Đồng hành vì sức khỏe của bạn và gia đình</Typography>
              <Typography sx={{ mt: 1.5, color: "rgba(255,255,255,0.82)", fontSize: 14, lineHeight: 1.9 }}>
                Người dân có thể tìm hiểu thông tin các cơ sở, đội ngũ cán bộ và những thông báo mới nhất trên cổng thông tin.
              </Typography>
              <Box sx={{ flex: 1, minHeight: 24 }} />
              <Stack direction={{ xs: "column", sm: "row", md: "column", lg: "row" }} spacing={1.25} sx={{ mt: 3, width: "100%" }}>
                <Button component={NextLink} href="/facilities" variant="contained" sx={{ bgcolor: "#C9F29C", color: "#075B53", fontWeight: 800, textTransform: "none", "&:hover": { bgcolor: "#B8E987" } }}>
                  Xem các cơ sở
                </Button>
                <Button component={NextLink} href="/announcements" variant="outlined" sx={{ color: "#FFFFFF", borderColor: "rgba(255,255,255,0.6)", fontWeight: 700, textTransform: "none", "&:hover": { borderColor: "#FFFFFF", bgcolor: "rgba(255,255,255,0.08)" } }}>
                  Xem thông báo
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
