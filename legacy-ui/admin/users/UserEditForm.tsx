
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
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

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

interface UserEditFormProps {
  userId: string;
}

export default function UserEditForm({ userId = "" }: UserEditFormProps) {
  const [role, setRole] = useState<"STAFF" | "ADMIN">("STAFF");
  const [staffId, setStaffId] = useState("");
  const [canPostAnnouncement, setCanPostAnnouncement] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [notice, setNotice] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setNotice(
      "Giao diện đã sẵn sàng. Chức năng lưu thay đổi sẽ được kết nối API sau.",
    );
  };

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{ justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" }, gap: 2 }}
      >
        <Box>
          <Typography
            sx={{ fontSize: { xs: 20, sm: 24 }, fontWeight: 800 }}
          >
            Chỉnh sửa tài khoản
          </Typography>

          <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>
            Cập nhật vai trò, quyền hạn và trạng thái tài khoản.
          </Typography>
        </Box>

        <Button
          component={Link}
          href={`/admin/users/${userId}`}
          variant="outlined"
          color="inherit"
          startIcon={<ArrowBackOutlinedIcon />}
          sx={{ alignSelf: { xs: "flex-start", sm: "auto" } }}
        >
          Quay lại
        </Button>
      </Stack>

      {notice && <Alert severity="info">{notice}</Alert>}

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          <Card
            sx={{
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
                Thông tin tài khoản
              </Typography>

              <Typography
                sx={{ mt: 0.5, mb: 2.5, fontSize: 12, color: "text.secondary" }}
              >
                Email đăng nhập và mật khẩu được quản lý riêng bởi hệ thống xác
                thực.
              </Typography>

              <Stack spacing={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Mã tài khoản"
                  value={userId ?? ""}
                  disabled
                />

                <TextField
                  fullWidth
                  size="small"
                  label="Email đăng nhập"
                  value="—"
                  disabled
                  helperText="Email sẽ được tải từ dữ liệu tài khoản khi kết nối API."
                />
              </Stack>
            </CardContent>
          </Card>

          <Card
            sx={{
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
                Vai trò và quyền hạn
              </Typography>

              <Typography
                sx={{ mt: 0.5, mb: 2.5, fontSize: 12, color: "text.secondary" }}
              >
                Chỉ cấp quyền phù hợp với nhiệm vụ của từng tài khoản.
              </Typography>

              <Stack spacing={2.5}>
                <FormControl fullWidth size="small">
                  <InputLabel id="user-edit-role-label">Vai trò</InputLabel>
                  <Select
                    labelId="user-edit-role-label"
                    value={role}
                    label="Vai trò"
                    onChange={(event) =>
                      setRole(event.target.value as "STAFF" | "ADMIN")
                    }
                  >
                    <MenuItem value="STAFF">STAFF - Cán bộ</MenuItem>
                    <MenuItem value="ADMIN">ADMIN - Quản trị viên</MenuItem>
                  </Select>
                  <FormHelperText>
                    Tài khoản ADMIN có quyền quản lý hệ thống.
                  </FormHelperText>
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel id="user-edit-staff-label">
                    Hồ sơ cán bộ liên kết
                  </InputLabel>
                  <Select
                    labelId="user-edit-staff-label"
                    value={staffId}
                    label="Hồ sơ cán bộ liên kết"
                    onChange={(event) => setStaffId(event.target.value)}
                  >
                    <MenuItem value="">
                      <em>Không liên kết hồ sơ</em>
                    </MenuItem>
                    <MenuItem value="unavailable" disabled>
                      Danh sách cán bộ sẽ được tải từ API
                    </MenuItem>
                  </Select>
                  <FormHelperText>
                    Một tài khoản có thể không liên kết với hồ sơ cán bộ.
                  </FormHelperText>
                </FormControl>

                <Divider />

                <FormControlLabel
                  control={
                    <Switch
                      checked={canPostAnnouncement}
                      onChange={(event) =>
                        setCanPostAnnouncement(event.target.checked)
                      }
                      disabled={role === "ADMIN"}
                    />
                  }
                  label={
                    <Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                        Cho phép đăng thông báo
                      </Typography>
                      <Typography
                        sx={{ fontSize: 11, color: "text.secondary" }}
                      >
                        Cho phép tài khoản STAFF tạo và quản lý thông báo.
                      </Typography>
                    </Box>
                  }
                  sx={{ mx: 0, alignItems: "center" }}
                />
              </Stack>
            </CardContent>
          </Card>

          <Card
            sx={{
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
                Trạng thái tài khoản
              </Typography>

              <Typography
                sx={{ mt: 0.5, mb: 2, fontSize: 12, color: "text.secondary" }}
              >
                Tài khoản bị khóa sẽ không thể đăng nhập hệ thống.
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={isActive}
                    onChange={(event) => setIsActive(event.target.checked)}
                  />
                }
                label={
                  <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                      Tài khoản đang hoạt động
                    </Typography>
                    <Typography
                      sx={{ fontSize: 11, color: "text.secondary" }}
                    >
                      {isActive
                        ? "Tài khoản được phép đăng nhập."
                        : "Tài khoản sẽ bị vô hiệu hóa."}
                    </Typography>
                  </Box>
                }
                sx={{ mx: 0 }}
              />
            </CardContent>
          </Card>

          <Stack
            direction={{ xs: "column-reverse", sm: "row" }}
            spacing={1.5}
            sx={{ justifyContent: { xs: "flex-end", sm: "flex-end" } }}
          >
            <Button
              component={Link}
              href={`/admin/users/${userId}`}
              variant="outlined"
              color="inherit"
            >
              Hủy
            </Button>

            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveOutlinedIcon />}
            >
              Lưu thay đổi
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}
