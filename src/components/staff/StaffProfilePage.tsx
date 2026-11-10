"use client";

import { useEffect, useRef, useState } from "react";
import { Alert, Avatar, Box, Button, Card, CardContent, Grid, Stack, TextField, Typography } from "@mui/material";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import { apiRequest } from "@/lib/api-client";
import { uploadProfileAvatar } from "@/lib/storage/uploads";

type ProfileData = { id: string; role: "STAFF" | "MANAGER"; full_name: string; phone: string | null; position: string | null; avatar_url: string | null; facility?: { name: string } | null; email: string | null };

export default function StaffProfilePage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [form, setForm] = useState({ fullName: "", phone: "", position: "", avatarUrl: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/staff/profile", { cache: "no-store" })
      .then(async (r) => { const body = await r.json(); if (!r.ok) throw new Error(body.message); return body.data as ProfileData; })
      .then((data) => { setProfile(data); setForm({ fullName: data.full_name, phone: data.phone ?? "", position: data.position ?? "", avatarUrl: data.avatar_url ?? "" }); })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function uploadAvatar(file?: File) {
    if (!file) return;
    setUploading(true); setError(""); setMessage("");
    try {
      const avatarUrl = await uploadProfileAvatar(file);
      const result = await apiRequest<{ data: ProfileData }>("/api/staff/profile", { method: "PATCH", body: JSON.stringify({ avatarUrl }) });
      setProfile(result.data); setForm((current) => ({ ...current, avatarUrl })); setMessage("Đã cập nhật ảnh đại diện.");
    } catch (e) { setError(e instanceof Error ? e.message : "Không thể tải ảnh đại diện."); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  }

  async function save() {
    setSaving(true); setError(""); setMessage("");
    try {
      const result = await apiRequest<{ data: ProfileData }>("/api/staff/profile", { method: "PATCH", body: JSON.stringify(form) });
      setProfile(result.data); setMessage("Đã cập nhật thông tin cá nhân.");
    } catch (e) { setError(e instanceof Error ? e.message : "Không thể lưu hồ sơ."); }
    finally { setSaving(false); }
  }

  return (
    <Stack spacing={2.5}>
      <Box><Typography variant="h5" fontWeight={900}>Thông tin cá nhân</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>Cập nhật thông tin liên hệ, chức vụ và ảnh đại diện. Vai trò và cơ sở công tác do ADMIN quản lý.</Typography></Box>
      {error && <Alert severity="error">{error}</Alert>}{message && <Alert severity="success" onClose={() => setMessage("")}>{message}</Alert>}
      <Card><CardContent sx={{ p: { xs: 2, sm: 3.5 } }}>
        {loading ? <Typography color="text.secondary">Đang tải hồ sơ...</Typography> : (
          <Stack spacing={3}>
            <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "flex-start", sm: "center" }} spacing={2.25}>
              <Avatar src={form.avatarUrl || undefined} sx={{ width: 88, height: 88, bgcolor: "primary.light", color: "primary.dark", fontSize: 30, fontWeight: 800 }}>{form.fullName.slice(0, 1)}</Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}><Typography fontWeight={800} fontSize={17}>{profile?.full_name}</Typography><Typography variant="body2" color="text.secondary">{profile?.email}</Typography><Typography variant="caption" color="text.secondary" display="block" sx={{ mt: .5 }}>Ảnh JPEG, PNG hoặc WebP · Tối đa 5 MB</Typography></Box>
              <Button variant="outlined" startIcon={<PhotoCameraOutlinedIcon />} onClick={() => fileRef.current?.click()} disabled={uploading}>{uploading ? "Đang tải ảnh..." : "Đổi ảnh đại diện"}</Button>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(event) => uploadAvatar(event.target.files?.[0])} />
            </Stack>
            <Grid container spacing={2.25}>
              <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth required label="Họ và tên" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></Grid>
              <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Số điện thoại" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Grid>
              <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Chức vụ" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} /></Grid>
              <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Cơ sở công tác" value={profile?.role === "MANAGER" ? "Toàn trạm (cả hai điểm)" : profile?.facility?.name ?? "Chưa được phân công"} disabled /></Grid>
            </Grid>
            <Box><Button variant="contained" onClick={save} disabled={saving}>{saving ? "Đang lưu..." : "Lưu thay đổi"}</Button></Box>
          </Stack>
        )}
      </CardContent></Card>
    </Stack>
  );
}
