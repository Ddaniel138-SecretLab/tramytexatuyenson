"use client";

import { Box, Card, CardContent, Chip, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { usePagedApi } from "@/hooks/usePagedApi";
import PaginationBar from "@/components/shared/PaginationBar";
import LoadingState from "@/components/shared/LoadingState";
import EmptyState from "@/components/shared/EmptyState";
import { AdminPageHeader } from "./ui";

type UserRow = {
  id: string;
  email: string | null;
  emailConfirmed: boolean;
  createdAt: string;
  profile: {
    full_name: string;
    role: "ADMIN" | "MANAGER" | "STAFF";
    is_active: boolean;
    must_change_password: boolean;
    facility_id: string | null;
  } | null;
};

export default function AdminUsersPage() {
  const { data, pagination, page, goToPage, loading, error } = usePagedApi<UserRow>(
    "/api/admin/users",
    {},
    10,
  );

  const status = (user: UserRow) => {
    if (!user.profile) return { label: "Thiếu hồ sơ", color: "warning" as const };
    if (!user.profile.is_active) return { label: "Đã khóa", color: "default" as const };
    if (user.profile.must_change_password) return { label: "Chờ đổi mật khẩu", color: "warning" as const };
    return { label: "Hoạt động", color: "success" as const };
  };

  return (
    <Stack spacing={{ xs: 2, md: 2.5 }}>
      <AdminPageHeader
        eyebrow="BẢO MẬT VÀ TRUY CẬP"
        title="Tài khoản hệ thống"
        description="Danh sách danh tính Supabase Auth và trạng thái hồ sơ liên kết. Tạo, sửa và cấp lại mật khẩu cán bộ tại mục Quản lý cán bộ."
      />

      {error && <Card><CardContent><Typography color="error.main">{error}</Typography></CardContent></Card>}

      <Card sx={{ overflow: "hidden" }}>
        {loading ? (
          <LoadingState />
        ) : data.length === 0 ? (
          <EmptyState title="Chưa có tài khoản" />
        ) : (
          <>
            <Box sx={{ display: { xs: "block", md: "none" }, p: 1.5 }}>
              <Stack spacing={1.25}>
                {data.map((user) => {
                  const userStatus = status(user);
                  return (
                    <Card key={user.id} variant="outlined" sx={{ borderRadius: 2.5, boxShadow: "none" }}>
                      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                        <Typography fontWeight={800} sx={{ overflowWrap: "anywhere" }}>
                          {user.email ?? "Không có email"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {user.profile?.full_name ?? "Chưa có hồ sơ"}
                        </Typography>
                        <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ mt: 1.25, rowGap: 0.75 }}>
                          <Chip size="small" label={user.profile?.role ?? "Chưa gán role"} color={user.profile?.role === "ADMIN" || user.profile?.role === "MANAGER" ? "primary" : "default"} />
                          <Chip size="small" label={user.emailConfirmed ? "Đã xác minh" : "Chưa xác minh"} color={user.emailConfirmed ? "success" : "warning"} />
                          <Chip size="small" label={userStatus.label} color={userStatus.color} />
                        </Stack>
                      </CardContent>
                    </Card>
                  );
                })}
              </Stack>
            </Box>

            <TableContainer sx={{ display: { xs: "none", md: "block" } }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>Người dùng</TableCell>
                    <TableCell>Vai trò</TableCell>
                    <TableCell>Xác minh email</TableCell>
                    <TableCell>Trạng thái</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((user) => {
                    const userStatus = status(user);
                    return (
                      <TableRow key={user.id} hover>
                        <TableCell sx={{ wordBreak: "break-word" }}>{user.email ?? "—"}</TableCell>
                        <TableCell>{user.profile?.full_name ?? "Chưa có hồ sơ"}</TableCell>
                        <TableCell>
                          <Chip size="small" color={user.profile?.role === "ADMIN" || user.profile?.role === "MANAGER" ? "primary" : "default"} label={user.profile?.role ?? "Chưa gán role"} />
                        </TableCell>
                        <TableCell>
                          <Chip size="small" color={user.emailConfirmed ? "success" : "warning"} label={user.emailConfirmed ? "Đã xác minh" : "Chưa xác minh"} />
                        </TableCell>
                        <TableCell>
                          <Chip size="small" color={userStatus.color} label={userStatus.label} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
        <Box sx={{ px: { xs: 1.5, sm: 2 } }}>
          {!loading && (
            <PaginationBar
              page={page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              perPage={pagination.perPage}
              onChange={goToPage}
            />
          )}
        </Box>
      </Card>
    </Stack>
  );
}
