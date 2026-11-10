"use client";

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";

interface AnnouncementPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  category: string;
  summary: string;
  content: string;
  imageUrl: string;
}

const categoryLabels: Record<string, string> = {
  announcement: "Thông báo",
  news: "Tin tức",
  health: "Hoạt động y tế",
};

export default function AnnouncementPreviewDialog({
  open,
  onClose,
  title,
  category,
  summary,
  content,
  imageUrl,
}: AnnouncementPreviewDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <CampaignOutlinedIcon color="primary" />
          <Typography sx={{ fontWeight: 700 }}>
            Xem trước thông báo
          </Typography>
        </Stack>

        <Button
          size="small"
          color="inherit"
          onClick={onClose}
          startIcon={<CloseOutlinedIcon />}
        >
          Đóng
        </Button>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ maxWidth: 760, mx: "auto" }}>
          {imageUrl ? (
            <Box
              component="img"
              src={imageUrl}
              alt={title || "Ảnh thông báo"}
              sx={{
                width: "100%",
                aspectRatio: "16 / 9",
                objectFit: "cover",
                borderRadius: 2,
                mb: 3,
              }}
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                aspectRatio: "16 / 9",
                borderRadius: 2,
                bgcolor: "action.hover",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
                mb: 3,
              }}
            >
              <ImageOutlinedIcon sx={{ fontSize: 42 }} />
              <Typography sx={{ mt: 1, fontSize: 13 }}>
                Chưa có ảnh đại diện
              </Typography>
            </Box>
          )}

          <Chip
            label={categoryLabels[category] ?? category}
            color="primary"
            size="small"
            sx={{ mb: 2 }}
          />

          <Typography
            sx={{
              fontSize: { xs: 22, sm: 30 },
              fontWeight: 800,
              lineHeight: 1.35,
              color: "text.primary",
              overflowWrap: "anywhere",
            }}
          >
            {title || "Tiêu đề thông báo"}
          </Typography>

          <Typography
            sx={{
              mt: 2,
              fontSize: 15,
              fontWeight: 600,
              color: "text.secondary",
              lineHeight: 1.8,
              whiteSpace: "pre-wrap",
            }}
          >
            {summary || "Chưa có mô tả ngắn."}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography
            sx={{
              fontSize: 14,
              lineHeight: 2,
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
            }}
          >
            {content || "Chưa có nội dung thông báo."}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="contained">
          Tiếp tục chỉnh sửa
        </Button>
      </DialogActions>
    </Dialog>
  );
}