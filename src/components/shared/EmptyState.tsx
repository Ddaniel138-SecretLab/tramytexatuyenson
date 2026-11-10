import { Box, Typography } from "@mui/material";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
export default function EmptyState({ title = "Chưa có dữ liệu", description = "Dữ liệu sẽ hiển thị tại đây khi có thông tin mới." }: { title?: string; description?: string }) {
  return <Box sx={{ py: 6, px: 2, textAlign: "center" }}><InboxOutlinedIcon sx={{ fontSize: 42, color: "text.disabled" }} /><Typography sx={{ mt: 1, fontWeight: 700 }}>{title}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>{description}</Typography></Box>;
}
