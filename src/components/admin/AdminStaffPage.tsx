"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
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
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import { usePagedApi } from "@/hooks/usePagedApi";
import { apiRequest } from "@/lib/api-client";
import type { Facility, Profile, ApiListResponse } from "@/types/database";
import PaginationBar from "@/components/shared/PaginationBar";
import LoadingState from "@/components/shared/LoadingState";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import {
  adminDialogPaperSx,
  adminFieldSx,
  AdminDialogHeading,
  AdminFilterCard,
  AdminFormSection,
  AdminPageHeader,
} from "./ui";

type StaffInput = {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  facilityId: string;
  isActive: boolean;
};

const initial: StaffInput = {
  fullName: "",
  email: "",
  phone: "",
  position: "",
  facilityId: "",
  isActive: true,
};

type StaffRow = Profile & { email?: string | null };

export default function AdminStaffPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [search, setSearch] = useState("");
  const [facilityId, setFacilityId] = useState("");
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
  } = usePagedApi<StaffRow>("/api/admin/staff", { search, facilityId, status }, 10);

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<StaffRow | null>(null);
  const [form, setForm] = useState<StaffInput>(initial);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [message, setMessage] = useState("");
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    kind: "delete" | "reset";
    item: StaffRow;
  } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [search, facilityId, status, setPage]);

  useEffect(() => {
    fetch("/api/admin/facilities?page=1&perPage=50&status=active", {
      cache: "no-store",
    })
      .then((response) => response.json())
      .then((body: ApiListResponse<Facility>) => setFacilities(body.data ?? []))
      .catch(() => setFacilities([]));
  }, []);

  function openDialog(item?: StaffRow) {
    setEditing(item ?? null);
    setForm(
      item
        ? {
            fullName: item.full_name,
            email: item.email ?? "",
            phone: item.phone ?? "",
            position: item.position ?? "",
            facilityId: item.facility_id ?? "",
            isActive: item.is_active,
          }
        : initial,
    );
    setFormError("");
    setDialogOpen(true);
  }

  async function save() {
    setSaving(true);
    setFormError("");

    try {
      if (editing) {
        await apiRequest(`/api/admin/staff/${editing.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            fullName: form.fullName,
            phone: form.phone,
            position: form.position,
            facilityId: form.facilityId || null,
            isActive: form.isActive,
          }),
        });
        setMessage("Đã cập nhật hồ sơ cán bộ.");
      } else {
        const result = await apiRequest<{
          success: boolean;
          data: { temporaryPassword: string };
        }>("/api/admin/staff", {
          method: "POST",
          body: JSON.stringify({
            fullName: form.fullName,
            email: form.email,
            phone: form.phone,
            position: form.position,
            facilityId: form.facilityId || null,
          }),
        });
        setTemporaryPassword(result.data.temporaryPassword);
        setPasswordOpen(true);
        setMessage("Đã tạo tài khoản cán bộ.");
      }

      setDialogOpen(false);
      reload();
    } catch (cause) {
      setFormError(
        cause instanceof Error ? cause.message : "Không thể lưu cán bộ.",
      );
    } finally {
      setSaving(false);
    }
  }

  function remove(item: StaffRow) {
    setConfirmAction({ kind: "delete", item });
  }

  function resetPassword(item: StaffRow) {
    setConfirmAction({ kind: "reset", item });
  }

  async function confirmStaffAction() {
    if (!confirmAction) return;
    setConfirmLoading(true);

    try {
      if (confirmAction.kind === "delete") {
        await apiRequest(`/api/admin/staff/${confirmAction.item.id}`, {
          method: "DELETE",
        });
        setMessage("Đã xóa tài khoản cán bộ.");
      } else {
        const result = await apiRequest<{ temporaryPassword: string }>(
          `/api/admin/staff/${confirmAction.item.id}/reset-password`,
          { method: "POST" },
        );
        setTemporaryPassword(result.temporaryPassword);
        setPasswordOpen(true);
      }
      setConfirmAction(null);
      reload();
    } catch (cause) {
      setMessage(
        cause instanceof Error
          ? cause.message
          : "Không thể thực hiện thao tác.",
      );
    } finally {
      setConfirmLoading(false);
    }
  }

  async function copyPassword() {
    await navigator.clipboard.writeText(temporaryPassword);
    setMessage("Đã sao chép mật khẩu tạm.");
  }

  return (
    <Stack spacing={{ xs: 2, md: 2.5 }}>
      <AdminPageHeader
        eyebrow="QUẢN TRỊ HỆ THỐNG"
        title="Quản lý cán bộ"
        description="Tạo tài khoản, cập nhật hồ sơ, phân công cơ sở và cấp mật khẩu tạm cho cán bộ y tế."
        action={
          <Button
            fullWidth={isMobile}
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            onClick={() => openDialog()}
          >
            Thêm cán bộ
          </Button>
        }
      />

      {message && (
        <Alert
          severity={message.startsWith("Đã") ? "success" : "info"}
          onClose={() => setMessage("")}
        >
          {message}
        </Alert>
      )}
      {error && <Alert severity="error">{error}</Alert>}

      <AdminFilterCard>
        <Grid container spacing={1.5} alignItems="center">
          <Grid size={{ xs: 12, md: 5 }}>
            <TextField
              fullWidth
              size="small"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm tên, điện thoại hoặc chức vụ..."
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
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Cơ sở công tác"
              value={facilityId}
              onChange={(event) => setFacilityId(event.target.value)}
              sx={adminFieldSx}
            >
              <MenuItem value="">Tất cả cơ sở</MenuItem>
              <MenuItem value="unassigned">Chưa phân cơ sở</MenuItem>
              {facilities.map((facility) => (
                <MenuItem key={facility.id} value={facility.id}>
                  {facility.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
              <MenuItem value="inactive">Đã khóa</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </AdminFilterCard>

      <Card sx={{ overflow: "hidden" }}>
        {loading ? (
          <LoadingState />
        ) : data.length === 0 ? (
          <EmptyState
            title="Chưa có cán bộ"
            description="Tạo tài khoản cán bộ đầu tiên để bắt đầu quản lý."
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
                        alignItems="center"
                        justifyContent="space-between"
                        gap={1}
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1.25}
                          sx={{ minWidth: 0 }}
                        >
                          <Avatar
                            src={item.avatar_url ?? undefined}
                            alt={item.full_name}
                            sx={{
                              width: 46,
                              height: 46,
                              bgcolor: "primary.light",
                              color: "primary.dark",
                              fontWeight: 800,
                            }}
                          >
                            {item.full_name.slice(0, 1)}
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography fontWeight={800} noWrap>
                              {item.full_name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              noWrap
                            >
                              {item.email || "Không có email"}
                            </Typography>
                          </Box>
                        </Stack>
                        <Chip
                          size="small"
                          color={item.is_active ? "success" : "default"}
                          label={item.is_active ? "Hoạt động" : "Đã khóa"}
                        />
                      </Stack>
                      <Stack spacing={0.6} sx={{ mt: 1.5 }}>
                        <Typography variant="body2">
                          {item.position || "Cán bộ y tế"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.facility?.name || "Chưa phân cơ sở"}
                        </Typography>
                        {item.phone && (
                          <Typography variant="caption" color="text.secondary">
                            {item.phone}
                          </Typography>
                        )}
                      </Stack>
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={0.5}
                        sx={{ mt: 1.5, pt: 1, borderTop: "1px solid #EDF2EF" }}
                      >
                        <Button size="small" onClick={() => resetPassword(item)}>
                          Mật khẩu
                        </Button>
                        <Button size="small" onClick={() => openDialog(item)}>
                          Chỉnh sửa
                        </Button>
                        <Button
                          color="error"
                          size="small"
                          onClick={() => remove(item)}
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
                    <TableCell>Cán bộ</TableCell>
                    <TableCell>Chức vụ</TableCell>
                    <TableCell>Cơ sở</TableCell>
                    <TableCell>Liên hệ</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell align="right">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1.25}>
                          <Avatar
                            src={item.avatar_url ?? undefined}
                            alt={item.full_name}
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: "primary.light",
                              color: "primary.dark",
                              fontWeight: 800,
                            }}
                          >
                            {item.full_name.slice(0, 1)}
                          </Avatar>
                          <Box>
                            <Typography fontWeight={750}>{item.full_name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {item.email}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>{item.position || "—"}</TableCell>
                      <TableCell>
                        {item.facility?.name || (
                          <Chip size="small" label="Chưa phân cơ sở" />
                        )}
                      </TableCell>
                      <TableCell>{item.phone || "—"}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          color={item.is_active ? "success" : "default"}
                          label={item.is_active ? "Hoạt động" : "Đã khóa"}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Cấp mật khẩu tạm">
                          <IconButton onClick={() => resetPassword(item)}>
                            <KeyOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Chỉnh sửa hồ sơ">
                          <IconButton onClick={() => openDialog(item)}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa tài khoản">
                          <IconButton color="error" onClick={() => remove(item)}>
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

      {/* Create / edit staff dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => !saving && setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobile}
        scroll="paper"
        slotProps={{ paper: { sx: adminDialogPaperSx } }}
      >
        <DialogTitle sx={{ px: { xs: 2, sm: 3 }, pt: 2.5, pb: 2 }}>
          <AdminDialogHeading
            title={editing ? "Chỉnh sửa thông tin cán bộ" : "Tạo tài khoản cán bộ"}
            description={
              editing
                ? "Cập nhật hồ sơ, phân công cơ sở và trạng thái tài khoản."
                : "Tài khoản được tạo bởi quản trị viên. Hệ thống sẽ sinh mật khẩu tạm sau khi lưu."
            }
          />
        </DialogTitle>
        <DialogContent
          dividers
          sx={{ px: { xs: 1.75, sm: 3 }, py: 2.5, bgcolor: "#F7FAF8" }}
        >
          <Stack spacing={2.25}>
            <AdminFormSection
              title="Thông tin cán bộ"
              description="Thông tin nhận diện và liên hệ của cán bộ y tế."
            >
              <Grid container spacing={1.75}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    required
                    label="Họ và tên"
                    placeholder="Nhập họ và tên cán bộ"
                    value={form.fullName}
                    onChange={(event) =>
                      setForm({ ...form, fullName: event.target.value })
                    }
                    sx={adminFieldSx}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlineOutlinedIcon sx={{ color: "#82968B", fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    required
                    disabled={Boolean(editing)}
                    label="Email đăng nhập"
                    type="email"
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={(event) =>
                      setForm({ ...form, email: event.target.value })
                    }
                    helperText={
                      editing
                        ? "Email đăng nhập không thể thay đổi tại đây."
                        : "Mỗi email chỉ được sử dụng cho một tài khoản."
                    }
                    sx={adminFieldSx}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <AlternateEmailOutlinedIcon sx={{ color: "#82968B", fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    placeholder="Nhập số điện thoại"
                    value={form.phone}
                    onChange={(event) =>
                      setForm({ ...form, phone: event.target.value })
                    }
                    sx={adminFieldSx}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneOutlinedIcon sx={{ color: "#82968B", fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Chức vụ"
                    placeholder="Ví dụ: Bác sĩ, Y sĩ..."
                    value={form.position}
                    onChange={(event) =>
                      setForm({ ...form, position: event.target.value })
                    }
                    sx={adminFieldSx}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <WorkOutlineOutlinedIcon sx={{ color: "#82968B", fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </AdminFormSection>

            <AdminFormSection
              title="Phân công và trạng thái"
              description="Cơ sở làm việc có thể để trống nếu cán bộ chưa được phân công."
            >
              <Stack spacing={1.75}>
                <TextField
                  select
                  fullWidth
                  label="Cơ sở công tác"
                  value={form.facilityId}
                  onChange={(event) =>
                    setForm({ ...form, facilityId: event.target.value })
                  }
                  sx={adminFieldSx}
                >
                  <MenuItem value="">Chưa phân cơ sở</MenuItem>
                  {facilities.map((facility) => (
                    <MenuItem key={facility.id} value={facility.id}>
                      {facility.name}
                    </MenuItem>
                  ))}
                </TextField>
                {editing && (
                  <TextField
                    select
                    fullWidth
                    label="Trạng thái tài khoản"
                    value={form.isActive ? "active" : "inactive"}
                    onChange={(event) =>
                      setForm({ ...form, isActive: event.target.value === "active" })
                    }
                    sx={adminFieldSx}
                  >
                    <MenuItem value="active">Đang hoạt động</MenuItem>
                    <MenuItem value="inactive">Đã khóa</MenuItem>
                  </TextField>
                )}
                {!editing && (
                  <Alert severity="info" sx={{ borderRadius: 2.5 }}>
                    Sau khi tạo, mật khẩu tạm chỉ hiển thị một lần. Cán bộ phải đổi mật khẩu ở lần đăng nhập đầu tiên.
                  </Alert>
                )}
              </Stack>
            </AdminFormSection>

            {formError && <Alert severity="error">{formError}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{ px: { xs: 2, sm: 3 }, py: 2, borderTop: "1px solid #E9EFEB" }}
        >
          <Button color="inherit" onClick={() => setDialogOpen(false)} disabled={saving}>
            Hủy
          </Button>
          <Button variant="contained" onClick={save} disabled={saving} sx={{ minWidth: 132 }}>
            {saving ? "Đang lưu..." : editing ? "Lưu thay đổi" : "Tạo tài khoản"}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={Boolean(confirmAction)}
        title={confirmAction?.kind === "delete" ? "Xóa tài khoản cán bộ?" : "Cấp mật khẩu tạm?"}
        description={
          confirmAction
            ? confirmAction.kind === "delete"
              ? `Tài khoản và hồ sơ của ${confirmAction.item.full_name} sẽ bị xóa. Thao tác này không thể hoàn tác.`
              : `Một mật khẩu tạm mới sẽ được cấp cho ${confirmAction.item.full_name}; mật khẩu hiện tại sẽ không còn sử dụng được.`
            : ""
        }
        confirmLabel={confirmAction?.kind === "delete" ? "Xóa tài khoản" : "Cấp mật khẩu"}
        loading={confirmLoading}
        onCancel={() => setConfirmAction(null)}
        onConfirm={confirmStaffAction}
      />

      {/* One-time temporary password */}
      <Dialog
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobile}
        slotProps={{ paper: { sx: adminDialogPaperSx } }}
      >
        <DialogTitle sx={{ px: { xs: 2, sm: 3 }, pt: 2.5, pb: 1.5 }}>
          <AdminDialogHeading
            title="Mật khẩu tạm thời"
            description="Sao chép và gửi trực tiếp cho cán bộ qua kênh an toàn."
          />
        </DialogTitle>
        <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
          <Stack spacing={2}>
            <Alert severity="warning" sx={{ borderRadius: 2.5 }}>
              Mật khẩu chỉ được hiển thị một lần. Cán bộ phải đổi mật khẩu sau khi đăng nhập.
            </Alert>
            <TextField
              fullWidth
              label="Mật khẩu tạm"
              value={temporaryPassword}
              slotProps={{ input: { readOnly: true } }}
              sx={{
                ...adminFieldSx,
                "& .MuiInputBase-input": {
                  ...adminFieldSx["& .MuiInputBase-input"],
                  fontFamily: "monospace",
                  letterSpacing: ".03em",
                },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
          <Button color="inherit" onClick={() => setPasswordOpen(false)}>
            Đóng
          </Button>
          <Button
            variant="contained"
            startIcon={<ContentCopyOutlinedIcon />}
            onClick={copyPassword}
          >
            Sao chép mật khẩu
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
