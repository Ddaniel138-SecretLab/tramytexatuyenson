import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isUuid } from "@/lib/http";
import { writeAuditLog } from "@/lib/audit/write";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.authorized) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
  const { id } = await context.params;
  if (!isUuid(id)) return NextResponse.json({ success: false, message: "Mã cán bộ không hợp lệ." }, { status: 400 });
  const admin = createAdminClient();
  const { data: profile } = await admin.from("profiles").select("id,full_name,role").eq("id", id).in("role", ["STAFF", "MANAGER"]).maybeSingle();
  if (!profile) return NextResponse.json({ success: false, message: "Không tìm thấy cán bộ." }, { status: 404 });
  const temporaryPassword = randomBytes(18).toString("base64url");
  const { error: passwordError } = await admin.auth.admin.updateUserById(id, { password: temporaryPassword });
  if (passwordError) return NextResponse.json({ success: false, message: passwordError.message }, { status: 400 });
  const { error: profileError } = await admin.from("profiles").update({ must_change_password: true }).eq("id", id);
  if (profileError) return NextResponse.json({ success: false, message: "Đã đặt mật khẩu tạm nhưng chưa cập nhật được trạng thái bắt buộc đổi mật khẩu." }, { status: 500 });
  await writeAuditLog(admin, auth, { entityType: "STAFF", entityId: id, targetUserId: id, action: "RESET_PASSWORD", metadata: { must_change_password: true } });
  return NextResponse.json({ success: true, message: "Đã cấp mật khẩu tạm. Cán bộ phải đổi mật khẩu khi đăng nhập.", temporaryPassword });
}
