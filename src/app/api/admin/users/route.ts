import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { readPagination, createPagination } from "@/lib/pagination";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
  try {
    const params = request.nextUrl.searchParams;
    const { page, perPage } = readPagination(params, 10, 50);
    const admin = createAdminClient();
    const { data: authData, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const ids = authData.users.map((u) => u.id);
    const { data: profiles, error: profileError } = ids.length
      ? await admin.from("profiles").select("id,full_name,role,facility_id,is_active,must_change_password").in("id", ids)
      : { data: [], error: null };
    if (profileError) throw profileError;
    const map = new Map((profiles ?? []).map((p) => [p.id, p]));
    const data = authData.users.map((u) => ({ id: u.id, email: u.email ?? null, emailConfirmed: Boolean(u.email_confirmed_at), createdAt: u.created_at, profile: map.get(u.id) ?? null }));
    const total = authData.total ?? (page * perPage + (authData.nextPage ? 1 : 0));
    return NextResponse.json({ success: true, data, pagination: createPagination(page, perPage, total) });
  } catch (error) {
    console.error("Admin users GET:", error);
    return NextResponse.json({ success: false, message: "Không thể tải danh sách tài khoản." }, { status: 500 });
  }
}
