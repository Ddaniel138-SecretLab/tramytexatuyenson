"use client";

import Link from "next/link";

import {
    Box,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";

import { usePathname } from "next/navigation";

const navigationGroups = [
    {
        title: "TỔNG QUAN",
        items: [
            {
                label: "Dashboard",
                href: "/admin",
                icon: DashboardOutlinedIcon,
            },
        ],
    },
    {
        title: "QUẢN LÝ NỘI DUNG",
        items: [
            {
                label: "Thông báo",
                href: "/admin/announcements",
                icon: CampaignOutlinedIcon,
            },
            {
                label: "Đội ngũ cán bộ",
                href: "/admin/staff",
                icon: GroupsOutlinedIcon,
            },
            {
                label: "Cơ sở y tế",
                href: "/admin/facilities",
                icon: LocalHospitalOutlinedIcon,
            },
        ],
    },
    {
        title: "HỆ THỐNG",
        items: [
            {
                label: "Tài khoản",
                href: "/admin/users",
                icon: ManageAccountsOutlinedIcon,
            },
            {
                label: "Lịch sử hoạt động",
                href: "/admin/audit-logs",
                icon: HistoryOutlinedIcon,
            },
        ],
    },
];

type Props = {
    onNavigate?: () => void;
};

export default function AdminSidebar({ onNavigate }: Props) {
    const pathname = usePathname();

    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                bgcolor: "#FFFFFF",
            }}
        >
            <Box sx={{ px: 3, py: 3 }}>
                <Typography
                    sx={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: "primary.dark",
                    }}
                >
                    TRẠM Y TẾ
                </Typography>

                <Typography
                    sx={{
                        mt: 0.3,
                        fontSize: 12,
                        color: "text.secondary",
                    }}
                >
                    Xã Tuyên Sơn · Quản trị
                </Typography>
            </Box>

            <Divider />

            <Box sx={{ flex: 1, overflowY: "auto", py: 2 }}>
                {navigationGroups.map((group) => (
                    <Box key={group.title} sx={{ mb: 2.5 }}>
                        <Typography
                            sx={{
                                px: 3,
                                mb: 1,
                                fontSize: 10,
                                fontWeight: 800,
                                letterSpacing: 1,
                                color: "text.secondary",
                            }}
                        >
                            {group.title}
                        </Typography>

                        <List disablePadding>
                            {group.items.map((item) => {
                                const Icon = item.icon;

                                const active =
                                    item.href === "/admin"
                                        ? pathname === "/admin"
                                        : pathname === item.href ||
                                          pathname.startsWith(
                                              `${item.href}/`,
                                          );

                                return (
                                    <ListItemButton
                                        key={item.href}
                                        component={Link}
                                        href={item.href}
                                        onClick={onNavigate}
                                        selected={active}
                                        sx={{
                                            mx: 1.5,
                                            mb: 0.5,
                                            px: 1.5,
                                            py: 1.2,
                                            borderRadius: 2,
                                            color: active
                                                ? "primary.dark"
                                                : "text.secondary",
                                            "&.Mui-selected": {
                                                bgcolor: "#E5F3F0",
                                            },
                                            "&.Mui-selected:hover": {
                                                bgcolor: "#D9EEE8",
                                            },
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 38,
                                                color: "inherit",
                                            }}
                                        >
                                            <Icon fontSize="small" />
                                        </ListItemIcon>

                                        <ListItemText
                                            primary={item.label}
                                            slotProps={{
                                                primary: {
                                                    sx: {
                                                        fontSize: 13,
                                                        fontWeight: active
                                                            ? 700
                                                            : 500,
                                                    },
                                                },
                                            }}
                                        />
                                    </ListItemButton>
                                );
                            })}
                        </List>
                    </Box>
                ))}
            </Box>

            <Divider />

            <Box sx={{ px: 3, py: 2 }}>
                <Typography
                    sx={{
                        fontSize: 11,
                        color: "text.secondary",
                    }}
                >
                    Hệ thống quản lý Trạm Y tế
                </Typography>
                <Typography
                    sx={{
                        mt: 0.5,
                        fontSize: 11,
                        color: "text.disabled",
                    }}
                >
                    Phiên bản 1.0
                </Typography>
            </Box>
        </Box>
    );
}