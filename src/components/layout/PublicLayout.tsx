"use client";

import { useState } from "react";
import NextLink from "@/components/shared/NextLink";
import { usePathname } from "next/navigation";
import { AppBar, Box, Button, Container, Drawer, IconButton, List, ListItemButton, ListItemText, Stack, Toolbar, Typography } from "@mui/material";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const nav = [
  { label: "Trang chủ", href: "/" },
  { label: "Giới thiệu", href: "/about" },
  { label: "Cơ sở", href: "/facilities" },
  { label: "Đội ngũ cán bộ", href: "/public-staff" },
  { label: "Thông báo", href: "/announcements" },
  { label: "Liên hệ", href: "/contact" },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff", display: "flex", flexDirection: "column" }}>
      <AppBar position="sticky" elevation={0} color="inherit" sx={{ borderBottom: "1px solid", borderColor: "divider", bgcolor: "rgba(255,255,255,.94)", backdropFilter: "blur(14px)" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 66, md: 76 }, gap: 2 }}>
            <Stack direction="row" spacing={1.2} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ width: 44, height: 44, borderRadius: 3, bgcolor: "primary.light", color: "primary.main", display: "grid", placeItems: "center", boxShadow: "inset 0 0 0 1px rgba(8,124,112,.08)" }}><LocalHospitalOutlinedIcon /></Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 800, color: "primary.dark", lineHeight: 1.2, letterSpacing: "-.02em" }}>TRẠM Y TẾ</Typography>
                <Typography variant="caption" color="text.secondary">Xã Tuyên Sơn</Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={0.3} sx={{ display: { xs: "none", lg: "flex" }, alignItems: "center" }}>
              {nav.map((item) => <Button key={item.href} component={NextLink} href={item.href} color={pathname === item.href ? "primary" : "inherit"} sx={{ px: 1.4, py: 1, borderRadius: 2.5, whiteSpace: "nowrap", fontWeight: pathname === item.href ? 800 : 600, color: pathname === item.href ? "primary.dark" : "text.secondary", bgcolor: pathname === item.href ? "primary.light" : "transparent", "&:hover": { bgcolor: "primary.light", color: "primary.dark" } }}>{item.label}</Button>)}
            </Stack>
            <IconButton aria-label="Mở menu" onClick={() => setOpen(true)} sx={{ display: { xs: "inline-flex", lg: "none" } }}><MenuOutlinedIcon /></IconButton>
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { width: 320, p: 2.25, borderRadius: "18px 0 0 18px" } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 1, py: 1 }}><Typography fontWeight={800}>Điều hướng</Typography><IconButton onClick={() => setOpen(false)}><CloseOutlinedIcon /></IconButton></Stack>
        <List sx={{ mt: 1 }}>{nav.map((item) => <ListItemButton key={item.href} component={NextLink} href={item.href} selected={pathname === item.href} onClick={() => setOpen(false)} sx={{ borderRadius: 2.5, mb: .5, py: 1.25, "&.Mui-selected": { bgcolor: "primary.light", color: "primary.dark" } }}><ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: pathname === item.href ? 800 : 600, fontSize: 14 }} /></ListItemButton>)}</List>
      </Drawer>
      <Box component="main" sx={{ flex: 1 }}>{children}</Box>
      <Box component="footer" sx={{ bgcolor: "#073F39", color: "#EAF5F0", pt: { xs: 4, md: 5 }, pb: 3, mt: 4 }}>
        <Container maxWidth="xl">
          <Stack direction={{ xs: "column", md: "row" }} spacing={3} justifyContent="space-between">
            <Box><Typography fontWeight={900} sx={{ letterSpacing: .5 }}>TRẠM Y TẾ XÃ TUYÊN SƠN</Typography><Typography variant="body2" sx={{ mt: 1, maxWidth: 440, color: "rgba(255,255,255,.75)", lineHeight: 1.8 }}>Cổng thông tin y tế cộng đồng, cập nhật thông tin chăm sóc sức khỏe, lịch khám và hoạt động y tế tại địa phương.</Typography></Box>
            <Box><Typography fontWeight={800}>Liên hệ</Typography><Typography variant="body2" sx={{ mt: 1, color: "rgba(255,255,255,.75)" }}>Địa chỉ: Xã Tuyên Sơn</Typography><Typography variant="body2" sx={{ color: "rgba(255,255,255,.75)" }}>Điện thoại: Cập nhật tại trạm y tế</Typography></Box>
          </Stack>
          <Typography variant="caption" sx={{ display: "block", mt: 4, pt: 2, borderTop: "1px solid rgba(255,255,255,.15)", color: "rgba(255,255,255,.6)" }}>© 2026 Trạm Y tế xã Tuyên Sơn.</Typography>
        </Container>
      </Box>
    </Box>
  );
}
