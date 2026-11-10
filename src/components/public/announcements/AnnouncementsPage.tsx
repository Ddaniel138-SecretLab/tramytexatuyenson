'use client';

import { useEffect, useState } from 'react';
import { Alert, Container, Grid, MenuItem, Stack, TextField } from '@mui/material';
import { usePagedApi } from '@/hooks/usePagedApi';
import type { Announcement, AnnouncementType } from '@/types/database';
import PaginationBar from '@/components/shared/PaginationBar';
import LoadingState from '@/components/shared/LoadingState';
import EmptyState from '@/components/shared/EmptyState';
import PublicPageHeader from '../shared/PublicPageHeader';
import PublicSearchField from '../shared/PublicSearchField';
import AnnouncementCard from './AnnouncementCard';
import { announcementTypeLabels } from './constants';

export function AnnouncementsPage() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const { data, pagination, page, goToPage, setPage, loading, error } =
    usePagedApi<Announcement>('/api/public/announcements', { search, type }, 9);

  useEffect(() => {
    setPage(1);
  }, [search, type, setPage]);

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, sm: 5, md: 7 } }}>
      <PublicPageHeader
        eyebrow="TIN TỨC VÀ CẬP NHẬT"
        title="Thông báo y tế"
        description="Các thông tin chính thức từ Trạm Y tế xã Tuyên Sơn và các cơ sở."
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 3 }}>
        <PublicSearchField value={search} onChange={setSearch} placeholder="Tìm thông báo..." />
        <TextField
          select
          value={type}
          onChange={(event) => setType(event.target.value)}
          size="small"
          label="Loại thông báo"
          sx={{
            minWidth: { xs: '100%', sm: 250 },
            '& .MuiOutlinedInput-root': { minHeight: 44, borderRadius: 2.5 },
          }}
        >
          <MenuItem value="">Tất cả loại</MenuItem>
          {(Object.entries(announcementTypeLabels) as [AnnouncementType, string][]).map(([value, label]) => (
            <MenuItem key={value} value={value}>{label}</MenuItem>
          ))}
        </TextField>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <LoadingState />
      ) : data.length === 0 ? (
        <EmptyState title="Chưa có thông báo" />
      ) : (
        <Grid container spacing={2.5}>
          {data.map((announcement) => (
            <Grid key={announcement.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <AnnouncementCard announcement={announcement} />
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && (
        <PaginationBar
          page={page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          perPage={pagination.perPage}
          onChange={goToPage}
        />
      )}
    </Container>
  );
}
