
import {
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Stack,
    Switch,
    Typography,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";

interface UserPermissionsCardProps {
    isActive: boolean;
    canPostAnnouncement: boolean;
    onLock: () => void;
    onUnlock: () => void;
    onResetPassword: () => void;
}

export default function UserPermissionsCard({
    isActive,
    canPostAnnouncement,
    onLock,
    onUnlock,
    onResetPassword,
}: UserPermissionsCardProps) {
    return (
        <Card
            sx={{
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "none",
            }}
        >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
                    Quyền và bảo mật
                </Typography>

                <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>
                    Quản lý quyền truy cập của tài khoản.
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={2}>
                    <Stack
                        sx={{ alignItems: "center", justifyContent: "space-between", gap: 1 }}
                        direction="row"
                    >
                        <Typography sx={{ fontSize: 13 }}>Vai trò</Typography>
                        <Chip label="STAFF" size="small" variant="outlined" />
                    </Stack>

                    <Stack
                        direction="row"
                        sx={{ alignItems: "center", justifyContent: "space-between", gap: 1 }}

                    >
                        <Typography sx={{ fontSize: 13 }}>Trạng thái</Typography>
                        <Chip
                            label={isActive ? "Đang hoạt động" : "Đã khóa"}
                            size="small"
                            color={isActive ? "success" : "error"}
                            variant="outlined"
                        />
                    </Stack>

                    <Divider />

                    <Stack
                        direction="row"
                        sx={{ alignItems: "center", justifyContent: "space-between", gap: 2 }}

                    >
                        <Stack spacing={0.25}>
                            <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                                Quyền đăng thông báo
                            </Typography>
                            <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
                                Cho phép tài khoản tạo và quản lý thông báo.
                            </Typography>
                        </Stack>

                        <Switch checked={canPostAnnouncement} disabled />
                    </Stack>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Typography sx={{ mb: 1.5, fontSize: 13, fontWeight: 700 }}>
                    Thao tác bảo mật
                </Typography>

                <Stack spacing={1}>
                    {isActive ? (
                        <Button
                            fullWidth
                            variant="outlined"
                            color="warning"
                            startIcon={<LockOutlinedIcon />}
                            onClick={onLock}
                        >
                            Khóa tài khoản
                        </Button>
                    ) : (
                        <Button
                            fullWidth
                            variant="outlined"
                            color="success"
                            startIcon={<LockOpenOutlinedIcon />}
                            onClick={onUnlock}
                        >
                            Mở khóa tài khoản
                        </Button>
                    )}

                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<LockResetOutlinedIcon />}
                        onClick={onResetPassword}
                    >
                        Đặt lại mật khẩu
                    </Button>
                </Stack>

                <Typography
                    sx={{
                        mt: 1.5,
                        fontSize: 11,
                        color: "text.secondary",
                        lineHeight: 1.6,
                    }}
                >
                    Các thao tác hiện chỉ mô phỏng trên giao diện, chưa thay đổi tài khoản
                    thật.
                </Typography>
            </CardContent>
        </Card>
    );
}
