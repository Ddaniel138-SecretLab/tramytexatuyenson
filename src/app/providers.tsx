"use client";

import type { ReactNode } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "@/theme";

export default function Providers({ children }: { children: ReactNode }) {
  return <ThemeProvider theme={theme}><CssBaseline />{children}</ThemeProvider>;
}
