import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import { Box, Button, Stack, Typography } from '@mui/material';
import type { AnnouncementAttachment } from '@/types/database';

type AnnouncementAttachmentsProps = {
  attachments: AnnouncementAttachment[];
};

export default function AnnouncementAttachments({ attachments }: AnnouncementAttachmentsProps) {
  if (attachments.length === 0) return null;

  return (
    <Box sx={{ mt: 4, p: { xs: 2, sm: 2.5 }, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FAFCFB' }}>
      <Typography fontWeight={800} sx={{ mb: 1.5 }}>Tài liệu đính kèm</Typography>
      <Stack spacing={1}>
        {attachments.map((file) => {
          const isPdf = file.mimeType === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
          const FileIcon = isPdf ? PictureAsPdfOutlinedIcon : InsertDriveFileOutlinedIcon;

          return (
            <Stack
              key={file.url}
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              spacing={1.25}
              sx={{ p: 1.25, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
            >
              <Stack direction="row" alignItems="center" spacing={1.25} sx={{ flex: 1, minWidth: 0 }}>
                <FileIcon color={isPdf ? 'error' : 'action'} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography fontSize={13} fontWeight={700} sx={{ overflowWrap: 'anywhere' }}>{file.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {file.size > 0 ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Tệp đính kèm'}
                  </Typography>
                </Box>
              </Stack>
              <Button
                component="a"
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                variant="outlined"
                startIcon={<DownloadOutlinedIcon />}
                sx={{ alignSelf: { xs: 'flex-end', sm: 'center' }, whiteSpace: 'nowrap' }}
              >
                Tải xuống
              </Button>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
}
