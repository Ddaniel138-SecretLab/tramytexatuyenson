import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isUuid, normalizeText } from "@/lib/http";
import { writeAuditLog } from "@/lib/audit/write";

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.authorized) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
  const { id } = await context.params;
  if (!isUuid(id)) return NextResponse.json({ success: false, message: "Mã cơ sở không hợp lệ." }, { status: 400 });
  const admin = createAdminClient();
  const { data, error } = await admin.from("facilities").select("*").eq("id", id).maybeSingle();
  if (error || !data) return NextResponse.json({ success: false, message: "Không tìm thấy cơ sở." }, { status: 404 });
  return NextResponse.json({ success: true, data });
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.authorized) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
  const { id } = await context.params;
  if (!isUuid(id)) return NextResponse.json({ success: false, message: "Mã cơ sở không hợp lệ." }, { status: 400 });
  try {
    const admin = createAdminClient();
    const { data: old } = await admin.from("facilities").select("*").eq("id", id).maybeSingle();
    if (!old) return NextResponse.json({ success: false, message: "Không tìm thấy cơ sở." }, { status: 404 });
    const body = await request.json();
    const patch: Record<string, unknown> = {};
    if (body.name !== undefined) patch.name = normalizeText(body.name, 180);
    if (body.code !== undefined) patch.code = normalizeText(body.code, 40) || null;
    if (body.address !== undefined) patch.address = normalizeText(body.address, 300) || null;
    if (body.phone !== undefined) patch.phone = normalizeText(body.phone, 30) || null;
    if (body.description !== undefined) patch.description = normalizeText(body.description, 1000) || null;
    if (body.is_active !== undefined) patch.is_active = body.is_active === true;
    if (patch.name === "") return NextResponse.json({ success: false, message: "Tên cơ sở không được để trống." }, { status: 400 });
    const { data, error } = await admin.from("facilities").update(patch).eq("id", id).select("*").single();
    if (error) return NextResponse.json({ success: false, message: error.code === "23505" ? "Mã cơ sở đã tồn tại." : error.message }, { status: 400 });
    await writeAuditLog(admin, auth, { entityType: "FACILITY", entityId: id, action: "UPDATE", oldValues: old, newValues: patch });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Admin facilities PATCH:", error);
    return NextResponse.json({ success: false, message: "Không thể cập nhật cơ sở." }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.authorized) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
  const { id } = await context.params;
  if (!isUuid(id)) return NextResponse.json({ success: false, message: "Mã cơ sở không hợp lệ." }, { status: 400 });
  const admin = createAdminClient();
  const { data: old } = await admin.from("facilities").select("*").eq("id", id).maybeSingle();
  if (!old) return NextResponse.json({ success: false, message: "Không tìm thấy cơ sở." }, { status: 404 });
  const [{ count: staffCount }, { count: noticeCount }] = await Promise.all([
    admin.from("profiles").select("id", { count: "exact", head: true }).eq("facility_id", id),
    admin.from("announcements").select("id", { count: "exact", head: true }).eq("facility_id", id),
  ]);
  if ((staffCount ?? 0) > 0 || (noticeCount ?? 0) > 0) return NextResponse.json({ success: false, message: "Cơ sở đang được cán bộ hoặc thông báo sử dụng. Hãy chuyển dữ liệu hoặc ngừng hoạt động thay vì xóa." }, { status: 409 });
  const { error } = await admin.from("facilities").delete().eq("id", id);
  if (error) return NextResponse.json({ success: false, message: "Không thể xóa cơ sở." }, { status: 500 });
  await writeAuditLog(admin, auth, { entityType: "FACILITY", entityId: id, action: "DELETE", oldValues: old });
  return NextResponse.json({ success: true, message: "Đã xóa cơ sở." });
}
