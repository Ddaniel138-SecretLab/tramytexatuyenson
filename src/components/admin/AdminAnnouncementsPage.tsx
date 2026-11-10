'use client';

import { useEffect, useState } from 'react';
import {
  Alert, Box, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent,
  DialogTitle, Grid, IconButton, MenuItem, Stack, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Tooltip, Typography,
} from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import { usePagedApi } from '@/hooks/usePagedApi';
import { apiRequest } from '@/lib/api-client';
import { uploadAnnouncementAssets } from '@/lib/storage/uploads';
import { formatEventDate } from '@/lib/announcements/date';
import { getAnnouncementImagePath } from '@/constants/announcements';
import type { Announcement, AnnouncementAttachment, AnnouncementStatus, AnnouncementType, Facility, ApiListResponse } from '@/types/database';
import PaginationBar from '@/components/shared/PaginationBar';
import LoadingState from '@/components/shared/LoadingState';
import EmptyState from '@/components/shared/EmptyState';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import AnnouncementMediaFields from '@/components/shared/AnnouncementMediaFields';
import AnnouncementEventDate from '@/components/shared/AnnouncementEventDate';

const types: { value: AnnouncementType; label: string }[] = [
  { value: 'VACCINATION', label: 'Tiêm chủng' },
  { value: 'DISEASE_PREVENTION', label: 'Phòng chống dịch' },
  { value: 'HEALTH_CHECK', label: 'Khám sức khỏe' },
  { value: 'NUTRITION', label: 'Dinh dưỡng' },
  { value: 'MEDICAL_NOTICE', label: 'Thông tin y tế' },
  { value: 'OTHER', label: 'Khác' },
];
const statuses: { value: AnnouncementStatus; label: string }[] = [
  { value: 'DRAFT', label: 'Bản nháp' },
  { value: 'PUBLISHED', label: 'Đã xuất bản' },
  { value: 'ARCHIVED', label: 'Đã lưu trữ' },
];

import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    height: 44,
    borderRadius: 2.5,
    bgcolor: "#FFFFFF",
    fontSize: 14,
    transition: "all 0.2s ease",

    "& fieldset": {
      borderColor: "#DFE7E2",
    },

    "&:hover fieldset": {
      borderColor: "#9ABDAA",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#238264",
      borderWidth: 1.5,
    },

    "&.Mui-focused": {
      boxShadow: "0 0 0 3px rgba(35,130,100,0.08)",
    },
  },

  "& .MuiOutlinedInput-input": {
    padding: "10px 14px",
    boxSizing: "border-box",
  },

  "& .MuiSelect-select": {
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
    minHeight: "unset",
    padding: "10px 36px 10px 14px !important",
  },

  "& .MuiInputLabel-root": {
    fontSize: 13,
  },
};

const multilineFieldSx = {
  ...fieldSx,

  "& .MuiOutlinedInput-root": {
    ...fieldSx["& .MuiOutlinedInput-root"],
    height: "auto",
    minHeight: 44,
    alignItems: "flex-start",
  },

  "& .MuiOutlinedInput-input": {
    padding: "12px 14px",
    lineHeight: 1.7,
  },
};

type FormState = {
  title: string;
  summary: string;
  content: string;
  type: AnnouncementType;
  status: AnnouncementStatus;
  facilityId: string;
  coverImageUrl: string;
  eventDate: string;
  expiresAt: string;
};

const emptyForm: FormState = {
  title: '', summary: '', content: '', type: 'OTHER', status: 'DRAFT',
  facilityId: '', coverImageUrl: '', eventDate: '', expiresAt: '',
};
const statusColor = (status: AnnouncementStatus) => status === 'PUBLISHED' ? 'success' : status === 'DRAFT' ? 'warning' : 'default';
type AnnouncementRow = Announcement & { author?: { full_name: string }; facility?: { name: string } };

export default function AdminAnnouncementsPage() {

  const theme = useTheme();

  const isMobile = useMediaQuery(
    theme.breakpoints.down("sm"),
  );
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [facilityId, setFacilityId] = useState('');
  const { data, pagination, page, goToPage, setPage, loading, error, reload } =
    usePagedApi<AnnouncementRow>('/api/admin/announcements', { search, type, status, facilityId }, 10);

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [attachments, setAttachments] = useState<AnnouncementAttachment[]>([]);
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');
  const [confirmItem, setConfirmItem] = useState<Announcement | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { setPage(1); }, [search, type, status, facilityId, setPage]);

  useEffect(() => {
    fetch('/api/admin/facilities?page=1&perPage=100', { cache: 'no-store' })
      .then((response) => response.json())
      .then((body: ApiListResponse<Facility>) => setFacilities(body.data ?? []))
      .catch(() => setFacilities([]));
  }, []);

  function openForm(item?: Announcement) {
    setEditing(item ?? null);
    setForm(item ? {
      title: item.title,
      summary: item.summary ?? '',
      content: item.content,
      type: item.type,
      status: item.status,
      facilityId: item.facility_id ?? '',
      coverImageUrl: item.cover_image_url ?? '',
      eventDate: item.event_date ?? '',
      expiresAt: item.expires_at ? item.expires_at.slice(0, 10) : '',
    } : emptyForm);
    setCoverFile(null);
    setAttachments(item?.attachments ?? []);
    setAttachmentFiles([]);
    setFormError('');
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    setFormError('');

    try {
      const media = await uploadAnnouncementAssets({
        facilityId: form.facilityId || null,
        coverImageUrl: form.coverImageUrl,
        coverFile,
        attachments,
        attachmentFiles,
      });

      const payload = {
        ...form,
        facilityId: form.facilityId || null,
        eventDate: form.eventDate || null,
        expiresAt: form.expiresAt || null,
        coverImageUrl: media.coverImageUrl,
        attachments: media.attachments,
      };

      if (editing) {
        await apiRequest(`/api/admin/announcements/${editing.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest('/api/admin/announcements', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      setNotice(editing ? 'Đã cập nhật thông báo.' : 'Đã tạo thông báo.');
      setOpen(false);
      reload();
    } catch (cause) {
      setFormError(cause instanceof Error ? cause.message : 'Không thể lưu thông báo.');
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirmItem) return;
    setDeleting(true);
    try {
      await apiRequest(`/api/admin/announcements/${confirmItem.id}`, { method: 'DELETE' });
      setNotice('Đã xóa thông báo.');
      setConfirmItem(null);
      reload();
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : 'Không thể xóa thông báo.');
    } finally {
      setDeleting(false);
    }
  }

  const itemCard = (item: AnnouncementRow) => (
    <Card key={item.id} variant="outlined" sx={{ overflow: 'hidden', boxShadow: 'none' }}>
      <Box component="img" src={getAnnouncementImagePath(item.type, item.cover_image_url)} alt={item.title} loading="lazy" sx={{ display: 'block', width: '100%', height: 136, objectFit: 'cover', bgcolor: '#EAF3ED' }} />
      <CardContent sx={{ p: 2.25 }}>
        <Stack direction="row" justifyContent="space-between" gap={1} alignItems="flex-start">
          <Box sx={{ minWidth: 0 }}>
            <Typography fontWeight={800}>{item.title}</Typography>
            <Typography color="text.secondary" variant="caption">{item.facility?.name ?? 'Toàn trạm'} · {item.author?.full_name ?? 'Quản trị viên'}</Typography>
          </Box>
          <Chip size="small" color={statusColor(item.status)} label={statuses.find((entry) => entry.value === item.status)?.label} />
        </Stack>
        {item.event_date && <Box sx={{ mt: 1.5 }}><AnnouncementEventDate eventDate={item.event_date} compact /></Box>}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.5 }}>
          <Stack direction="row" gap={0.75} alignItems="center">
            <Chip size="small" variant="outlined" label={types.find((entry) => entry.value === item.type)?.label} />
            {(item.attachments?.length ?? 0) > 0 && <Chip size="small" icon={<AttachFileOutlinedIcon />} label={item.attachments?.length ?? 0} variant="outlined" />}
          </Stack>
          <Stack direction="row">
            <IconButton size="small" aria-label="Sửa" onClick={() => openForm(item)}><EditOutlinedIcon fontSize="small" /></IconButton>
            <IconButton size="small" color="error" aria-label="Xóa" onClick={() => setConfirmItem(item)}><DeleteOutlineOutlinedIcon fontSize="small" /></IconButton>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} gap={2}>
        <Box>
          <Typography variant="h5" fontWeight={900}>Quản lý thông báo</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Quản lý thông báo toàn trạm và thông báo của từng cơ sở.</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={() => openForm()}>Tạo thông báo</Button>
      </Stack>

      {notice && <Alert severity="success" onClose={() => setNotice('')}>{notice}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid #E8EEE9",
          boxShadow: "0 3px 15px rgba(25,65,45,0.035)",
        }}
      >
        <CardContent
          sx={{
            p: { xs: 1.75, sm: 2.5 },
            "&:last-child": {
              pb: { xs: 1.75, sm: 2.5 },
            },
          }}
        >
          <Grid container spacing={1.5} alignItems="center">
            {/* Search */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                size="small"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm tiêu đề thông báo..."
                sx={fieldSx}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchOutlinedIcon
                          sx={{
                            fontSize: 20,
                            color: "#81948A",
                          }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            {/* Type */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Loại thông báo"
                value={type}
                onChange={(event) => setType(event.target.value)}
                sx={fieldSx}
              >
                <MenuItem value="">Tất cả loại</MenuItem>

                {types.map((entry) => (
                  <MenuItem key={entry.value} value={entry.value}>
                    {entry.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Status */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Trạng thái"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                sx={fieldSx}
              >
                <MenuItem value="">Tất cả trạng thái</MenuItem>

                {statuses.map((entry) => (
                  <MenuItem key={entry.value} value={entry.value}>
                    {entry.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Facility */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Phạm vi"
                value={facilityId}
                onChange={(event) => setFacilityId(event.target.value)}
                sx={fieldSx}
              >
                <MenuItem value="">Tất cả cơ sở</MenuItem>
                <MenuItem value="global">Toàn trạm</MenuItem>

                {facilities.map((facility) => (
                  <MenuItem key={facility.id} value={facility.id}>
                    {facility.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        {loading ? <LoadingState /> : data.length === 0 ? (
          <EmptyState title="Chưa có thông báo" description="Tạo thông báo đầu tiên để hiển thị cho người dân." />
        ) : (
          <>
            <Box sx={{ display: { xs: 'block', md: 'none' }, p: 1.5 }}>
              <Stack spacing={1.5}>{data.map(itemCard)}</Stack>
            </Box>
            <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tiêu đề</TableCell><TableCell>Loại</TableCell><TableCell>Ngày diễn ra</TableCell><TableCell>Phạm vi</TableCell><TableCell>Người tạo</TableCell><TableCell>Trạng thái</TableCell><TableCell align="right">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Box component="img" src={getAnnouncementImagePath(item.type, item.cover_image_url)} alt="" sx={{ width: 52, height: 42, objectFit: 'cover', borderRadius: 1.5, bgcolor: '#EAF3ED' }} />
                          <Box><Typography fontWeight={700}>{item.title}</Typography><Typography variant="caption" color="text.secondary">{item.slug}</Typography></Box>
                        </Stack>
                      </TableCell>
                      <TableCell>{types.find((entry) => entry.value === item.type)?.label}</TableCell>
                      <TableCell>{item.event_date ? formatEventDate(item.event_date) : '—'}</TableCell>
                      <TableCell>{item.facility?.name ?? 'Toàn trạm'}</TableCell>
                      <TableCell>{item.author?.full_name ?? '—'}</TableCell>
                      <TableCell><Chip size="small" color={statusColor(item.status)} label={statuses.find((entry) => entry.value === item.status)?.label} /></TableCell>
                      <TableCell align="right">
                        <Tooltip title="Chỉnh sửa"><IconButton onClick={() => openForm(item)}><EditOutlinedIcon /></IconButton></Tooltip>
                        <Tooltip title="Xóa"><IconButton color="error" onClick={() => setConfirmItem(item)}><DeleteOutlineOutlinedIcon /></IconButton></Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
        <Box sx={{ px: 2 }}>{!loading && <PaginationBar page={page} totalPages={pagination.totalPages} total={pagination.total} perPage={pagination.perPage} onChange={goToPage} />}</Box>
      </Card>

      <Dialog
  open={open}
  onClose={() => !saving && setOpen(false)}
  fullWidth
  maxWidth="md"
  fullScreen={isMobile}
  scroll="paper"
  slotProps={{
    paper: {
      sx: {
        borderRadius: { xs: 0, sm: 3 },
        overflow: "hidden",
        maxHeight: { sm: "calc(100% - 48px)" },
      },
    },
  }}
>
  {/* Header */}
  <DialogTitle
    sx={{
      px: { xs: 2, sm: 3 },
      py: 2.25,
      borderBottom: "1px solid #E9EFEB",
      bgcolor: "#FFFFFF",
    }}
  >
    <Typography fontSize={19} fontWeight={800} color="#174F40">
      {editing ? "Chỉnh sửa thông báo" : "Tạo thông báo mới"}
    </Typography>

    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ mt: 0.5, fontSize: 13 }}
    >
      Nhập thông tin, thời gian diễn ra và nội dung thông báo.
    </Typography>
  </DialogTitle>

  {/* Content */}
  <DialogContent
    dividers
    sx={{
      bgcolor: "#F7FAF8",
      px: { xs: 1.75, sm: 3 },
      py: 2.5,
    }}
  >
    <Stack spacing={2.5}>
      {/* Section 1: Basic information */}
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderRadius: 2.5,
          borderColor: "#E4EBE6",
          boxShadow: "none",
        }}
      >
        <Stack spacing={0.5} sx={{ mb: 2.5 }}>
          <Typography fontWeight={800} fontSize={15} color="#174F40">
            Thông tin cơ bản
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Tiêu đề và phần giới thiệu ngắn của thông báo.
          </Typography>
        </Stack>

        <Stack spacing={2}>
          <TextField
            required
            fullWidth
            label="Tiêu đề thông báo"
            placeholder="Nhập tiêu đề thông báo..."
            value={form.title}
            onChange={(event) =>
              setForm({ ...form, title: event.target.value })
            }
            sx={fieldSx}
          />

          <TextField
            fullWidth
            multiline
            minRows={2}
            maxRows={5}
            label="Tóm tắt"
            placeholder="Nhập nội dung giới thiệu ngắn..."
            value={form.summary}
            onChange={(event) =>
              setForm({ ...form, summary: event.target.value })
            }
            sx={multilineFieldSx}
          />
        </Stack>
      </Paper>

      {/* Section 2: Classification and schedule */}
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderRadius: 2.5,
          borderColor: "#E4EBE6",
          boxShadow: "none",
        }}
      >
        <Stack spacing={0.5} sx={{ mb: 2.5 }}>
          <Typography fontWeight={800} fontSize={15} color="#174F40">
            Phân loại và lịch trình
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Chọn loại thông báo, phạm vi đăng và thời gian liên quan.
          </Typography>
        </Stack>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              required
              fullWidth
              label="Loại thông báo"
              value={form.type}
              onChange={(event) =>
                setForm({
                  ...form,
                  type: event.target.value as AnnouncementType,
                })
              }
              sx={fieldSx}
            >
              {types.map((entry) => (
                <MenuItem key={entry.value} value={entry.value}>
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
                  status: event.target.value as AnnouncementStatus,
                })
              }
              sx={fieldSx}
            >
              {statuses.map((entry) => (
                <MenuItem key={entry.value} value={entry.value}>
                  {entry.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              select
              fullWidth
              label="Phạm vi đăng thông báo"
              value={form.facilityId}
              onChange={(event) =>
                setForm({
                  ...form,
                  facilityId: event.target.value,
                })
              }
              sx={fieldSx}
            >
              <MenuItem value="">Toàn trạm</MenuItem>

              {facilities.map((facility) => (
                <MenuItem key={facility.id} value={facility.id}>
                  {facility.name}
                </MenuItem>
              ))}
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
              helperText="Ngày tổ chức hoạt động hoặc lịch tiêm chủng."
              sx={fieldSx}
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
              helperText="Để trống nếu không đặt ngày hết hạn."
              sx={fieldSx}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Section 3: Media */}
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderRadius: 2.5,
          borderColor: "#E4EBE6",
          boxShadow: "none",
        }}
      >
        <Stack spacing={0.5} sx={{ mb: 2 }}>
          <Typography fontWeight={800} fontSize={15} color="#174F40">
            Hình ảnh và tài liệu
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Hình ảnh đại diện và file đính kèm cho thông báo.
          </Typography>
        </Stack>

        <AnnouncementMediaFields
          coverImageUrl={form.coverImageUrl}
          onCoverImageUrlChange={(value) =>
            setForm({ ...form, coverImageUrl: value })
          }
          coverFile={coverFile}
          onCoverFileChange={setCoverFile}
          attachments={attachments}
          onAttachmentsChange={setAttachments}
          attachmentFiles={attachmentFiles}
          onAttachmentFilesChange={setAttachmentFiles}
        />
      </Paper>

      {/* Section 4: Content */}
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderRadius: 2.5,
          borderColor: "#E4EBE6",
          boxShadow: "none",
        }}
      >
        <Stack spacing={0.5} sx={{ mb: 2 }}>
          <Typography fontWeight={800} fontSize={15} color="#174F40">
            Nội dung thông báo
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Nội dung chi tiết mà người dân sẽ nhìn thấy.
          </Typography>
        </Stack>

        <TextField
          required
          fullWidth
          multiline
          minRows={8}
          maxRows={20}
          placeholder="Nhập nội dung chi tiết thông báo..."
          value={form.content}
          onChange={(event) =>
            setForm({
              ...form,
              content: event.target.value,
            })
          }
          sx={multilineFieldSx}
        />
      </Paper>

      {formError && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {formError}
        </Alert>
      )}
    </Stack>
  </DialogContent>

  {/* Footer actions */}
  <DialogActions
    sx={{
      px: { xs: 2, sm: 3 },
      py: 2,
      gap: 1,
      borderTop: "1px solid #E9EFEB",
      bgcolor: "#FFFFFF",
    }}
  >
    <Button
      onClick={() => setOpen(false)}
      disabled={saving}
      color="inherit"
      sx={{
        px: 2.5,
        borderRadius: 2,
        fontWeight: 700,
        textTransform: "none",
      }}
    >
      Hủy
    </Button>

    <Button
      variant="contained"
      disabled={saving}
      onClick={save}
      sx={{
        px: 3,
        minWidth: 120,
        minHeight: 42,
        borderRadius: 2,
        fontWeight: 800,
        textTransform: "none",
        boxShadow: "none",
      }}
    >
      {saving ? "Đang lưu..." : editing ? "Lưu thay đổi" : "Tạo thông báo"}
    </Button>
  </DialogActions>
</Dialog>

      <ConfirmDialog open={Boolean(confirmItem)} title="Xóa thông báo?" description={confirmItem ? `Thông báo “${confirmItem.title}” sẽ bị xóa vĩnh viễn.` : ''} confirmLabel="Xóa thông báo" loading={deleting} onCancel={() => setConfirmItem(null)} onConfirm={remove} />
    </Stack>
  );
}
