import { Box, Typography } from "@mui/material";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";

export default function AuditLogEmptyState() {
  return (
    <Box
      sx={{
        minHeight: 280,
        px: 2,
        py: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          display: "grid",
          placeItems: "center",
          borderRadius: 3,
          bgcolor: "primary.light",
          color: "primary.main",
        }}
      >
        <HistoryOutlinedIcon sx={{ fontSize: 34 }} />
      </Box>

      <Typography sx={{ mt: 2.5, fontSize: 17, fontWeight: 700 }}>
        Chưa có nhật ký hoạt động
      </Typography>

      <Typography
        sx={{
          mt: 1,
          maxWidth: 400,
          fontSize: 13,
          lineHeight: 1.8,
          color: "text.secondary",
        }}
      >
        Các thao tác quản trị sẽ được ghi nhận tại đây, bao gồm thay đổi hồ sơ,
        quản lý tài khoản và phân quyền.
      </Typography>
    </Box>
  );
}