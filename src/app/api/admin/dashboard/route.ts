import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
  const admin = createAdminClient();
  try {
    const [staff, facilities, announcements, drafts, recent] = await Promise.all([
      admin.from("profiles").select("id", { count: "exact", head: true }).in("role", ["STAFF", "MANAGER"]),
      admin.from("facilities").select("id", { count: "exact", head: true }).eq("is_active", true),
      admin.from("announcements").select("id", { count: "exact", head: true }).eq("status", "PUBLISHED"),
      admin.from("announcements").select("id", { count: "exact", head: true }).eq("status", "DRAFT"),
      admin.from("announcements").select("id,title,type,status,created_at").order("created_at", { ascending: false }).limit(5),
    ]);
    for (const result of [staff, facilities, announcements, drafts, recent]) if (result.error) throw result.error;
    return NextResponse.json({ success: true, data: { staff: staff.count ?? 0, facilities: facilities.count ?? 0, publishedAnnouncements: announcements.count ?? 0, draftAnnouncements: drafts.count ?? 0, recentAnnouncements: recent.data ?? [] } });
  } catch (error) {
    console.error("Dashboard GET:", error);
    return NextResponse.json({ success: false, message: "Không thể tải số liệu tổng quan." }, { status: 500 });
  }
}
