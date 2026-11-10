
"use client";

import { useState } from "react";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

interface AdminHeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function AdminHeader({
  title,
  onMenuClick,
}: AdminHeaderProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const menuOpen = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        height: 72,
        px: { xs: 2, sm: 3 },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ minWidth: 0, flex: 1, alignItems: "center" }}
      >
        <Tooltip title="Mở menu">
          <IconButton
            onClick={onMenuClick}
            aria-label="Mở menu điều hướng"
            sx={{
              display: { xs: "inline-flex", md: "none" },
              color: "text.primary",
            }}
          >
            <MenuOutlinedIcon />
          </IconButton>
        </Tooltip>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: { xs: 16, sm: 19 },
              fontWeight: 700,
              color: "text.primary",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              display: { xs: "none", sm: "block" },
              mt: 0.25,
              fontSize: 12,
              color: "text.secondary",
            }}
          >
            Hệ thống quản lý Trạm Y tế xã Tuyên Sơn
          </Typography>
        </Box>
      </Stack>

      <Tooltip title="Tài khoản quản trị">
        <Box
          component="button"
          type="button"
          onClick={handleOpenMenu}
          aria-label="Mở menu tài khoản"
          aria-haspopup="true"
          aria-expanded={menuOpen}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 0.75,
            border: 0,
            borderRadius: 2,
            bgcolor: "transparent",
            cursor: "pointer",
            color: "text.primary",
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "primary.main",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            Q
          </Avatar>

          <Box
            sx={{
              display: { xs: "none", sm: "block" },
              textAlign: "left",
            }}
          >
            <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
              Quản trị viên
            </Typography>
            <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
              ADMIN
            </Typography>
          </Box>

          <KeyboardArrowDownOutlinedIcon
            sx={{
              display: { xs: "none", sm: "block" },
              fontSize: 18,
              color: "text.secondary",
            }}
          />
        </Box>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 220,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Avatar
              sx={{
                width: 38,
                height: 38,
                bgcolor: "primary.main",
              }}
            >
              Q
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                Quản trị viên
              </Typography>
              <Typography
                sx={{
                  fontSize: 11,
                  color: "text.secondary",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                —
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Divider />

        <MenuItem disabled sx={{ py: 1.2 }}>
          <AccountCircleOutlinedIcon
            sx={{ mr: 1.5, fontSize: 19, color: "text.secondary" }}
          />
          <Typography sx={{ fontSize: 13 }}>
            Thông tin tài khoản
          </Typography>
        </MenuItem>

        <Divider />

        <MenuItem disabled sx={{ py: 1.2 }}>
          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
            Đăng xuất (chưa kết nối)
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}
