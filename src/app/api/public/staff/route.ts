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
    const search = (params.get("search") ?? "").trim().toLocaleLowerCase("vi-VN");

    if (facilityId && !isUuid(facilityId)) {
      return NextResponse.json(
        { success: false, message: "Mã cơ sở không hợp lệ." },
        { status: 400 },
      );
    }

    const [{ data: facilities, error: facilitiesError }, { data: profiles, error: profilesError }] =
      await Promise.all([
        admin.from("facilities").select("id,name,code").eq("is_active", true),
        admin
          .from("profiles")
          .select("id,full_name,role,phone,position,avatar_url,facility_id")
          .in("role", ["STAFF", "MANAGER"])
          .eq("is_active", true),
      ]);

    if (facilitiesError) throw facilitiesError;
    if (profilesError) throw profilesError;

    const facilityMap = new Map((facilities ?? []).map((facility) => [facility.id, facility]));
    const activeFacilityIds = new Set(facilityMap.keys());

    const visible = (profiles ?? [])
      .filter((person) => {
        // List people assigned to active facilities and unassigned MANAGERs
        // (global managers). Unassigned STAFF are not public-facing personnel.
        const hasActiveFacility = Boolean(person.facility_id && activeFacilityIds.has(person.facility_id));
        const isUnassignedManager = person.role === "MANAGER" && !person.facility_id;
        if (!hasActiveFacility && !isUnassignedManager) return false;
        if (facilityId && person.facility_id !== facilityId) return false;
        if (!search) return true;

        const searchable = [person.full_name, person.position, person.phone]
          .filter(Boolean)
          .join(" ")
          .toLocaleLowerCase("vi-VN");
        return searchable.includes(search);
      })
      .map((person) => ({
        ...person,
        facility: person.facility_id ? facilityMap.get(person.facility_id) ?? null : null,
      }))
      .sort((a, b) => a.full_name.localeCompare(b.full_name, "vi"));

    const total = visible.length;
    return NextResponse.json({
      success: true,
      data: visible.slice(from, to + 1),
      pagination: createPagination(page, perPage, total),
    });
  } catch (error) {
    console.error("Public staff:", error);
    return NextResponse.json(
      { success: false, message: "Không thể tải danh sách nhân sự." },
      { status: 500 },
    );
  }
}
