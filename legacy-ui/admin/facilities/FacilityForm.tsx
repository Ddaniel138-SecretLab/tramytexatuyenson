"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";

interface FacilityFormProps {
  mode: "create" | "edit";
  facilityId?: string;
}

interface FacilityFormData {
  name: string;
  slug: string;
  address: string;
  phone: string;
  workingHours: string;
  mapUrl: string;
  description: string;
  displayOrder: string;
  isActive: boolean;
}

const initialFormData: FacilityFormData = {
  name: "",
  slug: "",
  address: "",
  phone: "",
  workingHours: "",
  mapUrl: "",
  description: "",
  displayOrder: "0",
  isActive: true,
};

export default function FacilityForm({
  mode,
  facilityId,
}: FacilityFormProps) {
  const [form, setForm] = useState<FacilityFormData>(initialFormData);
  const [error, setError] = useState("");

  const isEdit = mode === "edit";

  const handleChange = (
    field: keyof FacilityFormData,
    value: string | boolean,
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleNameChange = (value: string) => {
    const slug = value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "d")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setForm((previous) => ({
      ...previous,
      name: value,
      slug,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Vui lòng nhập tên cơ sở y tế.");
      return;
    }

    if (!form.slug.trim()) {
      setError("Vui lòng nhập mã định danh (slug).");
      return;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) {
      setError("Mã slug chỉ được chứa chữ thường, số và dấu gạch ngang.");
      return;
    }

    if (!form.address.trim()) {
      setError("Vui lòng nhập địa chỉ cơ sở.");
      return;
    }

    if (form.phone.trim() && !/^[0-9+\s().-]{8,20}$/.test(form.phone)) {
      setError("Số điện thoại không hợp lệ.");
      return;
    }

    if (form.mapUrl.trim()) {
      try {
        const url = new URL(form.mapUrl);

        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error();
        }
      } catch {
        setError("Đường dẫn bản đồ không hợp lệ.");
        return;
      }
    }

    const displayOrder = Number(form.displayOrder);

    if (
      !Number.isInteger(displayOrder) ||
      displayOrder < 0
    ) {
      setError("Thứ tự hiển thị phải là số nguyên không âm.");
      return;
    }

    // TODO: Kết nối API tạo/cập nhật cơ sở y tế.
    console.log("Facility form:", {
      ...form,
      displayOrder,
      facilityId,
    });

    setError("Giao diện hiện chưa kết nối API. Chưa có dữ liệu nào được lưu.");
  };

  return (
    <Stack spacing={3}>
      {/* Heading */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: { xs: 22, sm: 26 },
              fontWeight: 800,
            }}
          >
            {isEdit ? "Chỉnh sửa cơ sở y tế" : "Thêm cơ sở y tế"}
          </Typography>

          <Typography
            sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}
          >
            {isEdit
              ? "Cập nhật thông tin cơ sở y tế."
              : "Nhập thông tin để tạo hồ sơ cơ sở y tế mới."}
          </Typography>
        </Box>

        <Button
          component={Link}
          href="/admin/facilities"
          variant="outlined"
          startIcon={<ArrowBackOutlinedIcon />}
          sx={{ alignSelf: { xs: "stretch", sm: "center" } }}
        >
          Quay lại
        </Button>
      </Stack>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          {/* Basic information */}
          <Card
            sx={{
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Stack sx={{ alignItems: "center" }} direction="row" spacing={1.5}>
                <BusinessOutlinedIcon color="primary" />

                <Typography sx={{ fontWeight: 700 }}>
                  Thông tin cơ bản
                </Typography>
              </Stack>

              <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    required
                    label="Tên cơ sở y tế"
                    placeholder="Ví dụ: Trạm Y tế xã Tuyên Sơn"
                    value={form.name}
                    onChange={(event) => handleNameChange(event.target.value)}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    required
                    label="Mã định danh (Slug)"
                    placeholder="tram-y-te-tuyen-son"
                    value={form.slug}
                    onChange={(event) =>
                      handleChange("slug", event.target.value.toLowerCase())
                    }
                    helperText="Dùng để nhận diện cơ sở trên hệ thống. Không sử dụng dấu tiếng Việt hoặc khoảng trắng."
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    required
                    multiline
                    minRows={2}
                    label="Địa chỉ"
                    placeholder="Nhập địa chỉ đầy đủ của cơ sở..."
                    value={form.address}
                    onChange={(event) =>
                      handleChange("address", event.target.value)
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    placeholder="Ví dụ: 0236 123 456"
                    value={form.phone}
                    onChange={(event) =>
                      handleChange("phone", event.target.value)
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Giờ làm việc"
                    placeholder="Ví dụ: Thứ 2 - Thứ 6, 7:00 - 17:00"
                    value={form.workingHours}
                    onChange={(event) =>
                      handleChange("workingHours", event.target.value)
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Location */}
          <Card
            sx={{
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography sx={{ fontWeight: 700 }}>
                Bản đồ và mô tả
              </Typography>

              <Stack spacing={2.5} sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Đường dẫn Google Maps"
                  placeholder="https://maps.google.com/..."
                  value={form.mapUrl}
                  onChange={(event) =>
                    handleChange("mapUrl", event.target.value)
                  }
                  helperText="Nhập đường dẫn chia sẻ vị trí của cơ sở trên Google Maps."
                />

                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  label="Mô tả cơ sở"
                  placeholder="Giới thiệu ngắn về cơ sở y tế..."
                  value={form.description}
                  onChange={(event) =>
                    handleChange("description", event.target.value)
                  }
                />
              </Stack>
            </CardContent>
          </Card>

          {/* Display settings */}
          <Card
            sx={{
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography sx={{ fontWeight: 700 }}>
                Cài đặt hiển thị
              </Typography>

              <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Thứ tự hiển thị"
                    value={form.displayOrder}
                    onChange={(event) =>
                      handleChange("displayOrder", event.target.value)
                    }
                    slotProps={{
                      htmlInput: { min: 0, step: 1 },
                    }}
                    helperText="Số nhỏ hơn sẽ được ưu tiên hiển thị trước."
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={form.isActive}
                        onChange={(event) =>
                          handleChange("isActive", event.target.checked)
                        }
                      />
                    }
                    label="Đang hoạt động"
                  />

                  <Typography
                    sx={{ fontSize: 12, color: "text.secondary", ml: 4.5 }}
                  >
                    Cơ sở ngừng hoạt động sẽ không hiển thị trên website công khai.
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {error && <Alert severity="info">{error}</Alert>}

          {/* Actions */}
          <Stack
            direction={{ xs: "column-reverse", sm: "row" }}
            spacing={1.5}
            sx={{ justifyContent: "flex-end" }}
          >
            <Button
              component={Link}
              href="/admin/facilities"
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
              {isEdit ? "Lưu thay đổi" : "Tạo cơ sở"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}