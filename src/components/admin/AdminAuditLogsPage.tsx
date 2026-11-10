"use client";

import { useEffect, useState } from "react";
import { Alert, Box, Card, CardContent, Chip, Grid, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { usePagedApi } from "@/hooks/usePagedApi";
import PaginationBar from "@/components/shared/PaginationBar";
import LoadingState from "@/components/shared/LoadingState";
import EmptyState from "@/components/shared/EmptyState";
import { adminFieldSx, AdminFilterCard, AdminPageHeader } from "./ui";

type Log = {
  id: string;
  actor_name: string | null;
  actor_email: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_values: unknown;
  new_values: unknown;
  created_at: string;
};

function actionColor(action: string) {
  if (action === "DELETE") return "error" as const;
  if (action === "CREATE") return "success" as const;
  if (action === "RESET_PASSWORD") return "warning" as const;
  return "default" as const;
}

function actionLabel(action: string) {
  const labels: Record<string, string> = {
    CREATE: "Tạo mới",
    UPDATE: "Cập nhật",
    DELETE: "Xóa",
    RESET_PASSWORD: "Đặt lại mật khẩu",
  };
  return labels[action] ?? action;
}

export default function AdminAuditLogsPage() {
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("all");
  const [entityType, setEntityType] = useState("all");
  const { data, pagination, page, goToPage, setPage, loading, error } = usePagedApi<Log>(
    "/api/admin/audit-logs",
    { search, action, entityType },
    20,
  );

  useEffect(() => {
    setPage(1);
  }, [search, action, entityType, setPage]);

  return (
    <Stack spacing={{ xs: 2, md: 2.5 }}>
      <AdminPageHeader
        eyebrow="THEO DÕI HỆ THỐNG"
        title="Lịch sử hoạt động"
        description="Theo dõi người thực hiện, loại thao tác và thời điểm thay đổi dữ liệu quản trị."
      />

      {error && <Alert severity="error">{error}</Alert>}

      <AdminFilterCard>
        <Grid container spacing={1.5} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Tìm kiếm"
              placeholder="Tên, email, hành động..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              sx={adminFieldSx}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <TextField
              fullWidth
              select
              size="small"
              label="Hành động"
              value={action}
              onChange={(event) => setAction(event.target.value)}
              sx={adminFieldSx}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="CREATE">Tạo mới</MenuItem>
              <MenuItem value="UPDATE">Cập nhật</MenuItem>
              <MenuItem value="DELETE">Xóa</MenuItem>
              <MenuItem value="RESET_PASSWORD">Đặt lại mật khẩu</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <TextField
              fullWidth
              select
              size="small"
              label="Đối tượng"
              value={entityType}
              onChange={(event) => setEntityType(event.target.value)}
              sx={adminFieldSx}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="STAFF">Cán bộ</MenuItem>
              <MenuItem value="FACILITY">Cơ sở</MenuItem>
              <MenuItem value="ANNOUNCEMENT">Thông báo</MenuItem>
              <MenuItem value="USER">Tài khoản</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </AdminFilterCard>

      <Card sx={{ overflow: "hidden" }}>
        {loading ? (
          <LoadingState />
        ) : data.length === 0 ? (
          <EmptyState title="Chưa có lịch sử hoạt động" />
        ) : (
          <>
            <Box sx={{ display: { xs: "block", md: "none" }, p: 1.5 }}>
              <Stack spacing={1.25}>
                {data.map((row) => (
                  <Card key={row.id} variant="outlined" sx={{ borderRadius: 2.5, boxShadow: "none" }}>
                    <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                      <Stack direction="row" justifyContent="space-between" gap={1} alignItems="center">
                        <Typography variant="body2" fontWeight={800}>
                          {row.actor_name || "Tài khoản"}
                        </Typography>
                        <Chip size="small" label={actionLabel(row.action)} color={actionColor(row.action)} />
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        {row.actor_email || "Không có email"}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {row.entity_type} · {row.entity_id || "—"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(row.created_at).toLocaleString("vi-VN")}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Box>

            <TableContainer sx={{ display: { xs: "none", md: "block" } }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Thời gian</TableCell>
                    <TableCell>Người thực hiện</TableCell>
                    <TableCell>Thao tác</TableCell>
                    <TableCell>Đối tượng</TableCell>
                    <TableCell>Mã đối tượng</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {new Date(row.created_at).toLocaleString("vi-VN")}
                      </TableCell>
                      <TableCell>
                        {row.actor_name || "—"}
                        <Typography variant="caption" display="block" color="text.secondary">
                          {row.actor_email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip size="small" label={actionLabel(row.action)} color={actionColor(row.action)} />
                      </TableCell>
                      <TableCell>{row.entity_type}</TableCell>
                      <TableCell sx={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis" }}>
                        {row.entity_id || "—"}
                      </TableCell>
                    </TableRow>
                  ))}
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
