"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddBusinessOutlinedIcon from "@mui/icons-material/AddBusinessOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import { usePagedApi } from "@/hooks/usePagedApi";
import { apiRequest } from "@/lib/api-client";
import type { Facility } from "@/types/database";
import PaginationBar from "@/components/shared/PaginationBar";
import LoadingState from "@/components/shared/LoadingState";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import {
  adminDialogPaperSx,
  adminFieldSx,
  adminMultilineFieldSx,
  AdminDialogHeading,
  AdminFilterCard,
  AdminFormSection,
  AdminPageHeader,
} from "./ui";

type FacilityInput = {
  name: string;
  code: string;
  address: string;
  phone: string;
  description: string;
  is_active: boolean;
};

const empty: FacilityInput = {
  name: "",
  code: "",
  address: "",
  phone: "",
  description: "",
  is_active: true,
};

export default function AdminFacilitiesPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const {
    data,
    pagination,
    page,
    goToPage,
    loading,
    error,
    reload,
    setPage,
  } = usePagedApi<Facility>("/api/admin/facilities", { search, status }, 10);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Facility | null>(null);
  const [confirmItem, setConfirmItem] = useState<Facility | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState<FacilityInput>(empty);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setPage(1);
  }, [search, status, setPage]);

  function showDialog(item?: Facility) {
    setEditing(item ?? null);
    setForm(
      item
        ? {
            name: item.name,
            code: item.code ?? "",
            address: item.address ?? "",
            phone: item.phone ?? "",
            description: item.description ?? "",
            is_active: item.is_active,
          }
        : empty,
    );
    setFormError("");
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    setFormError("");

    try {
      const url = editing
        ? `/api/admin/facilities/${editing.id}`
        : "/api/admin/facilities";
      await apiRequest(url, {
        method: editing ? "PATCH" : "POST",
        body: JSON.stringify(form),
      });
      setOpen(false);
      setMessage(editing ? "Đã cập nhật cơ sở." : "Đã tạo cơ sở mới.");
      reload();
    } catch (cause) {
      setFormError(
        cause instanceof Error ? cause.message : "Không thể lưu cơ sở.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirmItem) return;
    setDeleting(true);

    try {
      await apiRequest(`/api/admin/facilities/${confirmItem.id}`, {
        method: "DELETE",
      });
      setMessage("Đã xóa cơ sở.");
      setConfirmItem(null);
      reload();
    } catch (cause) {
      setMessage(
        cause instanceof Error ? cause.message : "Không thể xóa cơ sở.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Stack spacing={{ xs: 2, md: 2.5 }}>
      <AdminPageHeader
        eyebrow="QUẢN TRỊ HỆ THỐNG"
        title="Quản lý cơ sở y tế"
        description="Quản lý thông tin, mã định danh, địa chỉ và trạng thái hoạt động của các điểm trạm trực thuộc."
        action={
          <Button
            fullWidth={isMobile}
            variant="contained"
            startIcon={<AddBusinessOutlinedIcon />}
            onClick={() => showDialog()}
          >
            Thêm cơ sở
          </Button>
        }
      />

      {message && (
        <Alert
          onClose={() => setMessage("")}
          severity={message.startsWith("Đã") ? "success" : "error"}
        >
          {message}
        </Alert>
      )}
      {error && <Alert severity="error">{error}</Alert>}

      <AdminFilterCard>
        <Grid container spacing={1.5} alignItems="center">
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth
              size="small"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm tên, mã hoặc địa chỉ cơ sở..."
              sx={adminFieldSx}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlinedIcon sx={{ color: "#81948A", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Trạng thái"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              sx={adminFieldSx}
            >
              <MenuItem value="all">Tất cả trạng thái</MenuItem>
              <MenuItem value="active">Đang hoạt động</MenuItem>
              <MenuItem value="inactive">Ngừng hoạt động</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </AdminFilterCard>

      <Card sx={{ overflow: "hidden" }}>
        {loading ? (
          <LoadingState />
        ) : data.length === 0 ? (
          <EmptyState
            title="Chưa có cơ sở"
            description="Thêm cơ sở y tế để có thể phân công cán bộ và quản lý thông báo."
          />
        ) : (
          <>
            <Box sx={{ display: { xs: "block", md: "none" }, p: 1.5 }}>
              <Stack spacing={1.25}>
                {data.map((item) => (
                  <Card
                    key={item.id}
                    variant="outlined"
                    sx={{ borderRadius: 2.5, boxShadow: "none" }}
                  >
                    <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        gap={1}
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Typography fontWeight={800}>{item.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.code || "Chưa có mã"}
                          </Typography>
                        </Box>
                        <Chip
                          size="small"
                          label={item.is_active ? "Hoạt động" : "Ngừng hoạt động"}
                          color={item.is_active ? "success" : "default"}
                        />
                      </Stack>
                      <Stack spacing={0.8} sx={{ mt: 1.5 }}>
                        <Stack direction="row" spacing={1} alignItems="flex-start">
                          <LocationOnOutlinedIcon sx={{ color: "text.secondary", fontSize: 18, mt: 0.1 }} />
                          <Typography variant="body2" color="text.secondary">
                            {item.address || "Chưa cập nhật địa chỉ"}
                          </Typography>
                        </Stack>
                        {item.phone && (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <PhoneOutlinedIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                            <Typography variant="body2" color="text.secondary">
                              {item.phone}
                            </Typography>
                          </Stack>
                        )}
                      </Stack>
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={0.5}
                        sx={{ mt: 1.5, pt: 1, borderTop: "1px solid #EDF2EF" }}
                      >
                        <Button size="small" onClick={() => showDialog(item)}>
                          Chỉnh sửa
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => setConfirmItem(item)}
                        >
                          Xóa
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Box>

            <TableContainer sx={{ display: { xs: "none", md: "block" } }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Cơ sở</TableCell>
                    <TableCell>Mã định danh</TableCell>
                    <TableCell>Địa chỉ</TableCell>
                    <TableCell>Điện thoại</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell align="right">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Stack direction="row" spacing={1.25} alignItems="center">
                          <Box
                            sx={{
                              width: 38,
                              height: 38,
                              borderRadius: 2,
                              display: "grid",
                              placeItems: "center",
                              bgcolor: "primary.light",
                              color: "primary.dark",
                            }}
                          >
                            <BusinessOutlinedIcon fontSize="small" />
                          </Box>
                          <Typography fontWeight={750}>{item.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{item.code || "—"}</TableCell>
                      <TableCell sx={{ maxWidth: 260 }}>{item.address || "—"}</TableCell>
                      <TableCell>{item.phone || "—"}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          color={item.is_active ? "success" : "default"}
                          label={item.is_active ? "Hoạt động" : "Ngừng hoạt động"}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Chỉnh sửa">
                          <IconButton onClick={() => showDialog(item)}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton color="error" onClick={() => setConfirmItem(item)}>
                            <DeleteOutlineOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
        <Box sx={{ px: { xs: 1.5, sm: 2 } }}>
          {!loading && (
            <PaginationBar
              page={page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              perPage={pagination.perPage}
              onChange={goToPage}
            />
          )}
        </Box>
      </Card>

      <Dialog
        open={open}
        onClose={() => !saving && setOpen(false)}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobile}
        scroll="paper"
        slotProps={{ paper: { sx: adminDialogPaperSx } }}
      >
        <DialogTitle sx={{ px: { xs: 2, sm: 3 }, pt: 2.5, pb: 2 }}>
          <AdminDialogHeading
            title={editing ? "Chỉnh sửa cơ sở y tế" : "Thêm cơ sở y tế"}
            description="Cập nhật thông tin nhận diện và liên hệ của điểm trạm."
          />
        </DialogTitle>
        <DialogContent
          dividers
          sx={{ px: { xs: 1.75, sm: 3 }, py: 2.5, bgcolor: "#F7FAF8" }}
        >
          <Stack spacing={2.25}>
            <AdminFormSection
              title="Thông tin cơ sở"
              description="Tên và mã cơ sở được sử dụng để nhận diện điểm trạm trong hệ thống."
            >
              <Stack spacing={1.75}>
                <TextField
                  fullWidth
                  required
                  label="Tên cơ sở"
                  placeholder="Ví dụ: Trạm Y tế Hương Hoá"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  sx={adminFieldSx}
                />
                <TextField
                  fullWidth
                  label="Mã cơ sở"
                  placeholder="Ví dụ: HUONG_HOA"
                  value={form.code}
                  onChange={(event) => setForm({ ...form, code: event.target.value })}
                  helperText="Mã cơ sở cần duy nhất. Có thể dùng để ánh xạ hình ảnh đại diện ở Frontend."
                  sx={adminFieldSx}
                />
              </Stack>
            </AdminFormSection>

            <AdminFormSection
              title="Thông tin liên hệ"
              description="Địa chỉ và số điện thoại để người dân liên hệ với cơ sở."
            >
              <Stack spacing={1.75}>
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  placeholder="Nhập địa chỉ cụ thể"
                  value={form.address}
                  onChange={(event) => setForm({ ...form, address: event.target.value })}
                  sx={adminFieldSx}
                />
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  placeholder="Nhập số điện thoại liên hệ"
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                  sx={adminFieldSx}
                />
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="Mô tả"
                  placeholder="Thông tin giới thiệu hoặc ghi chú về cơ sở..."
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  sx={adminMultilineFieldSx}
                />
              </Stack>
            </AdminFormSection>

            <AdminFormSection
              title="Trạng thái hoạt động"
              description="Cơ sở ngừng hoạt động sẽ không xuất hiện trong các lựa chọn phân công mới."
            >
              <TextField
                select
                fullWidth
                label="Trạng thái"
                value={form.is_active ? "active" : "inactive"}
                onChange={(event) =>
                  setForm({ ...form, is_active: event.target.value === "active" })
                }
                sx={adminFieldSx}
              >
                <MenuItem value="active">Đang hoạt động</MenuItem>
                <MenuItem value="inactive">Ngừng hoạt động</MenuItem>
              </TextField>
            </AdminFormSection>
            {formError && <Alert severity="error">{formError}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: 2, borderTop: "1px solid #E9EFEB" }}>
          <Button color="inherit" onClick={() => setOpen(false)} disabled={saving}>
            Hủy
          </Button>
          <Button variant="contained" onClick={save} disabled={saving} sx={{ minWidth: 120 }}>
            {saving ? "Đang lưu..." : editing ? "Lưu thay đổi" : "Tạo cơ sở"}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={Boolean(confirmItem)}
        title="Xóa cơ sở y tế?"
        description={
          confirmItem
            ? `Bạn đang xóa “${confirmItem.name}”. Hành động này không thể hoàn tác.`
            : ""
        }
        confirmLabel="Xóa cơ sở"
        loading={deleting}
        onCancel={() => setConfirmItem(null)}
        onConfirm={remove}
      />
    </Stack>
  );
}
