"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Alert, Box, Button, CircularProgress, Paper, Stack, TextField, Typography } from "@mui/material";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import { createClient } from "@/lib/supabase/client";

export default function ChangePasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [role, setRole] = useState<"ADMIN" | "MANAGER" | "STAFF">("STAFF");

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" }).then(async (r) => { const body = await r.json(); if (!r.ok) throw new Error("Vui lòng đăng nhập trước."); return body; }).then((body) => { setRole(body.profile.role); }).catch(() => router.replace("/login")).finally(() => setChecking(false));
  }, [router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    if (password.length < 10) { setError("Mật khẩu mới phải có ít nhất 10 ký tự."); return; }
    if (password !== confirm) { setError("Mật khẩu xác nhận không khớp."); return; }
    setLoading(true);
    try {
      const response = await fetch("/api/auth/change-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ newPassword: password }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message || "Không thể đổi mật khẩu.");
      await createClient().auth.refreshSession();
      router.replace(role === "ADMIN" ? "/admin" : "/staff");
      router.refresh();
    } catch (err) { setError(err instanceof Error ? err.message : "Không thể đổi mật khẩu."); }
    finally { setLoading(false); }
  }

  if (checking) return <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}><CircularProgress /></Box>;
  return <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", px: 2, py: 5, bgcolor: "#F5F8F7" }}><Paper sx={{ width: "100%", maxWidth: 460, p: { xs: 3, sm: 4 }, borderRadius: 4 }}><Stack spacing={2.5} alignItems="center"><Box sx={{ width: 56, height: 56, borderRadius: 3, bgcolor: "primary.light", color: "primary.main", display: "grid", placeItems: "center" }}><LockResetOutlinedIcon sx={{ fontSize: 30 }} /></Box><Box textAlign="center"><Typography variant="h5" fontWeight={900}>Đổi mật khẩu</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .75 }}>Tài khoản của bạn cần đặt mật khẩu mới trước khi tiếp tục làm việc.</Typography></Box></Stack>{error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}<Box component="form" onSubmit={submit} sx={{ mt: 3 }}><Stack spacing={2}><TextField label="Mật khẩu mới" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required fullWidth /><TextField label="Nhập lại mật khẩu mới" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" required fullWidth /><Button type="submit" variant="contained" size="large" disabled={loading}>{loading ? <CircularProgress size={22} color="inherit" /> : "Xác nhận đổi mật khẩu"}</Button></Stack></Box></Paper></Box>;
}
