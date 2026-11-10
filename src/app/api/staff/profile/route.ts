import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeText } from "@/lib/http";
import { writeAuditLog } from "@/lib/audit/write";

export async function GET() {
  const auth = await requireStaff();
  if (!auth.authorized) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
  const admin = createAdminClient();
  const { data, error } = await admin.from("profiles").select("id,full_name,role,facility_id,phone,position,avatar_url,is_active,must_change_password,created_at,facility:facilities(id,name,code)").eq("id", auth.user.id).single();
  if (error) return NextResponse.json({ success: false, message: "Không thể tải hồ sơ." }, { status: 500 });
  return NextResponse.json({ success: true, data: { ...data, email: auth.user.email } });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireStaff();
  if (!auth.authorized) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
  try {
    const body = await request.json();
    const admin = createAdminClient();
    const { data: old } = await admin.from("profiles").select("id,full_name,phone,position,avatar_url").eq("id", auth.user.id).single();
    const patch = {
      full_name: body.fullName === undefined ? old?.full_name : normalizeText(body.fullName, 150),
      phone: body.phone === undefined ? old?.phone : normalizeText(body.phone, 30) || null,
      position: body.position === undefined ? old?.position : normalizeText(body.position, 120) || null,
      avatar_url: body.avatarUrl === undefined ? old?.avatar_url : normalizeText(body.avatarUrl, 1000) || null,
    };
    if (!patch.full_name) return NextResponse.json({ success: false, message: "Họ tên không được để trống." }, { status: 400 });
    const { data, error } = await admin.from("profiles").update(patch).eq("id", auth.user.id).select("id,full_name,role,facility_id,phone,position,avatar_url,is_active,facility:facilities(id,name,code)").single();
    if (error) throw error;
    await writeAuditLog(admin, auth, { entityType: "STAFF_PROFILE", entityId: auth.user.id, targetUserId: auth.user.id, action: "UPDATE_SELF", oldValues: old, newValues: patch });
    return NextResponse.json({ success: true, data: { ...data, email: auth.user.email } });
  } catch (error) {
    console.error("Staff profile PATCH:", error);
    return NextResponse.json({ success: false, message: "Không thể cập nhật hồ sơ." }, { status: 500 });
  }
}
