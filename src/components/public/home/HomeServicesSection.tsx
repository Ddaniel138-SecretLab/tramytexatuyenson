import { Box, Card, CardContent, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import VaccinesOutlinedIcon from "@mui/icons-material/VaccinesOutlined";
import ChildCareOutlinedIcon from "@mui/icons-material/ChildCareOutlined";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined";

const services = [
  {
    icon: <MedicalServicesOutlinedIcon />,
    category: "KHÁM CHỮA BỆNH",
    title: "Khám và chăm sóc sức khỏe ban đầu",
    description: "Khám bệnh, tư vấn sức khỏe, sơ cứu và cấp cứu ban đầu; theo dõi, điều trị ngoại trú và chăm sóc sức khỏe theo phạm vi chuyên môn được phê duyệt.",
    accent: "#087B68",
    soft: "#E5F5EF",
  },
  {
    icon: <VaccinesOutlinedIcon />,
    category: "Y TẾ DỰ PHÒNG",
    title: "Tiêm chủng và phòng chống dịch bệnh",
    description: "Tổ chức tiêm chủng theo kế hoạch, giám sát và phát hiện sớm dịch bệnh; hướng dẫn người dân chủ động phòng bệnh tại cộng đồng.",
    accent: "#2974B8",
    soft: "#E9F2FC",
  },
  {
    icon: <ChildCareOutlinedIcon />,
    category: "SỨC KHỎE BÀ MẸ VÀ TRẺ EM",
    title: "Chăm sóc bà mẹ và trẻ em",
    description: "Tư vấn chăm sóc sức khỏe sinh sản, bà mẹ trong thai kỳ, chăm sóc sau sinh, sức khỏe trẻ em và dinh dưỡng theo chương trình y tế.",
    accent: "#C16C8B",
    soft: "#FBEFF3",
  },
  {
    icon: <MonitorHeartOutlinedIcon />,
    category: "QUẢN LÝ SỨC KHỎE",
    title: "Quản lý bệnh mạn tính và người cao tuổi",
    description: "Sàng lọc, tư vấn và theo dõi bệnh không lây nhiễm; quản lý sức khỏe người cao tuổi và hỗ trợ chăm sóc tại cộng đồng.",
    accent: "#B47A29",
    soft: "#FAF2E5",
  },
  {
    icon: <GroupsOutlinedIcon />,
    category: "DÂN SỐ VÀ GIA ĐÌNH",
    title: "Dân số và kế hoạch hóa gia đình",
    description: "Tư vấn kế hoạch hóa gia đình, sức khỏe trước hôn nhân và phối hợp triển khai hoạt động nâng cao chất lượng dân số tại địa phương.",
    accent: "#785EB4",
    soft: "#F1EDFA",
  },
  {
    icon: <HealthAndSafetyOutlinedIcon />,
    category: "SỨC KHỎE CỘNG ĐỒNG",
    title: "Dinh dưỡng, an toàn thực phẩm và môi trường",
    description: "Truyền thông dinh dưỡng, y tế trường học, vệ sinh môi trường và phối hợp giám sát nguy cơ ảnh hưởng đến sức khỏe cộng đồng.",
    accent: "#41845B",
    soft: "#EAF4EB",
  },
];

export default function HomeServicesSection() {
  return (
    <Box sx={{ bgcolor: "#F7FAF8", py: { xs: 6, sm: 7, md: 10 } }}>
      <Container maxWidth="xl">
        <Stack spacing={1.5} sx={{ mb: { xs: 3.5, md: 5 }, alignItems: "center", textAlign: "center" }}>
          <Chip label="CHĂM SÓC SỨC KHỎE TOÀN DIỆN" variant="outlined" sx={{ height: 30, color: "#087B68", bgcolor: "#E9F5EF", borderColor: "#CDE7D9", fontSize: 11, fontWeight: 800, letterSpacing: 0.7 }} />
          <Typography component="h2" sx={{ color: "#124F43", fontSize: { xs: 25, sm: 30, md: 36 }, fontWeight: 800, lineHeight: 1.3 }}>
            Các hoạt động y tế tại địa phương
          </Typography>
          <Typography sx={{ maxWidth: 720, color: "text.secondary", fontSize: { xs: 14, sm: 15 }, lineHeight: 1.9 }}>
            Trạm Y tế xã Tuyên Sơn triển khai các hoạt động chăm sóc sức khỏe ban đầu, y tế dự phòng và chăm sóc sức khỏe cộng đồng phù hợp với chức năng, nhiệm vụ và điều kiện thực tế.
          </Typography>
        </Stack>

        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {services.map((service, index) => (
            <Grid key={service.title} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ height: "100%", minHeight: { xs: 250, md: 280 }, borderRadius: 3.5, border: "1px solid #E5EEE9", boxShadow: "0 5px 22px rgba(22,72,57,0.035)", transition: "transform .25s ease, box-shadow .25s ease", "&:hover": { transform: { md: "translateY(-6px)" }, boxShadow: "0 15px 35px rgba(22,72,57,0.09)" } }}>
                <CardContent sx={{ p: { xs: 2.5, md: 3 }, height: "100%", display: "flex", flexDirection: "column", "&:last-child": { pb: { xs: 2.5, md: 3 } } }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Box sx={{ width: 58, height: 58, display: "grid", placeItems: "center", borderRadius: 3, bgcolor: service.soft, color: service.accent, "& svg": { fontSize: 31 } }}>
                      {service.icon}
                    </Box>
                    <Typography sx={{ color: "#9AA9A1", fontSize: 12, fontWeight: 800, letterSpacing: 1 }}>{String(index + 1).padStart(2, "0")}</Typography>
                  </Stack>
                  <Typography sx={{ mt: 2.5, color: service.accent, fontSize: 10.5, fontWeight: 800, letterSpacing: 0.65, lineHeight: 1.6 }}>{service.category}</Typography>
                  <Typography component="h3" sx={{ mt: 0.75, color: "#194B40", fontSize: { xs: 17, md: 18 }, fontWeight: 800, lineHeight: 1.5 }}>{service.title}</Typography>
                  <Typography sx={{ mt: 1.25, color: "#66766F", fontSize: 13.5, lineHeight: 1.85 }}>{service.description}</Typography>
                  <Box sx={{ flex: 1 }} />
                  <Box sx={{ mt: 2.5, pt: 1.75, borderTop: "1px solid #EDF2EF", display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: service.accent }} />
                    <Typography sx={{ color: "#809089", fontSize: 11.5, fontWeight: 600 }}>Hoạt động y tế cơ sở</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 3, px: { xs: 2, sm: 2.5 }, py: 2, borderRadius: 2.5, bgcolor: "#EDF5F0", border: "1px solid #DFECE4" }}>
          <Typography sx={{ color: "#5D766A", fontSize: 12.5, lineHeight: 1.8, textAlign: { xs: "left", md: "center" } }}>
            Hoạt động chuyên môn được triển khai theo kế hoạch y tế địa phương, điều kiện thực tế và phạm vi chuyên môn được cấp có thẩm quyền phê duyệt.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
