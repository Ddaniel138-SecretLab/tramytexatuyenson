"use client";

import { Box, Pagination, Stack, Typography } from "@mui/material";

export default function PaginationBar({ page, totalPages, total, perPage, onChange }: {
  page: number; totalPages: number; total: number; perPage: number; onChange: (page: number) => void;
}) {
  if (totalPages <= 1 && total <= perPage) {
    return <Typography variant="caption" color="text.secondary">{total} kết quả</Typography>;
  }
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="center" justifyContent="space-between" sx={{ py: 2 }}>
      <Typography variant="body2" color="text.secondary">
        Hiển thị {total === 0 ? 0 : (page - 1) * perPage + 1}–{Math.min(page * perPage, total)} trong {total} kết quả
      </Typography>
      <Pagination count={Math.max(1, totalPages)} page={page} onChange={(_, value) => onChange(value)} color="primary" size="medium" showFirstButton showLastButton siblingCount={0} />
    </Stack>
  );
}
