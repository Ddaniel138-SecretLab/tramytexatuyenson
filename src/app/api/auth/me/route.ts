import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth/server";

export async function GET() {
  const context = await getAuthContext();
  if (!context) return NextResponse.json({ success: false, message: "Bạn chưa đăng nhập hoặc tài khoản đã bị khóa." }, { status: 401 });
  return NextResponse.json({
    success: true,
    user: { id: context.user.id, email: context.user.email },
    profile: context.profile,
  });
}
