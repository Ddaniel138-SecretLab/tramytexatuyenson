"use client";

import { useState, type FormEvent } from "react";
import NextLink from "@/components/shared/NextLink";
import { useRouter } from "next/navigation";
import { Alert, Box, Button, CircularProgress, Paper, Stack, TextField, Typography } from "@mui/material";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setLoading(true);
    try {
      const supabase = createClient();
      const { error: loginError } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
      if (loginError) throw new Error("Email hoặc mật khẩu không chính xác.");
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message || "Tài khoản chưa được cấp quyền.");
      router.replace(body.profile.must_change_password ? "/change-password" : body.profile.role === "ADMIN" ? "/admin" : "/staff");
      router.refresh();
    } catch (err) { setError(err instanceof Error ? err.message : "Không thể đăng nhập."); }
    finally { setLoading(false); }
  }

  return <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", px: 2, py: 5, background: "linear-gradient(135deg,#EAF5F0,#F5F8F7 55%,#E8F3EF)" }}>
    <Paper sx={{ width: "100%", maxWidth: 440, p: { xs: 3, sm: 4 }, borderRadius: 4 }}>
      <Stack alignItems="center" spacing={1.5} sx={{ mb: 3 }}><Box sx={{ width: 58, height: 58, borderRadius: 3, bgcolor: "primary.light", color: "primary.main", display: "grid", placeItems: "center" }}><LocalHospitalOutlinedIcon sx={{ fontSize: 32 }} /></Box><Typography variant="h5" fontWeight={900} textAlign="center" color="primary.dark">Trạm Y tế xã Tuyên Sơn</Typography><Typography color="text.secondary" textAlign="center">Đăng nhập hệ thống quản lý</Typography></Stack>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={submit}><Stack spacing={2}><TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required fullWidth /><TextField label="Mật khẩu" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required fullWidth /><Button type="submit" variant="contained" size="large" disabled={loading}>{loading ? <CircularProgress size={22} color="inherit" /> : "Đăng nhập"}</Button></Stack></Box>
      <Typography variant="caption" color="text.secondary" textAlign="center" display="block" sx={{ mt: 2, lineHeight: 1.8 }}>Tài khoản cán bộ do quản trị viên cấp. Khi quên mật khẩu, vui lòng liên hệ quản trị viên để được cấp mật khẩu tạm.</Typography>
      <Button component={NextLink} href="/" fullWidth sx={{ mt: 1.5 }}>Quay lại trang chủ</Button>
    </Paper>
  </Box>;
}
