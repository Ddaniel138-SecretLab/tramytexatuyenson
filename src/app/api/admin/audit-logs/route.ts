import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { readPagination, createPagination } from "@/lib/pagination";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
  try {
    const params = request.nextUrl.searchParams;
    const { page, perPage, from, to } = readPagination(params, 20, 50);
    const search = params.get("search")?.trim() ?? "";
    const action = params.get("action");
    const entityType = params.get("entityType");
    const admin = createAdminClient();
    let query = admin.from("audit_logs").select("*", { count: "exact" });
    if (search) query = query.or(`actor_name.ilike.%${search}%,actor_email.ilike.%${search}%,action.ilike.%${search}%,entity_type.ilike.%${search}%`);
    if (action && action !== "all") query = query.eq("action", action.toUpperCase());
    if (entityType && entityType !== "all") query = query.eq("entity_type", entityType.toUpperCase());
    const { data, error, count } = await query.order("created_at", { ascending: false }).range(from, to);
    if (error) throw error;
    const total = count ?? 0;
    return NextResponse.json({ success: true, data: data ?? [], pagination: createPagination(page, perPage, total) });
  } catch (error) {
    console.error("Audit logs GET:", error);
    return NextResponse.json({ success: false, message: "Không thể tải lịch sử hoạt động." }, { status: 500 });
  }
}
