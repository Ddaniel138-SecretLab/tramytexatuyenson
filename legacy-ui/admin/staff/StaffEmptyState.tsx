"use client";

import { Box, Button, Typography } from "@mui/material";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import Link from "next/link";

export default function StaffEmptyState() {
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
                <GroupsOutlinedIcon sx={{ fontSize: 32 }} />
            </Box>

            <Typography
                sx={{
                    mt: 2.5,
                    fontSize: 17,
                    fontWeight: 700,
                    color: "text.primary",
                }}
            >
                Chưa có dữ liệu cán bộ
            </Typography>

            <Typography
                sx={{
                    mt: 1,
                    maxWidth: 380,
                    fontSize: 13,
                    lineHeight: 1.8,
                    color: "text.secondary",
                }}
            >
                Danh sách cán bộ sẽ được hiển thị tại đây sau khi kết nối dữ liệu.
                Bạn có thể tiếp tục xây dựng hồ sơ cán bộ mới.
            </Typography>

            <Button
                component={Link}
                href="/admin/staff/new"
                variant="contained"
                startIcon={<PersonAddAltOutlinedIcon />}
                sx={{ mt: 2.5, textTransform: "none", fontWeight: 700 }}
            >
                Thêm cán bộ
            </Button>
        </Box>
    );
}