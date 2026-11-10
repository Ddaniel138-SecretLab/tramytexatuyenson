import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { readPagination, createPagination } from "@/lib/pagination";
import { normalizeText } from "@/lib/http";
import { writeAuditLog } from "@/lib/audit/write";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
  try {
    const admin = createAdminClient();
    const params = request.nextUrl.searchParams;
    const { page, perPage, from, to } = readPagination(params, 10, 50);
    const search = params.get("search")?.trim() ?? "";
    const status = params.get("status") ?? "all";
    let query = admin.from("facilities").select("*", { count: "exact" });
    if (search) query = query.or(`name.ilike.%${search}%,code.ilike.%${search}%,address.ilike.%${search}%`);
    if (status === "active") query = query.eq("is_active", true);
    if (status === "inactive") query = query.eq("is_active", false);
    const { data, error, count } = await query.order("created_at", { ascending: false }).range(from, to);
    if (error) throw error;
    const total = count ?? 0;
    return NextResponse.json({ success: true, data: data ?? [], pagination: createPagination(page, perPage, total) });
  } catch (error) {
    console.error("Admin facilities GET:", error);
    return NextResponse.json({ success: false, message: "Không thể tải danh sách cơ sở." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
  try {
    const body = await request.json();
    const name = normalizeText(body.name, 180);
    if (!name) return NextResponse.json({ success: false, message: "Tên cơ sở không được để trống." }, { status: 400 });
    const admin = createAdminClient();
    const payload = {
      name, code: normalizeText(body.code, 40) || null,
      address: normalizeText(body.address, 300) || null,
      phone: normalizeText(body.phone, 30) || null,
      description: normalizeText(body.description, 1000) || null,
      is_active: body.is_active !== false,
    };
    const { data, error } = await admin.from("facilities").insert(payload).select("*").single();
    if (error) return NextResponse.json({ success: false, message: error.code === "23505" ? "Mã cơ sở đã tồn tại." : error.message }, { status: 400 });
    await writeAuditLog(admin, auth, { entityType: "FACILITY", entityId: data.id, action: "CREATE", newValues: payload });
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("Admin facilities POST:", error);
    return NextResponse.json({ success: false, message: "Không thể tạo cơ sở." }, { status: 500 });
  }
}
