import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isUuid, normalizeText } from "@/lib/http";
import { writeAuditLog } from "@/lib/audit/write";

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.authorized) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
  const { id } = await context.params;
  if (!isUuid(id)) return NextResponse.json({ success: false, message: "Mã cán bộ không hợp lệ." }, { status: 400 });
  const admin = createAdminClient();
  const [{ data, error }, userResult] = await Promise.all([
    admin.from("profiles").select("*,facility:facilities(id,name,code)").eq("id", id).in("role", ["STAFF", "MANAGER"]).maybeSingle(),
    admin.auth.admin.getUserById(id),
  ]);
  if (error || !data) return NextResponse.json({ success: false, message: "Không tìm thấy cán bộ." }, { status: 404 });
  const email = userResult.data?.user?.email ?? null;
  return NextResponse.json({ success: true, data: { ...data, email } });
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.authorized) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
  const { id } = await context.params;
  if (!isUuid(id)) return NextResponse.json({ success: false, message: "Mã cán bộ không hợp lệ." }, { status: 400 });
  try {
    const admin = createAdminClient();
    const { data: old } = await admin.from("profiles").select("*").eq("id", id).in("role", ["STAFF", "MANAGER"]).maybeSingle();
    if (!old) return NextResponse.json({ success: false, message: "Không tìm thấy cán bộ." }, { status: 404 });
    const body = await request.json();
    const patch: Record<string, unknown> = {};
    if (body.fullName !== undefined) patch.full_name = normalizeText(body.fullName, 150);
    if (body.phone !== undefined) patch.phone = normalizeText(body.phone, 30) || null;
    if (body.position !== undefined) patch.position = normalizeText(body.position, 120) || null;
    if (body.avatarUrl !== undefined) patch.avatar_url = normalizeText(body.avatarUrl, 1000) || null;
    if (body.role !== undefined) { if (!["STAFF", "MANAGER"].includes(body.role)) return NextResponse.json({ success: false, message: "Vai trò không hợp lệ." }, { status: 400 }); patch.role = body.role; }
    if (body.facilityId !== undefined || patch.role === "MANAGER") patch.facility_id = patch.role === "MANAGER" ? null : body.facilityId || null;
    if (body.isActive !== undefined) patch.is_active = body.isActive === true;
    if (patch.full_name === "") return NextResponse.json({ success: false, message: "Họ tên không được để trống." }, { status: 400 });
    if (patch.facility_id) {
      if (!isUuid(patch.facility_id)) return NextResponse.json({ success: false, message: "Cơ sở không hợp lệ." }, { status: 400 });
      const { data: facility } = await admin.from("facilities").select("id,is_active").eq("id", String(patch.facility_id)).maybeSingle();
      if (!facility || !facility.is_active) return NextResponse.json({ success: false, message: "Cơ sở không tồn tại hoặc đã ngừng hoạt động." }, { status: 400 });
    }
    const { data, error } = await admin.from("profiles").update(patch).eq("id", id).select("*").single();
    if (error) throw error;
    await writeAuditLog(admin, auth, { entityType: "STAFF_PROFILE", entityId: id, targetUserId: id, action: "UPDATE", oldValues: old, newValues: patch });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Admin staff PATCH:", error);
    return NextResponse.json({ success: false, message: "Không thể cập nhật cán bộ." }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.authorized) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
  const { id } = await context.params;
  if (!isUuid(id)) return NextResponse.json({ success: false, message: "Mã cán bộ không hợp lệ." }, { status: 400 });
  const admin = createAdminClient();
  const { data: old } = await admin.from("profiles").select("*").eq("id", id).in("role", ["STAFF", "MANAGER"]).maybeSingle();
  if (!old) return NextResponse.json({ success: false, message: "Không tìm thấy cán bộ." }, { status: 404 });
  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  await writeAuditLog(admin, auth, { entityType: "STAFF_PROFILE", entityId: id, targetUserId: id, action: "DELETE", oldValues: old });
  return NextResponse.json({ success: true, message: "Đã xóa tài khoản và hồ sơ cán bộ." });
}
