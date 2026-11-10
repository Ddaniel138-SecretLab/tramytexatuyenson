import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { readPagination, createPagination } from "@/lib/pagination";

export async function GET(request: NextRequest) {
  try {
    const admin = createAdminClient();
    const params = request.nextUrl.searchParams;
    const { page, perPage, from, to } = readPagination(params, 9, 50);
    const search = params.get("search")?.trim() ?? "";
    let query = admin.from("facilities").select("id,name,code,address,phone,description,is_active,created_at", { count: "exact" }).eq("is_active", true);
    if (search) query = query.or(`name.ilike.%${search}%,address.ilike.%${search}%`);
    const { data, error, count } = await query.order("name", { ascending: true }).range(from, to);
    if (error) throw error;
    const total = count ?? 0;
    return NextResponse.json({ success: true, data: data ?? [], pagination: createPagination(page, perPage, total) });
  } catch (error) {
    console.error("Public facilities:", error);
    return NextResponse.json({ success: false, message: "Không thể tải danh sách cơ sở." }, { status: 500 });
  }
}
