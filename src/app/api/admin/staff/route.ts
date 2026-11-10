import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { readPagination, createPagination } from "@/lib/pagination";
import { isUuid, normalizeText } from "@/lib/http";
import { writeAuditLog } from "@/lib/audit/write";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
  try {
    const admin = createAdminClient();
    const params = request.nextUrl.searchParams;
    const { page, perPage, from, to } = readPagination(params, 10, 50);
    const search = params.get("search")?.trim() ?? "";
    const facilityId = params.get("facilityId");
    const status = params.get("status") ?? "all";
    if (facilityId && facilityId !== "unassigned" && !isUuid(facilityId)) return NextResponse.json({ success: false, message: "Mã cơ sở không hợp lệ." }, { status: 400 });
    let query = admin.from("profiles").select("id,full_name,role,facility_id,phone,position,avatar_url,must_change_password,is_active,created_at,facility:facilities(id,name,code)", { count: "exact" }).in("role", ["STAFF", "MANAGER"]);
    if (search) query = query.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%,position.ilike.%${search}%`);
    if (facilityId === "unassigned") query = query.is("facility_id", null);
    else if (facilityId) query = query.eq("facility_id", facilityId);
    if (status === "active") query = query.eq("is_active", true);
    if (status === "inactive") query = query.eq("is_active", false);
    const { data, error, count } = await query.order("created_at", { ascending: false }).range(from, to);
    if (error) throw error;
    const ids = (data ?? []).map((item) => item.id);
    const emailEntries = await Promise.all(ids.map(async (id) => {
      const { data: userData, error: userError } = await admin.auth.admin.getUserById(id);
      if (userError) throw userError;
      return [id, userData.user.email ?? null] as const;
    }));
    const emailMap = new Map(emailEntries);
    const result = (data ?? []).map((item) => ({ ...item, email: emailMap.get(item.id) ?? null }));
    const total = count ?? 0;
    return NextResponse.json({ success: true, data: result, pagination: createPagination(page, perPage, total) });
  } catch (error) {
    console.error("Admin staff GET:", error);
    return NextResponse.json({ success: false, message: "Không thể tải danh sách cán bộ." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
  try {
    const body = await request.json();
    const email = normalizeText(body.email, 254).toLowerCase();
    const fullName = normalizeText(body.fullName, 150);
    const phone = normalizeText(body.phone, 30) || null;
    const position = normalizeText(body.position, 120) || null;
    const role = body.role === "MANAGER" ? "MANAGER" : "STAFF";
    const facilityId = role === "MANAGER" || body.facilityId === null || body.facilityId === "" ? null : body.facilityId;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ success: false, message: "Email không hợp lệ." }, { status: 400 });
    if (!fullName) return NextResponse.json({ success: false, message: "Họ tên không được để trống." }, { status: 400 });
    if (facilityId && !isUuid(facilityId)) return NextResponse.json({ success: false, message: "Cơ sở không hợp lệ." }, { status: 400 });
    const admin = createAdminClient();
    if (facilityId) {
      const { data: facility } = await admin.from("facilities").select("id,is_active").eq("id", facilityId).maybeSingle();
      if (!facility || !facility.is_active) return NextResponse.json({ success: false, message: "Cơ sở không tồn tại hoặc đã ngừng hoạt động." }, { status: 400 });
    }
    const temporaryPassword = randomBytes(18).toString("base64url");
    const { data: created, error: createError } = await admin.auth.admin.createUser({ email, password: temporaryPassword, email_confirm: true, user_metadata: { full_name: fullName } });
    if (createError || !created.user) {
      const message = createError?.message ?? "Không thể tạo tài khoản.";
      const emailAlreadyUsed = /already registered|already been registered|email.*exists|user already exists/i.test(message);
      return NextResponse.json({
        success: false,
        message: emailAlreadyUsed ? "Email này đã được sử dụng. Vui lòng kiểm tra lại tài khoản cán bộ." : message,
      }, { status: emailAlreadyUsed ? 409 : 400 });
    }
    const newUser = created.user;
    const profilePayload = { id: newUser.id, full_name: fullName, role, facility_id: facilityId, phone, position, must_change_password: true, is_active: true };
    const { data: profile, error: profileError } = await admin.from("profiles").insert(profilePayload).select("*").single();
    if (profileError) {
      await admin.auth.admin.deleteUser(newUser.id);
      return NextResponse.json({ success: false, message: "Không thể tạo hồ sơ cán bộ. Tài khoản Auth đã được hoàn tác." }, { status: 500 });
    }
    await writeAuditLog(admin, auth, { entityType: "STAFF", entityId: newUser.id, targetUserId: newUser.id, action: "CREATE", newValues: { ...profilePayload, email } });
    return NextResponse.json({ success: true, message: role === "MANAGER" ? "Đã tạo tài khoản quản lý toàn trạm." : "Đã tạo tài khoản cán bộ.", data: { ...profile, email, temporaryPassword } }, { status: 201 });
  } catch (error) {
    console.error("Admin staff POST:", error);
    return NextResponse.json({ success: false, message: "Không thể tạo tài khoản cán bộ." }, { status: 500 });
  }
}
