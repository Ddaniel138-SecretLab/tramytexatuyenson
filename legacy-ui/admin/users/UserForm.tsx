"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

export default function UserForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [staffId, setStaffId] = useState("");
  const [canPostAnnouncement, setCanPostAnnouncement] = useState(false);

  const [notice, setNotice] = useState<{
    type: "info" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(null);

    if (password.length < 8) {
      setNotice({
        type: "error",
        message: "Mật khẩu phải có ít nhất 8 ký tự.",
      });
      return;
    }

    if (password !== confirmPassword) {
      setNotice({
        type: "error",
        message: "Mật khẩu xác nhận không khớp.",
      });
      return;
    }

    setNotice({
      type: "info",
      message:
        "Giao diện chưa kết nối API. Tài khoản chưa được tạo và thông tin chưa được lưu.",
    });
  };

  return (
    <Stack spacing={3}>
      {/* Heading */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            sx={{ fontSize: { xs: 21, sm: 24 }, fontWeight: 800 }}
          >
            Tạo tài khoản nhân viên
          </Typography>

          <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>
            Cấp tài khoản đăng nhập và thiết lập quyền cho cán bộ.
          </Typography>
        </Box>

        <Button
          component={Link}
          href="/admin/users"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{
            alignSelf: { xs: "flex-start", sm: "auto" },
            textTransform: "none",
          }}
        >
          Quay lại
        </Button>
      </Stack>

      {notice && (
        <Alert severity={notice.type}>{notice.message}</Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          {/* Login information */}
          <Card
            sx={{
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Stack spacing={1} sx={{ mb: 2.5, flexDirection: "row", alignItems: "center" }}>
                <LockOutlinedIcon color="primary" />
                <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
                  Thông tin đăng nhập
                </Typography>
              </Stack>

              <Stack spacing={2}>
                <TextField
                  fullWidth
                  required
                  type="email"
                  label="Email đăng nhập"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="off"
                />

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, minmax(0, 1fr))",
                    },
                    gap: 2,
                  }}
                >
                  <TextField
                    fullWidth
                    required
                    type="password"
                    label="Mật khẩu khởi tạo"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="new-password"
                    helperText="Tối thiểu 8 ký tự."
                  />

                  <TextField
                    fullWidth
                    required
                    type="password"
                    label="Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    autoComplete="new-password"
                  />
                </Box>

                <Alert severity="info">
                  Mật khẩu chỉ dùng để khởi tạo tài khoản. Không lưu mật khẩu
                  dạng văn bản vào nhật ký hoạt động.
                </Alert>
              </Stack>
            </CardContent>
          </Card>

          {/* Staff profile */}
          <Card
            sx={{
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Stack spacing={1} sx={{ mb: 2.5, flexDirection: "row", alignItems: "center" }}>
                <PersonOutlinedIcon color="primary" />
                <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
                  Liên kết hồ sơ cán bộ
                </Typography>
              </Stack>

              <FormControl fullWidth>
                <InputLabel id="user-staff-label">
                  Hồ sơ cán bộ
                </InputLabel>

                <Select
                  labelId="user-staff-label"
                  value={staffId}
                  label="Hồ sơ cán bộ"
                  onChange={(event) => setStaffId(event.target.value)}
                >
                  <MenuItem value="">
                    Không liên kết hồ sơ
                  </MenuItem>
                </Select>

                <FormHelperText>
                  Danh sách hồ sơ cán bộ sẽ được tải từ Supabase khi kết nối
                  API. Một hồ sơ chỉ được liên kết với tối đa một tài khoản.
                </FormHelperText>
              </FormControl>
            </CardContent>
          </Card>

          {/* Permissions */}
          <Card
            sx={{
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography sx={{ mb: 2, fontSize: 16, fontWeight: 700 }}>
                Vai trò và quyền hạn
              </Typography>

              <Stack spacing={2}>
                <Box>
                  <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                    Vai trò tài khoản
                  </Typography>

                  <Box
                    sx={{
                      mt: 1,
                      display: "inline-flex",
                      alignItems: "center",
                      px: 1.5,
                      py: 0.75,
                      borderRadius: 2,
                      bgcolor: "primary.light",
                      color: "primary.dark",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    STAFF
                  </Box>

                  <FormHelperText>
                    Tài khoản được tạo từ trang này luôn có vai trò STAFF.
                  </FormHelperText>
                </Box>

                <Box
                  sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={canPostAnnouncement}
                        onChange={(event) =>
                          setCanPostAnnouncement(event.target.checked)
                        }
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                        Cho phép đăng thông báo
                      </Typography>
                    }
                    sx={{ ml: 0 }}
                  />

                  <Typography
                    sx={{
                      ml: { xs: 0, sm: 5 },
                      mt: { xs: 0.5, sm: -0.5 },
                      fontSize: 12,
                      color: "text.secondary",
                    }}
                  >
                    Khi bật, nhân viên được phép sử dụng chức năng đăng thông
                    báo theo chính sách phân quyền của hệ thống.
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Actions */}
          <Stack
            direction={{ xs: "column-reverse", sm: "row" }}
            sx={{
              justifyContent: "flex-end",
              gap: 1.5,
            }}
          >
            <Button
              component={Link}
              href="/admin/users"
              variant="outlined"
              color="inherit"
              sx={{ textTransform: "none" }}
            >
              Hủy
            </Button>

            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveOutlinedIcon />}
              sx={{ textTransform: "none", fontWeight: 700 }}
            >
              Tạo tài khoản
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}