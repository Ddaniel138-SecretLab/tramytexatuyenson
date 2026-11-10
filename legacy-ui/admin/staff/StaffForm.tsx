/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Link from "next/link";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
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
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import DeleteIcon from '@mui/icons-material/Delete';

interface StaffFormProps {
  mode: "create" | "edit";
  staffId?: string;
}

export default function StaffForm({ mode, staffId }: StaffFormProps) {
  const isEdit = mode === "edit";

  const [fullName, setFullName] = useState("");
  const [position, setPosition] = useState("");
  const [facilityId, setFacilityId] = useState("");
  const [phone, setPhone] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [notice, setNotice] = useState("");

  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Tạo và thu hồi URL xem trước ảnh.
  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(avatarFile);
    setAvatarPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [avatarFile]);

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setNotice("Vui lòng chọn ảnh JPG, PNG hoặc WebP.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setNotice("Ảnh đại diện không được vượt quá 2MB.");
      event.target.value = "";
      return;
    }

    setNotice("");
    setAvatarFile(file);
  };

  // Xóa ảnh đã chọn để có thể chọn ảnh khác.
  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview("");
    setNotice("");

    if (avatarInputRef.current) {
      avatarInputRef.current.value = "";
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setNotice(
      "Giao diện hiện chưa kết nối API. Thông tin chưa được lưu vào hệ thống.",
    );
  };

  return (
    <Stack spacing={3}>
      {/* Page heading */}
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
            {isEdit ? "Chỉnh sửa hồ sơ cán bộ" : "Thêm cán bộ mới"}
          </Typography>

          <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>
            {isEdit
              ? `Cập nhật thông tin hồ sơ${staffId ? ` #${staffId}` : ""}.`
              : "Nhập thông tin để tạo hồ sơ cán bộ mới."}
          </Typography>
        </Box>

        <Button
          component={Link}
          href="/admin/staff"
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

      {notice && <Alert severity="info">{notice}</Alert>}

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          {/* Personal information */}
          <Card
            sx={{
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography sx={{ mb: 2.5, fontSize: 16, fontWeight: 700 }}>
                Thông tin cán bộ
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={3}
                sx={{ alignItems: { xs: "stretch", sm: "flex-start" } }}
              >
                {/* Avatar */}
                <Stack
                  spacing={1.5}
                  sx={{
                    alignItems: "center",
                    width: { xs: "100%", sm: 160 },
                    flexShrink: 0,
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <Avatar
                      src={avatarPreview || undefined}
                      variant="rounded"
                      sx={{
                        width: 112,
                        height: 112,
                        bgcolor: "primary.light",
                        color: "primary.main",
                      }}
                    >
                      {!avatarPreview && (
                        <PersonOutlinedIcon sx={{ fontSize: 42 }} />
                      )}
                    </Avatar>

                    {avatarFile && (
                      <IconButton
                        type="button"
                        size="small"
                        color="error"
                        aria-label="Xóa ảnh đại diện"
                        onClick={handleRemoveAvatar}
                        sx={{
                          position: "absolute",
                          top: -10,
                          right: -10,
                          bgcolor: "background.paper",
                          border: "1px solid",
                          borderColor: "divider",
                          boxShadow: 1,
                          "&:hover": {
                            bgcolor: "error.light",
                            color: "error.dark",
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>

                  <Button
                    component="label"
                    variant="outlined"
                    size="small"
                    sx={{ textTransform: "none" }}
                  >
                    {avatarFile ? "Chọn ảnh khác" : "Chọn ảnh đại diện"}

                    <input
                      ref={avatarInputRef}
                      hidden
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleAvatarChange}
                    />
                  </Button>

                  <Typography
                    sx={{
                      fontSize: 11,
                      color: "text.secondary",
                      textAlign: "center",
                    }}
                  >
                    JPG, PNG hoặc WebP. Tối đa 2MB.
                  </Typography>

                  {avatarFile && (
                    <Typography
                      sx={{
                        maxWidth: 150,
                        fontSize: 11,
                        color: "text.secondary",
                        overflowWrap: "anywhere",
                        textAlign: "center",
                      }}
                    >
                      {avatarFile.name}
                    </Typography>
                  )}
                </Stack>

                {/* Form fields */}
                <Box
                  sx={{
                    flex: 1,
                    minWidth: 0,
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
                    label="Họ và tên"
                    placeholder="Nhập họ và tên cán bộ"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                  />

                  <TextField
                    fullWidth
                    required
                    label="Chức vụ"
                    placeholder="Ví dụ: Bác sĩ, Y sĩ..."
                    value={position}
                    onChange={(event) => setPosition(event.target.value)}
                  />

                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    placeholder="Nhập số điện thoại"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                  />

                  <TextField
                    fullWidth
                    required
                    type="number"
                    label="Thứ tự hiển thị"
                    value={displayOrder}
                    onChange={(event) => setDisplayOrder(event.target.value)}
                    slotProps={{
                      htmlInput: { min: 0, step: 1 },
                    }}
                    helperText="Số nhỏ hơn sẽ được hiển thị trước."
                  />

                  <FormControl fullWidth required sx={{ gridColumn: "1 / -1" }}>
                    <InputLabel id="staff-facility-select-label">
                      Cơ sở công tác
                    </InputLabel>

                    <Select
                      labelId="staff-facility-select-label"
                      value={facilityId}
                      label="Cơ sở công tác"
                      onChange={(event) => setFacilityId(event.target.value)}
                    >
                      <MenuItem value="" disabled>
                        Chưa tải danh sách cơ sở
                      </MenuItem>
                    </Select>

                    <FormHelperText>
                      Danh sách cơ sở sẽ được tải từ Supabase khi kết nối API.
                    </FormHelperText>
                  </FormControl>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Status */}
          <Card
            sx={{
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography sx={{ mb: 1, fontSize: 16, fontWeight: 700 }}>
                Trạng thái hồ sơ
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
                    <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                      Đang hoạt động
                    </Typography>

                    <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                      Hồ sơ được phép xuất hiện trong danh sách cán bộ công
                      khai.
                    </Typography>
                  </Box>
                }
                sx={{ alignItems: "center", ml: 0 }}
              />
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
              href="/admin/staff"
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
              {isEdit ? "Lưu thay đổi" : "Tạo hồ sơ"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}