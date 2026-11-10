"use client";

import { useEffect, useMemo, useState } from "react";
import NextLink from "@/components/shared/NextLink";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, Box, Button, CircularProgress, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Stack, Toolbar, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { createClient } from "@/lib/supabase/client";

type Role = "ADMIN" | "STAFF";
type AppUserRole = "ADMIN" | "MANAGER" | "STAFF";
type Props = { role: Role; children: React.ReactNode };
type MeResponse = { success: boolean; user: { id: string; email: string | null }; profile: { full_name: string; role: AppUserRole; facility_id: string | null; must_change_password: boolean; avatar_url?: string | null } };

const adminNav = [
  { label: "Tổng quan", href: "/admin", icon: DashboardOutlinedIcon },
  { label: "Thông báo", href: "/admin/announcements", icon: CampaignOutlinedIcon },
  { label: "Cán bộ", href: "/admin/staff", icon: GroupsOutlinedIcon },
  { label: "Cơ sở y tế", href: "/admin/facilities", icon: BusinessOutlinedIcon },
  { label: "Tài khoản", href: "/admin/users", icon: PersonOutlineOutlinedIcon },
  { label: "Lịch sử hoạt động", href: "/admin/audit-logs", icon: HistoryOutlinedIcon },
];
const staffNav = [
  { label: "Tổng quan", href: "/staff", icon: DashboardOutlinedIcon },
  { label: "Thông báo cơ sở", href: "/staff/announcements", icon: CampaignOutlinedIcon },
  { label: "Thông tin cá nhân", href: "/staff/profile", icon: PersonOutlineOutlinedIcon },
];

export default function PortalShell({ role, children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, setProfile] = useState<MeResponse["profile"] | null>(null);
  const [email, setEmail] = useState("");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const nav = role === "ADMIN" ? adminNav : staffNav;

  useEffect(() => {
    let alive = true;
    fetch("/api/auth/me", { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.message || "Phiên đăng nhập không hợp lệ.");
        return body as MeResponse;
      })
      .then((body) => {
        if (!alive) return;
        const roleAllowed = role === "ADMIN" ? body.profile.role === "ADMIN" : body.profile.role === "STAFF" || body.profile.role === "MANAGER";
        if (!roleAllowed) {
          router.replace(body.profile.role === "ADMIN" ? "/admin" : "/staff");
          return;
        }
        if (body.profile.must_change_password) {
          router.replace("/change-password");
          return;
        }
        setProfile(body.profile);
        setEmail(body.user.email ?? "");
        setReady(true);
      })
      .catch((err: Error) => {
        if (!alive) return;
        setError(err.message);
        router.replace("/login");
      });
    return () => { alive = false; };
  }, [role, router]);

  const title = useMemo(() => nav.find((item) => pathname === item.href || (item.href !== "/admin" && item.href !== "/staff" && pathname.startsWith(`${item.href}/`)))?.label ?? (role === "ADMIN" ? "Quản trị hệ thống" : profile?.role === "MANAGER" ? "Quản lý toàn trạm" : "Khu vực cán bộ"), [nav, pathname, role]);

  async function logout() {
    await createClient().auth.signOut();
    router.replace("/login");
  }

  const sidebar = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "#fff" }}>
      <Toolbar sx={{ minHeight: "76px !important", px: 2.5, gap: 1.3 }}>
        <Box sx={{ width: 42, height: 42, borderRadius: 3, bgcolor: "primary.light", color: "primary.main", display: "grid", placeItems: "center", fontWeight: 900, boxShadow: "inset 0 0 0 1px rgba(8,124,112,.08)" }}>TY</Box>
        <Box><Typography fontWeight={900} color="primary.dark" lineHeight={1.15}>TRẠM Y TẾ</Typography><Typography variant="caption" color="text.secondary">Xã Tuyên Sơn · {profile?.role ?? role}</Typography></Box>
      </Toolbar>
      <Divider />
      <Box sx={{ px: 2, pt: 2, pb: 1 }}><Typography variant="overline" color="text.secondary" fontWeight={800}>MENU CHÍNH</Typography></Box>
      <List sx={{ px: 1.5, pt: 0, flex: 1 }}>
        {nav.map((item) => {
          const Icon = item.icon;
          const active = item.href === `/${role.toLowerCase()}` ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return <ListItemButton key={item.href} component={NextLink} href={item.href} selected={active} onClick={() => setMobileOpen(false)} sx={{ mb: .65, borderRadius: 2.5, py: 1.25, color: active ? "primary.dark" : "text.secondary", "&.Mui-selected": { bgcolor: "primary.light" }, "&.Mui-selected:hover": { bgcolor: "#D9EEE8" } }}>
            <ListItemIcon sx={{ minWidth: 38, color: "inherit" }}><Icon fontSize="small" /></ListItemIcon><ListItemText primary={item.label} slotProps={{ primary: { sx: { fontSize: 13, fontWeight: active ? 800 : 600 } } }} />
          </ListItemButton>;
        })}
      </List>
      <Divider />
      <Box sx={{ px: 2, py: 2 }}><Button fullWidth color="inherit" startIcon={<LogoutOutlinedIcon />} onClick={logout} sx={{ justifyContent: "flex-start", color: "text.secondary" }}>Đăng xuất</Button></Box>
    </Box>
  );

  if (!ready) return <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 3 }}><Stack alignItems="center" spacing={2}><CircularProgress />{error && <Typography color="error" variant="body2">{error}</Typography>}</Stack></Box>;

  return <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "#F5F8F7" }}>
    {desktop ? <Box component="aside" sx={{ width: 260, flexShrink: 0 }}><Box sx={{ position: "fixed", width: 260, height: "100vh", borderRight: "1px solid", borderColor: "divider", boxShadow: "4px 0 24px rgba(22,66,55,.025)" }}>{sidebar}</Box></Box> : <Drawer anchor="left" open={mobileOpen} onClose={() => setMobileOpen(false)} PaperProps={{ sx: { width: 280 } }}>{sidebar}</Drawer>}
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Box component="header" sx={{ position: "sticky", top: 0, zIndex: 10, height: { xs: 64, sm: 72 }, px: { xs: 1.5, sm: 3 }, bgcolor: "rgba(255,255,255,.94)", backdropFilter: "blur(14px)", borderBottom: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
          {!desktop && <IconButton onClick={() => setMobileOpen(true)} aria-label="Mở điều hướng"><MenuOutlinedIcon /></IconButton>}
          <Box sx={{ minWidth: 0 }}><Typography fontWeight={800} sx={{ fontSize: { xs: 16, sm: 19 }, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</Typography><Typography variant="caption" color="text.secondary" sx={{ display: { xs: "none", sm: "block" } }}>Hệ thống quản lý Trạm Y tế xã Tuyên Sơn</Typography></Box>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ minWidth: 0 }}><Avatar src={profile?.avatar_url ?? undefined} sx={{ width: 38, height: 38, bgcolor: "primary.main", fontSize: 14, fontWeight: 700 }}>{profile?.full_name?.slice(0,1) ?? "U"}</Avatar><Box sx={{ display: { xs: "none", sm: "block" }, minWidth: 0 }}><Typography variant="body2" fontWeight={700} noWrap>{profile?.full_name}</Typography><Typography variant="caption" color="text.secondary" noWrap>{email}</Typography></Box></Stack>
      </Box>
      <Box component="main" sx={{ width: "100%", maxWidth: 1600, mx: "auto", p: { xs: 2, sm: 3, md: 3.5, lg: 4 } }}>{children}</Box>
    </Box>
  </Box>;
}
