
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
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import { usePagedApi } from "@/hooks/usePagedApi";
import { apiRequest } from "@/lib/api-client";
import { uploadAnnouncementAssets } from "@/lib/storage/uploads";
import { formatEventDate } from "@/lib/announcements/date";
import { getAnnouncementImagePath } from "@/constants/announcements";

import type {
  Announcement,
  AnnouncementAttachment,
  AnnouncementType,
} from "@/types/database";

import PaginationBar from "@/components/shared/PaginationBar";
import LoadingState from "@/components/shared/LoadingState";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import AnnouncementMediaFields from "@/components/shared/AnnouncementMediaFields";
import AnnouncementEventDate from "@/components/shared/AnnouncementEventDate";

import {
  adminDialogPaperSx,
  adminFieldSx,
  adminMultilineFieldSx,
  AdminDialogHeading,
  AdminFilterCard,
  AdminFormSection,
  AdminPageHeader,
} from "@/components/admin/ui";

const types: { value: AnnouncementType; label: string }[] = [
  { value: "VACCINATION", label: "Tiêm chủng" },
  { value: "DISEASE_PREVENTION", label: "Phòng chống dịch" },
  { value: "HEALTH_CHECK", label: "Khám sức khỏe" },
  { value: "NUTRITION", label: "Dinh dưỡng" },
  { value: "MEDICAL_NOTICE", label: "Thông tin y tế" },
  { value: "OTHER", label: "Khác" },
];

type FormState = {
  title: string;
  summary: string;
  content: string;
  type: AnnouncementType;
  status: "DRAFT" | "PUBLISHED";
  coverImageUrl: string;
  eventDate: string;
  expiresAt: string;
};

const emptyForm: FormState = {
  title: "",
  summary: "",
  content: "",
  type: "OTHER",
  status: "DRAFT",
  coverImageUrl: "",
  eventDate: "",
  expiresAt: "",
};

type Me = {
  user?: {
    id?: string;
  };
  profile?: {
    role?: "STAFF" | "MANAGER";
    facility_id?: string | null;
  };
};

type AnnouncementRow = Announcement & {
  author?: {
    full_name: string;
  };
};

export default function StaffAnnouncementsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");

  const {
    data,
    pagination,
    page,
    goToPage,
    setPage,
    loading,
    error,
    reload,
  } = usePagedApi<AnnouncementRow>(
    "/api/staff/announcements",
    { search, type, status },
    10,
  );

  const [userId, setUserId] = useState("");
  const [facilityId, setFacilityId] = useState<string | null>(null);
  const [isManager, setIsManager] = useState(false);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [attachments, setAttachments] = useState<AnnouncementAttachment[]>([]);
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");

  const [confirmItem, setConfirmItem] = useState<Announcement | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [search, type, status, setPage]);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => response.json())
      .then((body: Me) => {
        setUserId(body.user?.id ?? "");
        setFacilityId(body.profile?.facility_id ?? null);
        setIsManager(body.profile?.role === "MANAGER");
      })
      .catch(() => setFacilityId(null));
  }, []);

  function openForm(item?: Announcement) {
    setEditing(item ?? null);

    setForm(
      item
        ? {
            title: item.title,
            summary: item.summary ?? "",
            content: item.content,
            type: item.type,
            status:
              item.status === "ARCHIVED" ? "DRAFT" : item.status,
            coverImageUrl: item.cover_image_url ?? "",
            eventDate: item.event_date ?? "",
            expiresAt: item.expires_at
              ? item.expires_at.slice(0, 10)
              : "",
          }
        : emptyForm,
    );

    setCoverFile(null);
    setAttachments(item?.attachments ?? []);
    setAttachmentFiles([]);
    setFormError("");
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    setFormError("");

    try {
      const media = await uploadAnnouncementAssets({
        facilityId: isManager ? "global" : facilityId,
        coverImageUrl: form.coverImageUrl,
        coverFile,
        attachments,
        attachmentFiles,
      });

      const payload = {
        ...form,
        eventDate: form.eventDate || null,
        expiresAt: form.expiresAt || null,
        coverImageUrl: media.coverImageUrl,
        attachments: media.attachments,
      };

      if (editing) {
        await apiRequest(
          `/api/staff/announcements/${editing.id}`,
          {
            method: "PATCH",
            body: JSON.stringify(payload),
          },
        );
      } else {
        await apiRequest("/api/staff/announcements", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      setOpen(false);
      setNotice(
        editing
          ? "Đã cập nhật thông báo."
          : "Đã tạo thông báo.",
      );
      reload();
    } catch (cause) {
      setFormError(
        cause instanceof Error
          ? cause.message
          : "Không thể lưu thông báo.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirmItem) return;

    setDeleting(true);

    try {
      await apiRequest(
        `/api/staff/announcements/${confirmItem.id}`,
        { method: "DELETE" },
      );

      setNotice("Đã xóa thông báo.");
      setConfirmItem(null);
      reload();
    } catch (cause) {
      setNotice(
        cause instanceof Error
          ? cause.message
          : "Không thể xóa thông báo.",
      );
    } finally {
      setDeleting(false);
    }
  }

  const itemCard = (item: AnnouncementRow) => (
    <Card
      key={item.id}
      variant="outlined"
      sx={{
        overflow: "hidden",
        borderRadius: 2.5,
        boxShadow: "none",
        borderColor: "#E4ECE8",
      }}
    >
      <Box
        component="img"
        src={getAnnouncementImagePath(
          item.type,
          item.cover_image_url,
        )}
        alt={item.title}
        loading="lazy"
        sx={{
          display: "block",
          width: "100%",
          height: 140,
          objectFit: "cover",
          bgcolor: "#EAF3ED",
        }}
      />

      <CardContent sx={{ p: 2.25 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          gap={1}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography fontWeight={800} sx={{ lineHeight: 1.5 }}>
              {item.title}
            </Typography>

            <Typography color="text.secondary" variant="caption">
              {item.author?.full_name ?? "Cán bộ"}
            </Typography>
          </Box>

          <Chip
            size="small"
            color={
              item.status === "PUBLISHED" ? "success" : "warning"
            }
            label={
              item.status === "PUBLISHED"
                ? "Đã đăng"
                : "Bản nháp"
            }
          />
        </Stack>

        {item.event_date && (
          <Box sx={{ mt: 1.5 }}>
            <AnnouncementEventDate
              eventDate={item.event_date}
              compact
            />
          </Box>
        )}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap={1}
          sx={{ mt: 1.5 }}
        >
          <Stack direction="row" gap={0.75} alignItems="center">
            <Chip
              size="small"
              variant="outlined"
              label={
                types.find(
                  (entry) => entry.value === item.type,
                )?.label
              }
            />

            {(item.attachments?.length ?? 0) > 0 && (
              <Chip
                size="small"
                icon={<AttachFileOutlinedIcon />}
                label={item.attachments?.length ?? 0}
                variant="outlined"
              />
            )}
          </Stack>

          {item.author_id === userId && (
            <Stack direction="row">
              <IconButton
                size="small"
                onClick={() => openForm(item)}
                aria-label="Sửa thông báo"
              >
                <EditOutlinedIcon fontSize="small" />
              </IconButton>

              <IconButton
                size="small"
                color="error"
                onClick={() => setConfirmItem(item)}
                aria-label="Xóa thông báo"
              >
                <DeleteOutlineOutlinedIcon fontSize="small" />
              </IconButton>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Stack spacing={{ xs: 2, md: 2.5 }}>
      <AdminPageHeader
        eyebrow="QUẢN LÝ NỘI DUNG"
        title={
          isManager
            ? "Thông báo toàn trạm"
            : "Thông báo cơ sở"
        }
        description={
          isManager
            ? "Bạn có thể đăng thông báo chung áp dụng cho cả hai điểm trạm và chỉ sửa hoặc xóa thông báo do mình tạo."
            : "Bạn có thể xem thông báo đã xuất bản của cơ sở và chỉ sửa hoặc xóa thông báo do mình tạo."
        }
        action={
          <Button
            fullWidth={isMobile}
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            disabled={!isManager && !facilityId}
            onClick={() => openForm()}
            sx={{ minHeight: 44, px: 2.5 }}
          >
            Tạo thông báo
          </Button>
        }
      />

      {!isManager && !facilityId && (
        <Alert severity="warning">
          Tài khoản chưa được phân công cơ sở nên không thể tạo thông báo.
        </Alert>
      )}

      {notice && (
        <Alert
          severity={
            notice.startsWith("Đã") ? "success" : "error"
          }
          onClose={() => setNotice("")}
        >
          {notice}
        </Alert>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {/* Bộ lọc */}
      <AdminFilterCard>
        <Grid container spacing={1.5} alignItems="center">
          <Grid size={{ xs: 12, sm: 4, md: 5 }}>
            <TextField
              fullWidth
              size="small"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm tiêu đề thông báo..."
              sx={adminFieldSx}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlinedIcon
                        sx={{ color: "#81948A", fontSize: 20 }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 3.5 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Loại thông báo"
              value={type}
              onChange={(event) => setType(event.target.value)}
              sx={adminFieldSx}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {types.map((entry) => (
                <MenuItem key={entry.value} value={entry.value}>
                  {entry.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 3.5 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Trạng thái"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              sx={adminFieldSx}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="PUBLISHED">Đã xuất bản</MenuItem>
              <MenuItem value="DRAFT">Bản nháp của tôi</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </AdminFilterCard>

      {/* Danh sách thông báo */}
      <Card
        sx={{
          overflow: "hidden",
          borderRadius: 3,
          border: "1px solid #E7EEE9",
          boxShadow: "0 3px 16px rgba(25,65,45,.035)",
        }}
      >
        {loading ? (
          <LoadingState />
        ) : data.length === 0 ? (
          <EmptyState
            title="Chưa có thông báo"
            description={
              isManager
                ? "Thông báo toàn trạm đã xuất bản sẽ xuất hiện tại đây."
                : "Thông báo đã xuất bản của cơ sở sẽ xuất hiện tại đây."
            }
          />
        ) : (
          <>
            <Box
              sx={{
                display: { xs: "block", md: "none" },
                p: { xs: 1.25, sm: 1.75 },
              }}
            >
              <Stack spacing={1.5}>
                {data.map(itemCard)}
              </Stack>
            </Box>

            <TableContainer
              sx={{ display: { xs: "none", md: "block" } }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tiêu đề</TableCell>
                    <TableCell>Loại</TableCell>
                    <TableCell>Ngày diễn ra</TableCell>
                    <TableCell>Người tạo</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell align="right">Thao tác</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1.5}
                        >
                          <Box
                            component="img"
                            src={getAnnouncementImagePath(
                              item.type,
                              item.cover_image_url,
                            )}
                            alt=""
                            sx={{
                              width: 48,
                              height: 40,
                              flexShrink: 0,
                              objectFit: "cover",
                              borderRadius: 1.5,
                              bgcolor: "#EAF3ED",
                            }}
                          />

                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              fontWeight={700}
                              sx={{
                                overflowWrap: "anywhere",
                              }}
                            >
                              {item.title}
                            </Typography>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {item.slug}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        {
                          types.find(
                            (entry) => entry.value === item.type,
                          )?.label
                        }
                      </TableCell>

                      <TableCell>
                        {item.event_date
                          ? formatEventDate(item.event_date)
                          : "—"}
                      </TableCell>

                      <TableCell>
                        {item.author?.full_name ?? "—"}
                      </TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          label={
                            item.status === "PUBLISHED"
                              ? "Đã đăng"
                              : "Bản nháp"
                          }
                          color={
                            item.status === "PUBLISHED"
                              ? "success"
                              : "warning"
                          }
                        />
                      </TableCell>

                      <TableCell align="right">
                        {item.author_id === userId && (
                          <Stack
                            direction="row"
                            justifyContent="flex-end"
                          >
                            <IconButton
                              size="small"
                              onClick={() => openForm(item)}
                              aria-label="Sửa thông báo"
                            >
                              <EditOutlinedIcon />
                            </IconButton>

                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => setConfirmItem(item)}
                              aria-label="Xóa thông báo"
                            >
                              <DeleteOutlineOutlinedIcon />
                            </IconButton>
                          </Stack>
                        )}
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

      {/* Dialog tạo / chỉnh sửa thông báo */}
      <Dialog
        open={open}
        onClose={() => !saving && setOpen(false)}
        fullWidth
        maxWidth="md"
        fullScreen={isMobile}
        scroll="paper"
        slotProps={{
          paper: {
            sx: adminDialogPaperSx,
          },
        }}
      >
        <DialogTitle
          sx={{
            px: { xs: 2, sm: 3 },
            pt: 2.5,
            pb: 2,
          }}
        >
          <AdminDialogHeading
            title={
              editing
                ? "Chỉnh sửa thông báo"
                : "Tạo thông báo mới"
            }
            description="Quản lý nội dung, lịch trình và tài liệu đính kèm cho thông báo."
          />
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            px: { xs: 1.5, sm: 3 },
            py: 2.5,
            bgcolor: "#F7FAF8",
          }}
        >
          <Stack spacing={2.25}>
            {/* Thông tin cơ bản */}
            <AdminFormSection
              title="Thông tin cơ bản"
              description="Tiêu đề và phần giới thiệu ngắn của thông báo."
            >
              <Stack spacing={1.75}>
                <TextField
                  fullWidth
                  required
                  label="Tiêu đề thông báo"
                  placeholder="Nhập tiêu đề thông báo..."
                  value={form.title}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      title: event.target.value,
                    })
                  }
                  sx={adminFieldSx}
                />

                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  maxRows={5}
                  label="Tóm tắt"
                  placeholder="Tóm tắt ngắn gọn để hiển thị trong danh sách..."
                  value={form.summary}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      summary: event.target.value,
                    })
                  }
                  sx={adminMultilineFieldSx}
                />
              </Stack>
            </AdminFormSection>

            {/* Phân loại và lịch trình */}
            <AdminFormSection
              title="Phân loại và lịch trình"
              description="Chọn loại thông báo, trạng thái và thời gian liên quan."
            >
              <Grid container spacing={1.75}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    fullWidth
                    label="Loại thông báo"
                    value={form.type}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        type: event.target.value as AnnouncementType,
                      })
                    }
                    sx={adminFieldSx}
                  >
                    {types.map((entry) => (
                      <MenuItem
                        key={entry.value}
                        value={entry.value}
                      >
                        {entry.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    fullWidth
                    label="Trạng thái"
                    value={form.status}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        status: event.target.value as FormState["status"],
                      })
                    }
                    sx={adminFieldSx}
                  >
                    <MenuItem value="DRAFT">Bản nháp</MenuItem>
                    <MenuItem value="PUBLISHED">Xuất bản</MenuItem>
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Ngày diễn ra"
                    value={form.eventDate}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        eventDate: event.target.value,
                      })
                    }
                    slotProps={{
                      inputLabel: { shrink: true },
                    }}
                    helperText="Ngày diễn ra hoạt động, lịch khám hoặc lịch tiêm chủng."
                    sx={adminFieldSx}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Ngày hết hạn hiển thị"
                    value={form.expiresAt}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        expiresAt: event.target.value,
                      })
                    }
                    slotProps={{
                      inputLabel: { shrink: true },
                    }}
                    helperText="Để trống nếu không đặt thời hạn."
                    sx={adminFieldSx}
                  />
                </Grid>
              </Grid>

              {form.eventDate && (
                <Box sx={{ mt: 1.5 }}>
                  <AnnouncementEventDate
                    eventDate={form.eventDate}
                  />
                </Box>
              )}
            </AdminFormSection>

            {/* Hình ảnh và tài liệu */}
            <AdminFormSection
              title="Hình ảnh và tài liệu"
              description="Ảnh bìa là tùy chọn. Có thể đính kèm tài liệu liên quan để người dân tải xuống."
            >
              <AnnouncementMediaFields
                coverImageUrl={form.coverImageUrl}
                onCoverImageUrlChange={(value) =>
                  setForm({
                    ...form,
                    coverImageUrl: value,
                  })
                }
                coverFile={coverFile}
                onCoverFileChange={setCoverFile}
                attachments={attachments}
                onAttachmentsChange={setAttachments}
                attachmentFiles={attachmentFiles}
                onAttachmentFilesChange={setAttachmentFiles}
              />
            </AdminFormSection>

            {/* Nội dung thông báo */}
            <AdminFormSection
              title="Nội dung thông báo"
              description="Nội dung chi tiết được hiển thị trên trang thông báo công khai."
            >
              <TextField
                fullWidth
                required
                multiline
                minRows={8}
                maxRows={24}
                placeholder="Nhập nội dung chi tiết thông báo..."
                value={form.content}
                onChange={(event) =>
                  setForm({
                    ...form,
                    content: event.target.value,
                  })
                }
                sx={adminMultilineFieldSx}
              />
            </AdminFormSection>

            {formError && (
              <Alert severity="error">{formError}</Alert>
            )}
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            px: { xs: 2, sm: 3 },
            py: 2,
            gap: 1,
            borderTop: "1px solid #E9EFEB",
            flexDirection: {
              xs: "column-reverse",
              sm: "row",
            },
            alignItems: {
              xs: "stretch",
              sm: "center",
            },
            "& > :not(style) ~ :not(style)": {
              ml: 0,
            },
          }}
        >
          <Button
            color="inherit"
            onClick={() => setOpen(false)}
            disabled={saving}
            sx={{
              minHeight: 44,
              minWidth: { sm: 110 },
            }}
          >
            Hủy
          </Button>

          <Button
            variant="contained"
            onClick={save}
            disabled={saving}
            sx={{
              minHeight: 44,
              minWidth: { sm: 150 },
            }}
          >
            {saving
              ? "Đang lưu..."
              : editing
                ? "Lưu thay đổi"
                : "Tạo thông báo"}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={Boolean(confirmItem)}
        title="Xóa thông báo?"
        description={
          confirmItem
            ? `Thông báo “${confirmItem.title}” sẽ bị xóa vĩnh viễn.`
            : ""
        }
        confirmLabel="Xóa thông báo"
        loading={deleting}
        onCancel={() => setConfirmItem(null)}
        onConfirm={remove}
      />
    </Stack>
  );
}
