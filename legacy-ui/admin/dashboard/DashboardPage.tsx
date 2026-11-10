import { Box, Stack, Typography } from "@mui/material";

import DashboardStats from "./DashboardStats";
import DashboardQuickActions from "./DashboardQuickActions";
import RecentAnnouncements from "./RecentAnnouncements";

export default function DashboardPage() {
    return (
        <Stack spacing={4}>
            <Box>
                <Typography
                    component="h1"
                    sx={{
                        fontSize: { xs: 22, sm: 26 },
                        fontWeight: 800,
                        color: "text.primary",
                    }}
                >
                    Tổng quan hệ thống
                </Typography>

                <Typography
                    sx={{
                        mt: 0.8,
                        fontSize: 13,
                        color: "text.secondary",
                        lineHeight: 1.7,
                    }}
                >
                    Theo dõi và quản lý hoạt động của Trạm Y tế xã Tuyên Sơn.
                </Typography>
            </Box>

            <Box>
                <Typography
                    sx={{
                        mb: 2,
                        fontSize: 15,
                        fontWeight: 800,
                    }}
                >
                    Thống kê tổng quan
                </Typography>

                <DashboardStats />
            </Box>

            <Box>
                <Typography
                    sx={{
                        mb: 2,
                        fontSize: 15,
                        fontWeight: 800,
                    }}
                >
                    Thao tác nhanh
                </Typography>

                <DashboardQuickActions />
            </Box>

            <RecentAnnouncements />
        </Stack>
    );
}