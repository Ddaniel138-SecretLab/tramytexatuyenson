"use client";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  tone?: "danger" | "primary";
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  loading = false,
  tone = "danger",
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDanger = tone === "danger";

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onCancel}
      fullWidth
      maxWidth="xs"
      fullScreen={isMobile}
      aria-labelledby="confirm-dialog-title"
      slotProps={{
        paper: {
          sx: {
            borderRadius: { xs: 0, sm: 3.5 },
            border: { xs: 0, sm: "1px solid #E4ECE8" },
            boxShadow: "0 24px 80px rgba(15,55,47,.18)",
            backgroundImage: "none",
          },
        },
      }}
    >
      <DialogTitle id="confirm-dialog-title" sx={{ px: { xs: 2.25, sm: 3 }, pt: 2.75, pb: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 46,
              height: 46,
              flexShrink: 0,
              borderRadius: 2.5,
              display: "grid",
              placeItems: "center",
              color: isDanger ? "error.main" : "primary.main",
              bgcolor: isDanger ? "rgba(194,65,59,.09)" : "primary.light",
              "& svg": { fontSize: 25 },
            }}
          >
            <WarningAmberRoundedIcon />
          </Box>
          <Typography sx={{ fontSize: 17, fontWeight: 850, lineHeight: 1.45 }}>
            {title}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 2.25, sm: 3 }, pb: 2.5 }}>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.85 }}>
          {description}
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          px: { xs: 2.25, sm: 3 },
          py: 2,
          gap: 1,
          borderTop: "1px solid #EDF1EE",
        }}
      >
        <Button
          color="inherit"
          variant="outlined"
          onClick={onCancel}
          disabled={loading}
          sx={{ minWidth: 92 }}
        >
          {cancelLabel}
        </Button>
        <Button
          color={isDanger ? "error" : "primary"}
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
          sx={{ minWidth: 120 }}
        >
          {loading ? "Đang xử lý..." : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
