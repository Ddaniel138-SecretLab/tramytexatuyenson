import NextLink from '@/components/shared/NextLink';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import type { Announcement } from '@/types/database';
import AnnouncementEventDate from '@/components/shared/AnnouncementEventDate';
import { announcementTypeLabels, formatAnnouncementDate, getAnnouncementImagePath } from './constants';

type AnnouncementCardProps = {
  announcement: Announcement;
};

export default function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const image = getAnnouncementImagePath(announcement.type, announcement.cover_image_url);

  return (
    <Card
      component={NextLink}
      href={`/announcements/${announcement.slug}`}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        color: 'inherit',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 5px 22px rgba(22,72,57,0.035)',
        transition: 'transform .2s ease, box-shadow .2s ease',
        '&:hover': {
          transform: { md: 'translateY(-4px)' },
          boxShadow: '0 12px 28px rgba(20,60,50,0.1)',
        },
      }}
    >
      <Box
        component="img"
        src={image}
        alt={announcement.title}
        loading="lazy"
        sx={{
          display: 'block',
          width: '100%',
          height: { xs: 175, sm: 190 },
          objectFit: 'cover',
          bgcolor: '#EAF3ED',
        }}
      />

      <CardContent sx={{ p: { xs: 2.5, sm: 3 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          gap={1}
        >
          <Chip
            size="small"
            label={announcementTypeLabels[announcement.type] ?? 'Thông báo'}
            color="primary"
            variant="outlined"
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center' }}
          >
            <CalendarMonthOutlinedIcon sx={{ fontSize: 14, mr: 0.5 }} />
            Đăng ngày {formatAnnouncementDate(announcement.published_at)}
          </Typography>
        </Stack>

        {announcement.event_date && (
          <Box sx={{ mt: 1.5 }}>
            <AnnouncementEventDate eventDate={announcement.event_date} />
          </Box>
        )}

        <Typography component="h2" fontWeight={800} sx={{ mt: 2, fontSize: 18, lineHeight: 1.5 }}>
          {announcement.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 1,
            lineHeight: 1.8,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {announcement.summary || 'Xem chi tiết thông báo...'}
        </Typography>

        <Box sx={{ flex: 1 }} />
        <Typography
          color="primary.main"
          fontWeight={800}
          variant="body2"
          sx={{ mt: 2, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
        >
          Đọc tiếp <ArrowForwardOutlinedIcon sx={{ fontSize: 16 }} />
        </Typography>
      </CardContent>
    </Card>
  );
}
