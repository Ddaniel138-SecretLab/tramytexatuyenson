"use client";

import NextLink from "@/components/shared/NextLink";
import { Box, Button, Card, CardContent, Chip, Container, Stack, Typography } from "@mui/material";
import ElderlyOutlinedIcon from "@mui/icons-material/ElderlyOutlined";
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import { AboutActivitySection } from "./AboutActivitySection";

export default function AboutPage() {
  return (
    <Box sx={{ bgcolor: "#FFFFFF" }}>
      <Box sx={{ position: "relative", overflow: "hidden", bgcolor: "#EDF6F0", py: { xs: 5, sm: 7, md: 9 } }}>
        <Box sx={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", bgcolor: "rgba(69,157,112,0.07)", right: -100, top: -120 }} />
        <Box sx={{ position: "absolute", width: 220, height: 220, borderRadius: "50%", bgcolor: "rgba(69,157,112,0.06)", left: -100, bottom: -130 }} />

        <Container maxWidth="lg" sx={{ position: "relative" }}>
          <Box sx={{ maxWidth: 850 }}>
            <Chip label="GIỚI THIỆU VỀ CHÚNG TÔI" sx={{ mb: 2, height: 32, bgcolor: "#DCEFE3", color: "#176B50", fontSize: 11, fontWeight: 800, letterSpacing: 0.7 }} />
            <Typography component="h1" sx={{ color: "#124F40", fontWeight: 900, fontSize: { xs: 29, sm: 37, md: 44 }, lineHeight: 1.3 }}>
              Trạm Y tế xã Tuyên Sơn
            </Typography>
            <Typography sx={{ mt: 2, maxWidth: 760, color: "#587167", fontSize: { xs: 14, sm: 16 }, lineHeight: 2 }}>
              Với phương châm gần dân, sát dân và vì sức khỏe cộng đồng, Trạm Y tế xã Tuyên Sơn luôn quan tâm đến công tác chăm sóc sức khỏe ban đầu, hỗ trợ các đối tượng cần được quan tâm và phối hợp triển khai những hoạt động y tế thiết thực trên địa bàn.
            </Typography>
            <Typography sx={{ mt: 1.5, maxWidth: 760, color: "#587167", fontSize: { xs: 14, sm: 16 }, lineHeight: 2 }}>
              Không chỉ thực hiện các hoạt động chuyên môn tại cơ sở y tế, cán bộ trạm còn đồng hành cùng người cao tuổi, trẻ em, học sinh và người dân thông qua các chương trình chăm sóc sức khỏe và hoạt động vì cộng đồng.
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 3 }}>
              {["Chăm sóc sức khỏe", "Vì cộng đồng", "Gần dân, sát dân"].map((item) => (
                <Chip key={item} label={item} variant="outlined" sx={{ bgcolor: "rgba(255,255,255,0.65)", borderColor: "#C9E0D1", color: "#286B53", fontWeight: 700 }} />
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 5, sm: 7, md: 9 } }}>
        <Box sx={{ mb: { xs: 3.5, md: 5 }, textAlign: "center" }}>
          <Typography variant="overline" sx={{ color: "#278267", fontWeight: 800, letterSpacing: 1.2 }}>
            HOẠT ĐỘNG NỔI BẬT
          </Typography>
          <Typography component="h2" sx={{ mt: 0.75, color: "#164F40", fontWeight: 900, fontSize: { xs: 24, sm: 30, md: 34 }, lineHeight: 1.4 }}>
            Đồng hành cùng sức khỏe cộng đồng
          </Typography>
          <Typography sx={{ mt: 1.5, mx: "auto", maxWidth: 650, color: "text.secondary", fontSize: { xs: 13.5, sm: 15 }, lineHeight: 1.9 }}>
            Những hoạt động thiết thực thể hiện sự quan tâm, trách nhiệm và tinh thần phục vụ người dân của đội ngũ cán bộ y tế địa phương.
          </Typography>
        </Box>

        <Stack spacing={{ xs: 2.5, md: 3.5 }}>
          <AboutActivitySection
            number="01"
            eyebrow="CHĂM LO NGƯỜI CAO TUỔI"
            title="Thăm hỏi, hỗ trợ và đồng hành cùng người cao tuổi"
            description="Trạm Y tế quan tâm đến đời sống và sức khỏe của người cao tuổi, đặc biệt là những trường hợp có hoàn cảnh khó khăn, sức khỏe yếu hoặc gặp trở ngại trong sinh hoạt. Những lần thăm hỏi, động viên là dịp để cán bộ y tế nắm bắt tình hình sức khỏe, chia sẻ và hướng dẫn người dân cách chăm sóc bản thân phù hợp."
            image="/About/tham-kham-nguoi-gia1.jpg"
            imageAlt="Cán bộ y tế thăm hỏi, hỗ trợ người cao tuổi"
            imageCaption="Quan tâm, thăm hỏi và hỗ trợ người cao tuổi tại cộng đồng"
            icon={<ElderlyOutlinedIcon />}
            highlights={["Thăm hỏi người cao tuổi", "Hỗ trợ hoàn cảnh khó khăn", "Tư vấn chăm sóc sức khỏe"]}
          />

          <AboutActivitySection
            number="02"
            eyebrow="KHÁM VÀ TƯ VẤN SỨC KHỎE"
            title="Thăm khám và theo dõi sức khỏe người cao tuổi"
            description="Các hoạt động khám, tư vấn và chăm sóc sức khỏe giúp người cao tuổi được quan tâm, theo dõi tình trạng sức khỏe và phát hiện sớm những vấn đề cần được thăm khám chuyên sâu. Cán bộ y tế hướng dẫn chế độ sinh hoạt phù hợp, cách theo dõi bệnh và chủ động chăm sóc sức khỏe trong cuộc sống hằng ngày."
            image="/About/tham-kham-nguoi-gia2.jpg"
            imageAlt="Hoạt động thăm khám sức khỏe cho người cao tuổi"
            imageCaption="Thăm khám và tư vấn chăm sóc sức khỏe người cao tuổi"
            icon={<HealthAndSafetyOutlinedIcon />}
            reverse
            highlights={["Khám và tư vấn sức khỏe", "Theo dõi bệnh mạn tính", "Hướng dẫn chăm sóc tại nhà"]}
          />

          <AboutActivitySection
            number="03"
            eyebrow="Y TẾ HỌC ĐƯỜNG"
            title="Chăm sóc sức khỏe trẻ em và học sinh trên địa bàn"
            description="Trạm Y tế phối hợp với các trường học triển khai các hoạt động chăm sóc sức khỏe học đường, thăm khám và tư vấn sức khỏe cho học sinh. Qua đó góp phần theo dõi sự phát triển thể chất, nâng cao nhận thức về vệ sinh cá nhân, dinh dưỡng, phòng chống bệnh học đường và xây dựng môi trường học tập an toàn, lành mạnh."
            image="/About/tham-kham-truong-hoc1.jpg"
            imageAlt="Cán bộ y tế thăm khám sức khỏe cho học sinh"
            imageCaption="Hoạt động chăm sóc sức khỏe học sinh tại trường học"
            icon={<SchoolOutlinedIcon />}
            highlights={["Khám sức khỏe học sinh", "Truyền thông y tế học đường", "Chăm sóc sức khỏe trẻ em"]}
          />

          <AboutActivitySection
            number="04"
            eyebrow="VÌ SỨC KHỎE CỘNG ĐỒNG"
            title="Hiến máu tình nguyện – Trao giọt máu, gửi yêu thương"
            description="Hiến máu tình nguyện là nghĩa cử cao đẹp, thể hiện tinh thần trách nhiệm và sự sẻ chia đối với những người bệnh cần được truyền máu. Trạm Y tế cùng cán bộ và người dân hưởng ứng, tham gia các hoạt động hiến máu nhân đạo, góp phần lan tỏa thông điệp sống nhân ái và chung tay vì sức khỏe cộng đồng."
            image="/About/hien-mau1.jpg"
            imageAlt="Hoạt động hiến máu tình nguyện"
            imageCaption="Lan tỏa tinh thần nhân ái qua hoạt động hiến máu tình nguyện"
            icon={<VolunteerActivismOutlinedIcon />}
            reverse
            highlights={["Hiến máu nhân đạo", "Chung tay vì cộng đồng", "Lan tỏa tinh thần sẻ chia"]}
          />
        </Stack>

        <Card sx={{ mt: { xs: 4, md: 6 }, borderRadius: 4, overflow: "hidden", background: "linear-gradient(120deg, #075B53 0%, #087C70 60%, #2C9B7B 100%)", color: "#FFFFFF" }}>
          <CardContent sx={{ p: { xs: 2.75, sm: 3.5, md: 5 }, "&:last-child": { pb: { xs: 2.75, sm: 3.5, md: 5 } } }}>
            <Typography sx={{ color: "#C9F29C", fontSize: 12, fontWeight: 800, letterSpacing: 1 }}>
              VÌ MỘT CỘNG ĐỒNG KHỎE MẠNH
            </Typography>
            <Typography component="h2" sx={{ mt: 1.25, fontWeight: 900, fontSize: { xs: 22, sm: 27, md: 31 }, lineHeight: 1.4 }}>
              Sức khỏe của người dân là sự quan tâm hàng đầu
            </Typography>
            <Typography sx={{ mt: 1.5, maxWidth: 720, color: "rgba(255,255,255,0.83)", fontSize: 14, lineHeight: 1.9 }}>
              Trạm Y tế xã Tuyên Sơn tiếp tục hướng đến những hoạt động thiết thực, gần gũi và phù hợp với nhu cầu chăm sóc sức khỏe của người dân trên địa bàn.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 3 }}>
              <Button component={NextLink} href="/announcements" variant="contained" sx={{ bgcolor: "#C9F29C", color: "#075B53", px: 2.5, py: 1.2, fontWeight: 800, textTransform: "none", "&:hover": { bgcolor: "#B8E987" } }}>
                Xem hoạt động mới
              </Button>
              <Button component={NextLink} href="/facilities" variant="outlined" sx={{ color: "#FFFFFF", borderColor: "rgba(255,255,255,0.6)", px: 2.5, py: 1.2, fontWeight: 700, textTransform: "none", "&:hover": { borderColor: "#FFFFFF", bgcolor: "rgba(255,255,255,0.08)" } }}>
                Các cơ sở y tế
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
