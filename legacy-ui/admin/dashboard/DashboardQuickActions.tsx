import Link from "next/link";

import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Grid,
    Typography,
} from "@mui/material";

// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import EditLocationAltOutlinedIcon from "@mui/icons-material/EditLocationAltOutlined";

const actions = [
    {
        title: "Tạo thông báo",
        description: "Đăng thông tin y tế mới",
        href: "/admin/announcements/new",
        icon: PersonAddAltOutlinedIcon,
    },
    {
        title: "Thêm cán bộ",
        description: "Tạo hồ sơ cán bộ mới",
        href: "/admin/staff/new",
        icon: PersonAddAltOutlinedIcon,
    },
    {
        title: "Cập nhật cơ sở",
        description: "Chỉnh sửa thông tin cơ sở y tế",
        href: "/admin/facilities",
        icon: EditLocationAltOutlinedIcon,
    },
];

export default function DashboardQuickActions() {
    return (
        <Grid container spacing={2}>
            {actions.map((action) => {
                const Icon = action.icon;

                return (
                    <Grid
                        key={action.href}
                        size={{ xs: 12, sm: 6, lg: 4 }}
                    >
                        <Card
                            sx={{
                                height: "100%",
                                border: "1px solid",
                                borderColor: "divider",
                                boxShadow: "none",
                                transition: "border-color 0.2s, transform 0.2s",
                                "&:hover": {
                                    borderColor: "primary.main",
                                    transform: { md: "translateY(-3px)" },
                                },
                            }}
                        >
                            <Link
                                href={action.href}
                                style={{
                                    display: "block",
                                    height: "100%",
                                    color: "inherit",
                                    textDecoration: "none",
                                }}
                            >
                                <CardActionArea sx={{ height: "100%" }}>
                                    <CardContent
                                        sx={{
                                            p: 2.5,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 2,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 46,
                                                height: 46,
                                                flexShrink: 0,
                                                display: "grid",
                                                placeItems: "center",
                                                borderRadius: 2.5,
                                                bgcolor: "primary.light",
                                                color: "primary.main",
                                            }}
                                        >
                                            <Icon />
                                        </Box>

                                        <Box sx={{ minWidth: 0 }}>
                                            <Typography
                                                sx={{
                                                    fontWeight: 700,
                                                    fontSize: 14,
                                                }}
                                            >
                                                {action.title}
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    mt: 0.5,
                                                    fontSize: 12,
                                                    color: "text.secondary",
                                                }}
                                            >
                                                {action.description}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Link>
                        </Card>

                    </Grid>
                );
            })}
        </Grid>
    );
}