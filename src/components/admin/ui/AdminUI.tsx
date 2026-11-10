"use client";

import type { ReactNode } from "react";
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

/** Shared one-line input styles for filters and forms across ADMIN screens. */
export const adminFieldSx = {
  width: "100%",
  "& .MuiOutlinedInput-root": {
    minHeight: 46,
    borderRadius: 2.5,
    bgcolor: "#FFFFFF",
    transition: "box-shadow .18s ease, border-color .18s ease",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#DCE7E2",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#9ABDB2",
    },
    "&.Mui-focused": {
      boxShadow: "0 0 0 3px rgba(8,124,112,.09)",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#087C70",
      borderWidth: 1.5,
    },
  },
  "& .MuiInputBase-input": {
    boxSizing: "border-box",
    py: "11px",
    px: "14px",
    fontSize: 13.5,
  },
  "& .MuiSelect-select": {
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    minHeight: "unset !important",
    py: "11px !important",
    pr: "38px !important",
    pl: "14px !important",
    fontSize: 13.5,
  },
  "& .MuiInputLabel-root": {
    fontSize: 13,
  },
  "& .MuiFormHelperText-root": {
    mx: 0.25,
    mt: 0.75,
    lineHeight: 1.5,
  },
};

/** Multiline fields share the same border/focus treatment without a fixed height. */
export const adminMultilineFieldSx = {
  ...adminFieldSx,
  "& .MuiOutlinedInput-root": {
    minHeight: "unset",
    alignItems: "flex-start",
    borderRadius: 2.5,
    bgcolor: "#FFFFFF",
    transition: "box-shadow .18s ease, border-color .18s ease",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#DCE7E2",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#9ABDB2",
    },
    "&.Mui-focused": {
      boxShadow: "0 0 0 3px rgba(8,124,112,.09)",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#087C70",
      borderWidth: 1.5,
    },
  },
  "& .MuiInputBase-inputMultiline": {
    boxSizing: "border-box",
    py: "11px",
    px: "14px",
    fontSize: 13.5,
    lineHeight: 1.75,
  },
};

export const adminDialogPaperSx = {
  borderRadius: { xs: 0, sm: 3.5 },
  border: { xs: 0, sm: "1px solid #E4ECE8" },
  boxShadow: "0 24px 80px rgba(15,55,47,.18)",
  backgroundImage: "none",
  m: { xs: 0, sm: 2 },
  maxHeight: { xs: "100%", sm: "calc(100% - 32px)" },
};

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "stretch", sm: "center" }}
      gap={2}
    >
      <Box sx={{ minWidth: 0 }}>
        {eyebrow && (
          <Typography
            variant="overline"
            sx={{
              color: "primary.main",
              fontWeight: 800,
              letterSpacing: 1,
              lineHeight: 1.5,
            }}
          >
            {eyebrow}
          </Typography>
        )}
        <Typography
          component="h1"
          variant="h5"
          sx={{
            mt: eyebrow ? 0.35 : 0,
            fontWeight: 900,
            color: "#183F36",
            letterSpacing: "-.02em",
          }}
        >
          {title}
        </Typography>
        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.65, lineHeight: 1.75, maxWidth: 760 }}
          >
            {description}
          </Typography>
        )}
      </Box>
      {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
    </Stack>
  );
}

export function AdminFilterCard({ children }: { children: ReactNode }) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid #E7EEE9",
        boxShadow: "0 3px 16px rgba(25,65,45,.035)",
      }}
    >
      <CardContent
        sx={{
          p: { xs: 1.75, sm: 2.25 },
          "&:last-child": { pb: { xs: 1.75, sm: 2.25 } },
        }}
      >
        {children}
      </CardContent>
    </Card>
  );
}

export function AdminFormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2.75,
        borderColor: "#E4ECE8",
        boxShadow: "none",
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2, sm: 2.5 },
          "&:last-child": { pb: { xs: 2, sm: 2.5 } },
        }}
      >
        <Typography sx={{ color: "#174F40", fontWeight: 800, fontSize: 15 }}>
          {title}
        </Typography>
        {description && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 0.5, mb: 2.25, lineHeight: 1.6 }}
          >
            {description}
          </Typography>
        )}
        <Box sx={{ mt: 2.25 }}>{children}</Box>
      </CardContent>
    </Card>
  );
}

export function AdminDialogHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <Box>
      <Typography
        component="div"
        sx={{
          fontWeight: 850,
          color: "#174F40",
          fontSize: 19,
          letterSpacing: "-.02em",
        }}
      >
        {title}
      </Typography>
      {description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.6, fontSize: 12.5, lineHeight: 1.65 }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
}
