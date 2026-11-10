
import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthContext } from "@/lib/auth/server";

export async function POST(request: NextRequest) {
  try {
    // Xác minh session và trạng thái tài khoản ở server.
    const context = await getAuthContext();

    if (!context) {
      return NextResponse.json(
        {
          success: false,
          message: "Bạn chưa đăng nhập hoặc tài khoản đã bị khóa.",
        },
        { status: 401 },
      );
    }

    // Chỉ tài khoản đang bị yêu cầu đổi mật khẩu mới được sử dụng API này.
    if (!context.profile.must_change_password) {
      return NextResponse.json(
        {
          success: false,
          message: "Tài khoản hiện không có yêu cầu đổi mật khẩu bắt buộc.",
        },
        { status: 403 },
      );
    }

    const body = await request.json().catch(() => null);

    const password =
      body && typeof body.newPassword === "string"
        ? body.newPassword
        : "";

    if (password.length < 10 || password.length > 128) {
      return NextResponse.json(
        {
          success: false,
          message: "Mật khẩu mới phải có từ 10 đến 128 ký tự.",
        },
        { status: 400 },
      );
    }

    // Cập nhật mật khẩu cho chính tài khoản đang đăng nhập.
    const supabase = await createClient();

    const { error: updateError } =
      await supabase.auth.updateUser({
        password,
      });

    if (updateError) {
      return NextResponse.json(
        {
          success: false,
          message: updateError.message,
        },
        { status: 400 },
      );
    }

    // Chỉ bỏ cờ bắt buộc đổi mật khẩu sau khi cập nhật mật khẩu thành công.
    const admin = createAdminClient();

    const { error: profileError } = await admin
      .from("profiles")
      .update({
        must_change_password: false,
      })
      .eq("id", context.user.id);

    if (profileError) {
      console.error(
        "Update must_change_password:",
        profileError,
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Đã đổi mật khẩu nhưng chưa cập nhật được trạng thái tài khoản. Vui lòng thử lại.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Đổi mật khẩu thành công.",
    });
  } catch (error) {
    console.error("Change password:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Không thể đổi mật khẩu.",
      },
      { status: 500 },
    );
  }
}
