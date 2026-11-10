import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ success: false, message: "Bạn chưa đăng nhập." }, { status: 401 });
    const body = await request.json();
    const password = typeof body.newPassword === "string" ? body.newPassword : "";
    if (password.length < 10 || password.length > 128) return NextResponse.json({ success: false, message: "Mật khẩu mới phải có ít nhất 10 ký tự." }, { status: 400 });

    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) return NextResponse.json({ success: false, message: updateError.message }, { status: 400 });

    const admin = createAdminClient();
    const { error } = await admin.from("profiles").update({ must_change_password: false }).eq("id", user.id);
    if (error) return NextResponse.json({ success: false, message: "Đã đổi mật khẩu nhưng chưa cập nhật được trạng thái tài khoản. Vui lòng thử lại." }, { status: 500 });
    return NextResponse.json({ success: true, message: "Đổi mật khẩu thành công." });
  } catch (error) {
    console.error("Change password:", error);
    return NextResponse.json({ success: false, message: "Không thể đổi mật khẩu." }, { status: 500 });
  }
}
