"use client";

import { Suspense, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import {
    Box,
    Drawer,
} from "@mui/material";

import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

type Props = {
    children: ReactNode;
};

const SIDEBAR_WIDTH = 260;

function getPageTitle(pathname: string) {
    const routes = [
        { href: "/admin", title: "Dashboard" },
        { href: "/admin/announcements", title: "Quản lý thông báo" },
        { href: "/admin/staff", title: "Quản lý cán bộ" },
        { href: "/admin/facilities", title: "Quản lý cơ sở y tế" },
        { href: "/admin/users", title: "Quản lý tài khoản" },
        { href: "/admin/audit-logs", title: "Lịch sử hoạt động" },
    ];

    const matched = routes
        .filter((route) => {
            if (route.href === "/admin") {
                return pathname === route.href;
            }

            return (
                pathname === route.href ||
                pathname.startsWith(`${route.href}/`)
            );
        })
        .sort((a, b) => b.href.length - a.href.length)[0];

    return matched?.title ?? "Quản trị hệ thống";
}

function AdminShellContent({ children }: Props) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const title = getPageTitle(pathname);

    const closeMobileMenu = () => setMobileOpen(false);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                bgcolor: "#F5F8F7",
            }}
        >
            <Box
                component="aside"
                sx={{
                    width: SIDEBAR_WIDTH,
                    flexShrink: 0,
                    display: { xs: "none", md: "block" },
                }}
            >
                <Box
                    sx={{
                        width: SIDEBAR_WIDTH,
                        height: "100vh",
                        position: "fixed",
                        top: 0,
                        left: 0,
                        borderRight: "1px solid",
                        borderColor: "divider",
                        zIndex: (theme) => theme.zIndex.drawer,
                    }}
                >
                    <AdminSidebar />
                </Box>
            </Box>

            <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={closeMobileMenu}
                sx={{
                    display: { xs: "block", md: "none" },
                    "& .MuiDrawer-paper": {
                        width: SIDEBAR_WIDTH,
                        boxSizing: "border-box",
                    },
                }}
            >
                <AdminSidebar onNavigate={closeMobileMenu} />
            </Drawer>

            <Box
                sx={{
                    flex: 1,
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <AdminHeader
                    title={title}
                    onMenuClick={() => setMobileOpen(true)}
                />

                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        width: "100%",
                        maxWidth: 1600,
                        mx: "auto",
                        p: { xs: 2, sm: 3, md: 4 },
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
}

export default function AdminShell({ children }: Props) {
    return (
        <Suspense
            fallback={
                <Box
                    sx={{
                        minHeight: "100vh",
                        bgcolor: "#F5F8F7",
                    }}
                />
            }
        >
            <AdminShellContent>{children}</AdminShellContent>
        </Suspense>
    );
}