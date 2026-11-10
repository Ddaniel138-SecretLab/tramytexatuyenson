import { Box, CircularProgress, Typography } from "@mui/material";
export default function LoadingState({ label = "Đang tải dữ liệu..." }: { label?: string }) {
  return <Box sx={{ minHeight: 180, display: "grid", placeItems: "center", gap: 1 }}><Box sx={{ textAlign: "center" }}><CircularProgress size={28} /><Typography sx={{ mt: 1.5 }} color="text.secondary" variant="body2">{label}</Typography></Box></Box>;
}
