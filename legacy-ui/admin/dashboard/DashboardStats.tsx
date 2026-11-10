import { Box, Card, CardContent, Grid, Typography } from "@mui/material";

import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

const stats = [
    {
        label: "Tổng thông báo",
        value: "—",
        description: "Thông báo đã tạo",
        icon: CampaignOutlinedIcon,
        color: "#087C70",
        background: "#E5F3F0",
    },
    {
        label: "Cán bộ",
        value: "—",
        description: "Hồ sơ cán bộ đang hoạt động",
        icon: GroupsOutlinedIcon,
        color: "#2874B8",
        background: "#EAF2FA",
    },
    {
        label: "Cơ sở y tế",
        value: "—",
        description: "Cơ sở đang hoạt động",
        icon: LocalHospitalOutlinedIcon,
        color: "#9A6A17",
        background: "#FBF3E4",
    },
    {
        label: "Lượt truy cập",
        value: "—",
        description: "Chưa có dữ liệu thống kê",
        icon: VisibilityOutlinedIcon,
        color: "#7753A6",
        background: "#F1ECF8",
    },
];

export default function DashboardStats() {
    return (
        <Grid container spacing={2}>
            {stats.map((item) => {
                const Icon = item.icon;

                return (
                    <Grid
                        key={item.label}
                        size={{ xs: 12, sm: 6, lg: 3 }}
                    >
                        <Card
                            sx={{
                                height: "100%",
                                border: "1px solid",
                                borderColor: "divider",
                                boxShadow: "none",
                            }}
                        >
                            <CardContent sx={{ p: 2.5 }}>
                                <Box
                                    sx={{
                                        width: 44,
                                        height: 44,
                                        display: "grid",
                                        placeItems: "center",
                                        borderRadius: 2.5,
                                        color: item.color,
                                        bgcolor: item.background,
                                    }}
                                >
                                    <Icon />
                                </Box>

                                <Typography
                                    sx={{
                                        mt: 2,
                                        fontSize: 13,
                                        color: "text.secondary",
                                        fontWeight: 600,
                                    }}
                                >
                                    {item.label}
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.5,
                                        fontSize: 30,
                                        lineHeight: 1.2,
                                        fontWeight: 800,
                                        color: "text.primary",
                                    }}
                                >
                                    {item.value}
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 1,
                                        fontSize: 11,
                                        color: "text.secondary",
                                    }}
                                >
                                    {item.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
}