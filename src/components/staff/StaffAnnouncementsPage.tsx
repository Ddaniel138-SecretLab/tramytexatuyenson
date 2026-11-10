'use client';

import { useEffect, useState } from 'react';
import {
  Alert, Box, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent,
  DialogTitle, Grid, IconButton, MenuItem, Stack, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Typography,
} from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import { usePagedApi } from '@/hooks/usePagedApi';
import { apiRequest } from '@/lib/api-client';
import { uploadAnnouncementAssets } from '@/lib/storage/uploads';
import { formatEventDate } from '@/lib/announcements/date';
import { getAnnouncementImagePath } from '@/constants/announcements';
import type { Announcement, AnnouncementAttachment, AnnouncementType } from '@/types/database';
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

type FormState = {
  title: string;
  summary: string;
  content: string;
  type: AnnouncementType;
  status: 'DRAFT' | 'PUBLISHED';
  coverImageUrl: string;
  eventDate: string;
  expiresAt: string;
};

const emptyForm: FormState = {
  title: '', summary: '', content: '', type: 'OTHER', status: 'DRAFT',
  coverImageUrl: '', eventDate: '', expiresAt: '',
};
type Me = { user?: { id?: string }; profile?: { facility_id?: string | null } };
type AnnouncementRow = Announcement & { author?: { full_name: string } };

export default function StaffAnnouncementsPage() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const { data, pagination, page, goToPage, setPage, loading, error, reload } =
    usePagedApi<AnnouncementRow>('/api/staff/announcements', { search, type, status }, 10);

  const [userId, setUserId] = useState('');
  const [facilityId, setFacilityId] = useState<string | null>(null);
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

  useEffect(() => { setPage(1); }, [search, type, status, setPage]);

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((response) => response.json())
      .then((body: Me) => {
        setUserId(body.user?.id ?? '');
        setFacilityId(body.profile?.facility_id ?? null);
      })
      .catch(() => setFacilityId(null));
  }, []);

  function openForm(item?: Announcement) {
    setEditing(item ?? null);
    setForm(item ? {
      title: item.title,
      summary: item.summary ?? '',
      content: item.content,
      type: item.type,
      status: item.status === 'ARCHIVED' ? 'DRAFT' : item.status,
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
        facilityId,
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
        await apiRequest(`/api/staff/announcements/${editing.id}`, { method: 'PATCH', body: JSON.stringify(payload) });
      } else {
        await apiRequest('/api/staff/announcements', { method: 'POST', body: JSON.stringify(payload) });
      }

      setOpen(false);
      setNotice(editing ? 'Đã cập nhật thông báo.' : 'Đã tạo thông báo.');
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
      await apiRequest(`/api/staff/announcements/${confirmItem.id}`, { method: 'DELETE' });
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
      <Box component="img" src={getAnnouncementImagePath(item.type, item.cover_image_url)} alt={item.title} loading="lazy" sx={{ display: 'block', width: '100%', height: 128, objectFit: 'cover', bgcolor: '#EAF3ED' }} />
      <CardContent sx={{ p: 2.25 }}>
        <Stack direction="row" justifyContent="space-between" gap={1}>
          <Box sx={{ minWidth: 0 }}>
            <Typography fontWeight={800}>{item.title}</Typography>
            <Typography color="text.secondary" variant="caption">{item.author?.full_name ?? 'Cán bộ'}</Typography>
          </Box>
          <Chip size="small" color={item.status === 'PUBLISHED' ? 'success' : 'warning'} label={item.status === 'PUBLISHED' ? 'Đã đăng' : 'Bản nháp'} />
        </Stack>
        {item.event_date && <Box sx={{ mt: 1.5 }}><AnnouncementEventDate eventDate={item.event_date} compact /></Box>}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.5 }}>
          <Stack direction="row" gap={0.75} alignItems="center">
            <Chip size="small" variant="outlined" label={types.find((entry) => entry.value === item.type)?.label} />
            {(item.attachments?.length ?? 0) > 0 && <Chip size="small" icon={<AttachFileOutlinedIcon />} label={item.attachments?.length ?? 0} variant="outlined" />}
          </Stack>
          {item.author_id === userId && (
            <Stack direction="row">
              <IconButton size="small" onClick={() => openForm(item)} aria-label="Sửa"><EditOutlinedIcon fontSize="small" /></IconButton>
              <IconButton size="small" color="error" onClick={() => setConfirmItem(item)} aria-label="Xóa"><DeleteOutlineOutlinedIcon fontSize="small" /></IconButton>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} gap={2}>
        <Box>
          <Typography variant="h5" fontWeight={900}>Thông báo cơ sở</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Bạn có thể xem thông báo đã xuất bản của cơ sở và chỉ sửa hoặc xóa thông báo do mình tạo.</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddOutlinedIcon />} disabled={!facilityId} onClick={() => openForm()}>Tạo thông báo</Button>
      </Stack>

      {!facilityId && <Alert severity="warning">Tài khoản chưa được phân công cơ sở nên không thể tạo thông báo.</Alert>}
      {notice && <Alert severity="success" onClose={() => setNotice('')}>{notice}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <Card>
        <CardContent sx={{ p: { xs: 1.75, sm: 2.5 } }}>
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, md: 5 }}><TextField fullWidth size="small" label="Tìm kiếm" value={search} onChange={(event) => setSearch(event.target.value)} /></Grid>
            <Grid size={{ xs: 6, md: 3.5 }}>
              <TextField fullWidth select size="small" label="Loại" value={type} onChange={(event) => setType(event.target.value)}>
                <MenuItem value="">Tất cả</MenuItem>
                {types.map((entry) => <MenuItem key={entry.value} value={entry.value}>{entry.label}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 6, md: 3.5 }}>
              <TextField fullWidth select size="small" label="Trạng thái" value={status} onChange={(event) => setStatus(event.target.value)}>
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="PUBLISHED">Đã xuất bản</MenuItem>
                <MenuItem value="DRAFT">Bản nháp của tôi</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        {loading ? <LoadingState /> : data.length === 0 ? (
          <EmptyState title="Chưa có thông báo" description="Thông báo đã xuất bản của cơ sở sẽ xuất hiện tại đây." />
        ) : (
          <>
            <Box sx={{ display: { xs: 'block', md: 'none' }, p: 1.5 }}><Stack spacing={1.25}>{data.map(itemCard)}</Stack></Box>
            <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
              <Table>
                <TableHead><TableRow><TableCell>Tiêu đề</TableCell><TableCell>Loại</TableCell><TableCell>Ngày diễn ra</TableCell><TableCell>Người tạo</TableCell><TableCell>Trạng thái</TableCell><TableCell align="right">Thao tác</TableCell></TableRow></TableHead>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Box component="img" src={getAnnouncementImagePath(item.type, item.cover_image_url)} alt="" sx={{ width: 48, height: 40, objectFit: 'cover', borderRadius: 1.5, bgcolor: '#EAF3ED' }} />
                          <Box><Typography fontWeight={700}>{item.title}</Typography><Typography variant="caption" color="text.secondary">{item.slug}</Typography></Box>
                        </Stack>
                      </TableCell>
                      <TableCell>{types.find((entry) => entry.value === item.type)?.label}</TableCell>
                      <TableCell>{item.event_date ? formatEventDate(item.event_date) : '—'}</TableCell>
                      <TableCell>{item.author?.full_name ?? '—'}</TableCell>
                      <TableCell><Chip size="small" label={item.status === 'PUBLISHED' ? 'Đã đăng' : 'Bản nháp'} color={item.status === 'PUBLISHED' ? 'success' : 'warning'} /></TableCell>
                      <TableCell align="right">
                        {item.author_id === userId && <>
                          <IconButton onClick={() => openForm(item)}><EditOutlinedIcon /></IconButton>
                          <IconButton color="error" onClick={() => setConfirmItem(item)}><DeleteOutlineOutlinedIcon /></IconButton>
                        </>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
        <PaginationBar page={page} totalPages={pagination.totalPages} total={pagination.total} perPage={pagination.perPage} onChange={goToPage} />
      </Card>

      <Dialog open={open} onClose={() => !saving && setOpen(false)} fullWidth maxWidth="md" scroll="paper">
        <DialogTitle>{editing ? 'Chỉnh sửa thông báo' : 'Tạo thông báo'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <TextField required fullWidth label="Tiêu đề" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
            <TextField fullWidth label="Tóm tắt" multiline minRows={2} value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} />
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField select fullWidth label="Loại" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as AnnouncementType })}>
                  {types.map((entry) => <MenuItem key={entry.value} value={entry.value}>{entry.label}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField select fullWidth label="Trạng thái" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as FormState['status'] })}>
                  <MenuItem value="DRAFT">Bản nháp</MenuItem><MenuItem value="PUBLISHED">Xuất bản</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth type="date" label="Ngày diễn ra" value={form.eventDate} onChange={(event) => setForm({ ...form, eventDate: event.target.value })} slotProps={{ inputLabel: { shrink: true } }} helperText="Ngày diễn ra hoạt động/lịch hẹn; để trống nếu không áp dụng." />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth type="date" label="Ngày hết hạn hiển thị" value={form.expiresAt} onChange={(event) => setForm({ ...form, expiresAt: event.target.value })} slotProps={{ inputLabel: { shrink: true } }} />
              </Grid>
            </Grid>
            <AnnouncementMediaFields coverImageUrl={form.coverImageUrl} onCoverImageUrlChange={(value) => setForm({ ...form, coverImageUrl: value })} coverFile={coverFile} onCoverFileChange={setCoverFile} attachments={attachments} onAttachmentsChange={setAttachments} attachmentFiles={attachmentFiles} onAttachmentFilesChange={setAttachmentFiles} />
            <TextField required fullWidth multiline minRows={8} label="Nội dung" value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} />
            {formError && <Alert severity="error">{formError}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={save} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={Boolean(confirmItem)} title="Xóa thông báo?" description={confirmItem ? `Thông báo “${confirmItem.title}” sẽ bị xóa vĩnh viễn.` : ''} confirmLabel="Xóa thông báo" loading={deleting} onCancel={() => setConfirmItem(null)} onConfirm={remove} />
    </Stack>
  );
}
