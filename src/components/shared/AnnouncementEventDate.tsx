import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import { Chip } from '@mui/material';
import { formatEventDate } from '@/lib/announcements/date';

type AnnouncementEventDateProps = {
  eventDate?: string | null;
  compact?: boolean;
};

export default function AnnouncementEventDate({
  eventDate,
  compact = false,
}: AnnouncementEventDateProps) {
  if (!eventDate) return null;

  return (
    <Chip
      icon={<EventAvailableOutlinedIcon />}
      size="small"
      label={`${compact ? 'Diễn ra' : 'Ngày diễn ra'}: ${formatEventDate(eventDate)}`}
      sx={{
        height: compact ? 27 : 30,
        maxWidth: '100%',
        borderRadius: 2,
        bgcolor: '#E8F5EC',
        color: '#176B48',
        border: '1px solid #CDE7D5',
        fontWeight: 800,
        fontSize: compact ? 11 : 12,
        '& .MuiChip-icon': { color: '#21845A', fontSize: 17 },
        '& .MuiChip-label': { px: 1.1 },
      }}
    />
  );
}
