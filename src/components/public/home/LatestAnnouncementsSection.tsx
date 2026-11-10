'use client';

import { useEffect, useState } from 'react';
import NextLink from '@/components/shared/NextLink';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import { Box, Button, Card, CardContent, Chip, CircularProgress, Container, Grid, Stack, Typography } from '@mui/material';
import AnnouncementEventDate from '@/components/shared/AnnouncementEventDate';
import type { Announcement, AnnouncementType } from '@/types/database';
import { ANNOUNCEMENT_TYPE_LABELS, getAnnouncementImagePath } from '@/constants/announcements';
import { formatAnnouncementDate } from '../announcements/constants';

type LatestAnnouncement = Pick<Announcement, 'id' | 'title' | 'slug' | 'summary' | 'type' | 'published_at' | 'event_date' | 'cover_image_url'>;

export default function LatestAnnouncementsSection() {
  const [announcements, setAnnouncements] = useState<LatestAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadAnnouncements() {
      try {
        const response = await fetch('/api/public/announcements?page=1&perPage=3', { cache: 'no-store' });
        if (!response.ok) throw new Error('Không thể tải thông báo');
        const result = await response.json();
        if (!cancelled) setAnnouncements(result.data ?? result.announcements ?? []);
      } catch {
        if (!cancelled) setAnnouncements([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadAnnouncements();
    return () => { cancelled = true; };
  }, []);

  return (
    <Box sx={{ bgcolor: '#EDF5F2', py: { xs: 6, md: 9 } }}>
      <Container maxWidth="xl">
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { xs: 'flex-start', sm: 'flex-end' }, justifyContent: 'space-between', mb: 4 }}>
          <Box>
            <Typography sx={{ color: 'primary.main', fontSize: 13, fontWeight: 800, letterSpacing: 1 }}>TIN TỨC VÀ CẬP NHẬT</Typography>
            <Typography component="h2" sx={{ mt: 1, fontSize: { xs: 24, sm: 30, md: 34 }, fontWeight: 800, color: 'primary.dark' }}>Thông báo mới nhất</Typography>
          </Box>
          <Button component={NextLink} href="/announcements" endIcon={<ArrowForwardIcon />} sx={{ whiteSpace: 'nowrap', fontWeight: 700, textTransform: 'none' }}>
            Xem tất cả
          </Button>
        </Stack>

        {loading ? (
          <Box sx={{ py: 6, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
        ) : announcements.length === 0 ? (
          <Card>
            <CardContent sx={{ py: 5, textAlign: 'center' }}>
              <CampaignOutlinedIcon sx={{ fontSize: 42, color: 'text.secondary' }} />
              <Typography sx={{ mt: 1, fontWeight: 700 }}>Chưa có thông báo mới</Typography>
              <Typography sx={{ mt: 0.5, color: 'text.secondary', fontSize: 14 }}>Các thông tin mới sẽ được cập nhật tại đây.</Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={2.5}>
            {announcements.map((item) => (
              <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card component={NextLink} href={`/announcements/${item.slug}`} sx={{ height: '100%', display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit', borderRadius: 3, overflow: 'hidden', transition: 'transform .2s, box-shadow .2s', '&:hover': { transform: { md: 'translateY(-4px)' }, boxShadow: '0 12px 28px rgba(20,60,50,0.1)' } }}>
                  <Box component="img" src={getAnnouncementImagePath(item.type as AnnouncementType, item.cover_image_url)} alt={item.title} loading="lazy" sx={{ width: '100%', height: 176, objectFit: 'cover', bgcolor: '#EAF3ED' }} />
                  <CardContent sx={{ p: 3, flex: 1 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between' }}>
                      <Chip size="small" label={ANNOUNCEMENT_TYPE_LABELS[item.type]} color="primary" variant="outlined" />
                      <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', fontSize: 12, whiteSpace: 'nowrap' }}>
                        <CalendarMonthOutlinedIcon sx={{ fontSize: 15 }} />
                        Đăng ngày {formatAnnouncementDate(item.published_at)}
                      </Typography>
                    </Stack>
                    {item.event_date && <Box sx={{ mt: 1.5 }}><AnnouncementEventDate eventDate={item.event_date} compact /></Box>}
                    <Typography component="h3" sx={{ mt: 2, fontSize: 18, fontWeight: 800, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</Typography>
                    <Typography sx={{ mt: 1, color: 'text.secondary', fontSize: 14, lineHeight: 1.8, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.summary || 'Xem chi tiết thông báo...'}</Typography>
                    <Typography sx={{ mt: 2.5, display: 'flex', alignItems: 'center', gap: 0.5, color: 'primary.main', fontSize: 14, fontWeight: 700 }}>
                      Đọc tiếp <ArrowForwardIcon sx={{ fontSize: 17 }} />
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
