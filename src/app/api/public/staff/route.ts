import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { readPagination, createPagination } from "@/lib/pagination";
import { isUuid } from "@/lib/http";

export async function GET(request: NextRequest) {
  try {
    const admin = createAdminClient();
    const params = request.nextUrl.searchParams;
    const { page, perPage, from, to } = readPagination(params, 12, 50);
    const facilityId = params.get("facilityId");
    const search = params.get("search")?.trim() ?? "";
    if (facilityId && !isUuid(facilityId)) return NextResponse.json({ success: false, message: "Mã cơ sở không hợp lệ." }, { status: 400 });

    const { data: activeFacilities, error: facilitiesError } = await admin
      .from("facilities")
      .select("id,name,code")
      .eq("is_active", true);
    if (facilitiesError) throw facilitiesError;
    const activeFacilityIds = (activeFacilities ?? []).map((facility) => facility.id);
    if (activeFacilityIds.length === 0) {
      return NextResponse.json({ success: true, data: [], pagination: createPagination(page, perPage, 0) });
    }

    let query = admin.from("profiles")
      .select("id,full_name,role,phone,position,avatar_url,facility_id", { count: "exact" })
      .in("role", ["STAFF", "MANAGER"])
      .eq("is_active", true)
      .in("facility_id", activeFacilityIds);
    if (facilityId) query = query.eq("facility_id", facilityId);
    if (search) query = query.or(`full_name.ilike.%${search}%,position.ilike.%${search}%`);
    const { data, error, count } = await query.order("full_name", { ascending: true }).range(from, to);
    if (error) throw error;

    const facilityMap = new Map((activeFacilities ?? []).map((facility) => [facility.id, facility]));
    const visible = (data ?? []).map((person) => ({
      ...person,
      facility: person.facility_id ? facilityMap.get(person.facility_id) ?? null : null,
    }));
    const total = count ?? 0;
    return NextResponse.json({ success: true, data: visible, pagination: createPagination(page, perPage, total) });
  } catch (error) {
    console.error("Public staff:", error);
    return NextResponse.json({ success: false, message: "Không thể tải danh sách cán bộ." }, { status: 500 });
  }
}
