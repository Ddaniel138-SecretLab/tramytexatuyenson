import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trạm Y tế xã Tuyên Sơn",
  description: "Cổng thông tin y tế và chăm sóc sức khỏe cộng đồng xã Tuyên Sơn.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <Providers>{children}</Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
