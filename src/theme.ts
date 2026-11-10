"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#087C70", dark: "#075B53", light: "#E5F3F0", contrastText: "#FFFFFF" },
    secondary: { main: "#2C9B7B", light: "#EAF7F1" },
    background: { default: "#F4F8F6", paper: "#FFFFFF" },
    text: { primary: "#183B35", secondary: "#657A75" },
    divider: "#E4ECE8",
    success: { main: "#23845E" },
    warning: { main: "#B7791F" },
    error: { main: "#C2413B" },
    info: { main: "#2875B8" },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"Be Vietnam Pro", sans-serif',
    fontSize: 14,
    h1: { fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.2 },
    h2: { fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.25 },
    h3: { fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.3 },
    h4: { fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.35 },
    h5: { fontWeight: 800, letterSpacing: "-0.015em" },
    h6: { fontWeight: 750 },
    subtitle1: { fontWeight: 650 },
    button: { textTransform: "none", fontWeight: 700, letterSpacing: 0 },
  },
  components: {
    MuiCssBaseline: { styleOverrides: { body: { fontFamily: '"Be Vietnam Pro", sans-serif' } } },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 11, minHeight: 42, paddingInline: 17, boxShadow: "none", fontWeight: 700 },
        sizeSmall: { minHeight: 34, paddingInline: 12, borderRadius: 9 },
        contained: { boxShadow: "0 5px 14px rgba(8,124,112,.14)", "&:hover": { boxShadow: "0 7px 18px rgba(8,124,112,.2)" } },
      },
    },
    MuiCard: { styleOverrides: { root: { border: "1px solid #E4ECE8", borderRadius: 18, boxShadow: "0 8px 30px rgba(20,65,54,0.045)" } } },
    MuiPaper: { styleOverrides: { rounded: { borderRadius: 16 } } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12, backgroundColor: "#FFFFFF", transition: "box-shadow .18s ease, border-color .18s ease",
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#DCE7E2" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#9ABDB2" },
          "&.Mui-focused": { boxShadow: "0 0 0 3px rgba(8,124,112,.09)" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderWidth: 1.5, borderColor: "#087C70" },
        },
        input: { paddingTop: 13, paddingBottom: 13, fontSize: 14 },
        inputSizeSmall: { paddingTop: 10, paddingBottom: 10 },
      },
    },
    MuiInputLabel: { styleOverrides: { root: { fontSize: 14, color: "#657A75" } } },
    MuiFormHelperText: { styleOverrides: { root: { marginLeft: 2, fontSize: 11.5 } } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 20, border: "1px solid #E4ECE8", boxShadow: "0 24px 80px rgba(15,55,47,.18)", margin: 16, backgroundImage: "none" } } },
    MuiDialogTitle: { styleOverrides: { root: { padding: "24px 26px 12px", fontWeight: 800, fontSize: 19, letterSpacing: "-.02em" } } },
    MuiDialogContent: { styleOverrides: { root: { padding: "12px 26px 22px !important" } } },
    MuiDialogActions: { styleOverrides: { root: { padding: "14px 26px 24px", gap: 10 } } },
    MuiTableCell: { styleOverrides: { head: { backgroundColor: "#F6F9F7", color: "#59716B", fontSize: 11.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".045em" }, root: { borderColor: "#EAF0ED", padding: "14px 16px" } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 8, fontWeight: 650 }, sizeSmall: { height: 25 } } },
    MuiAlert: { styleOverrides: { root: { borderRadius: 12, alignItems: "center" } } },
    MuiIconButton: { styleOverrides: { root: { borderRadius: 10 } } },
    MuiPaginationItem: { styleOverrides: { root: { borderRadius: 9, fontWeight: 650 } } },
  },
});

export default theme;
