
"use client";

import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

import { apiRequest } from "@/lib/api-client";
import { uploadProfileAvatar } from "@/lib/storage/uploads";

import {
  adminFieldSx,
  AdminFormSection,
  AdminPageHeader,
} from "@/components/admin/ui";

type ProfileData = {
  id: string;
  role: "STAFF" | "MANAGER";
  full_name: string;
  phone: string | null;
  position: string | null;
  avatar_url: string | null;
  facility?: { name: string } | null;
  email: string | null;
};

export default function StaffProfilePage() {
  const fileRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<ProfileData | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    position: "",
    avatarUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/staff/profile", { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json();

        if (!response.ok) {
          throw new Error(
            body.message || "Không thể tải thông tin cá nhân.",
          );
        }

        return body.data as ProfileData;
      })
      .then((data) => {
        setProfile(data);

        setForm({
          fullName: data.full_name,
          phone: data.phone ?? "",
          position: data.position ?? "",
          avatarUrl: data.avatar_url ?? "",
        });
      })
      .catch((cause: Error) => {
        setError(cause.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function uploadAvatar(file?: File) {
    if (!file) return;

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const avatarUrl = await uploadProfileAvatar(file);

      const result = await apiRequest<{ data: ProfileData }>(
        "/api/staff/profile",
        {
          method: "PATCH",
          body: JSON.stringify({ avatarUrl }),
        },
      );

      setProfile(result.data);

      setForm((current) => ({
        ...current,
        avatarUrl,
      }));

      setMessage("Đã cập nhật ảnh đại diện.");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Không thể tải ảnh đại diện.",
      );
    } finally {
      setUploading(false);

      if (fileRef.current) {
        fileRef.current.value = "";
      }
    }
  }

  async function save() {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const result = await apiRequest<{ data: ProfileData }>(
        "/api/staff/profile",
        {
          method: "PATCH",
          body: JSON.stringify(form),
        },
      );

      setProfile(result.data);
      setMessage("Đã cập nhật thông tin cá nhân.");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Không thể lưu hồ sơ.",
      );
    } finally {
      setSaving(false);
    }
  }

  const avatarInitial =
    form.fullName.trim().slice(0, 1).toUpperCase() || "?";

  return (
    <Stack spacing={{ xs: 2, sm: 2.5 }}>
      <AdminPageHeader
        eyebrow="TÀI KHOẢN CÁ NHÂN"
        title="Thông tin cá nhân"
        description="Quản lý thông tin liên hệ, chức vụ và ảnh đại diện của bạn. Vai trò và cơ sở công tác do ADMIN quản lý."
      />

      {error && (
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {message && (
        <Alert severity="success" onClose={() => setMessage("")}>
          {message}
        </Alert>
      )}

      {loading ? (
        <Card
          sx={{
            borderRadius: 3,
            border: "1px solid #E7EEE9",
            boxShadow: "0 3px 16px rgba(25,65,45,.035)",
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
            <Typography color="text.secondary">
              Đang tải hồ sơ...
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2.25}>
          {/* Ảnh đại diện */}
          <AdminFormSection
            title="Ảnh đại diện"
            description="Ảnh đại diện giúp người dân nhận diện cán bộ trên trang thông tin của Trạm Y tế."
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "stretch", sm: "center" }}
              spacing={2.5}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", sm: "flex-start" },
                  flexShrink: 0,
                }}
              >
                <Avatar
                  src={form.avatarUrl || undefined}
                  alt={form.fullName}
                  sx={{
                    width: { xs: 104, sm: 112 },
                    height: { xs: 104, sm: 112 },
                    bgcolor: "#E3F2EC",
                    color: "#087C70",
                    fontSize: 36,
                    fontWeight: 800,
                    border: "4px solid #F0F7F3",
                    boxShadow: "0 2px 10px rgba(15,55,47,.08)",
                  }}
                >
                  {avatarInitial}
                </Avatar>
              </Box>

              <Stack
                spacing={1}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  alignItems: {
                    xs: "center",
                    sm: "flex-start",
                  },
                  textAlign: {
                    xs: "center",
                    sm: "left",
                  },
                }}
              >
                <Typography
                  fontWeight={800}
                  sx={{
                    color: "#183F36",
                    fontSize: 16,
                    overflowWrap: "anywhere",
                  }}
                >
                  {profile?.full_name}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ overflowWrap: "anywhere" }}
                >
                  {profile?.email}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ lineHeight: 1.7 }}
                >
                  Hỗ trợ định dạng JPEG, PNG, WebP. Kích thước tối đa 5 MB.
                </Typography>
              </Stack>

              <Box
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  flexShrink: 0,
                }}
              >
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<PhotoCameraOutlinedIcon />}
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  sx={{
                    minHeight: 44,
                    minWidth: { sm: 170 },
                    px: 2,
                    borderRadius: 2.5,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  {uploading ? "Đang tải ảnh..." : "Đổi ảnh đại diện"}
                </Button>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  hidden
                  onChange={(event) =>
                    uploadAvatar(event.target.files?.[0])
                  }
                />
              </Box>
            </Stack>
          </AdminFormSection>

          {/* Thông tin cá nhân */}
          <AdminFormSection
            title="Thông tin cá nhân"
            description="Cập nhật thông tin liên hệ và chức vụ đang đảm nhiệm."
          >
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  required
                  label="Họ và tên"
                  value={form.fullName}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      fullName: event.target.value,
                    })
                  }
                  sx={adminFieldSx}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  placeholder="Nhập số điện thoại liên hệ"
                  value={form.phone}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      phone: event.target.value,
                    })
                  }
                  sx={adminFieldSx}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Chức vụ"
                  placeholder="Nhập chức vụ hiện tại"
                  value={form.position}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      position: event.target.value,
                    })
                  }
                  sx={adminFieldSx}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Cơ sở công tác"
                  value={
                    profile?.facility?.name ??
                    "Chưa được phân công"
                  }
                  disabled
                  sx={{
                    ...adminFieldSx,
                    "& .MuiOutlinedInput-root": {
                      ...adminFieldSx["& .MuiOutlinedInput-root"],
                      bgcolor: "#F4F7F5",
                    },
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#52675E",
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Alert
              severity="info"
              icon={<PersonOutlineOutlinedIcon />}
              sx={{
                mt: 2.25,
                borderRadius: 2,
                alignItems: "center",
                "& .MuiAlert-message": {
                  fontSize: 13,
                  lineHeight: 1.7,
                },
              }}
            >
              Vai trò tài khoản và cơ sở công tác được quản lý bởi ADMIN.
              Bạn chỉ có thể tự cập nhật thông tin cá nhân và ảnh đại diện.
            </Alert>
          </AdminFormSection>

          {/* Nút lưu */}
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid #E7EEE9",
              boxShadow: "0 3px 16px rgba(25,65,45,.035)",
            }}
          >
            <CardContent
              sx={{
                px: { xs: 2, sm: 2.5 },
                py: 2,
                "&:last-child": { pb: 2 },
              }}
            >
              <Stack
                direction={{ xs: "column-reverse", sm: "row" }}
                alignItems={{ xs: "stretch", sm: "center" }}
                justifyContent="space-between"
                spacing={1.5}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6 }}
                >
                  Kiểm tra thông tin trước khi lưu thay đổi.
                </Typography>

                <Button
                  variant="contained"
                  startIcon={<SaveOutlinedIcon />}
                  onClick={save}
                  disabled={saving || uploading}
                  fullWidth
                  sx={{
                    minHeight: 46,
                    width: { xs: "100%", sm: "auto" },
                    minWidth: { sm: 170 },
                    px: 3,
                    borderRadius: 2.5,
                    fontWeight: 800,
                  }}
                >
                  {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      )}
    </Stack>
  );
}
