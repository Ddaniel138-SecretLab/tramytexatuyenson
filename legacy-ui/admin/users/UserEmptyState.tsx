import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";

import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";

export default function UserEmptyState() {
  return (
    <Box
      sx={{
        minHeight: 300,
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
        <ManageAccountsOutlinedIcon sx={{ fontSize: 34 }} />
      </Box>

      <Typography sx={{ mt: 2.5, fontSize: 17, fontWeight: 700 }}>
        Chưa có dữ liệu tài khoản
      </Typography>

      <Typography
        sx={{
          mt: 1,
          maxWidth: 390,
          fontSize: 13,
          lineHeight: 1.8,
          color: "text.secondary",
        }}
      >
        Danh sách tài khoản nhân viên sẽ xuất hiện tại đây sau khi kết nối dữ
        liệu. Bạn có thể tạo tài khoản mới để cấp quyền truy cập hệ thống.
      </Typography>

      <Button
        component={Link}
        href="/admin/users/new"
        variant="contained"
        startIcon={<PersonAddAltOutlinedIcon />}
        sx={{ mt: 2.5, textTransform: "none", fontWeight: 700 }}
      >
        Tạo tài khoản
      </Button>
    </Box>
  );
}