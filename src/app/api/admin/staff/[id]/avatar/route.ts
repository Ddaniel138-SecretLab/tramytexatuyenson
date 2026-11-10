import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isUuid } from "@/lib/http";
import { writeAuditLog } from "@/lib/audit/write";

const MAX_SIZE = 5 * 1024 * 1024;
const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.authorized) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });

  const { id } = await context.params;
  if (!isUuid(id)) return NextResponse.json({ success: false, message: "Mã hồ sơ không hợp lệ." }, { status: 400 });

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) return NextResponse.json({ success: false, message: "Vui lòng chọn ảnh đại diện." }, { status: 400 });
    const extension = MIME_EXTENSIONS[file.type];
    if (!extension) return NextResponse.json({ success: false, message: "Chỉ hỗ trợ ảnh JPEG, PNG hoặc WebP." }, { status: 400 });
    if (file.size <= 0 || file.size > MAX_SIZE) return NextResponse.json({ success: false, message: "Ảnh đại diện phải có dung lượng tối đa 5 MB." }, { status: 400 });

    const admin = createAdminClient();
    const { data: profile } = await admin.from("profiles").select("id,role,avatar_url").eq("id", id).in("role", ["STAFF", "MANAGER"]).maybeSingle();
    if (!profile) return NextResponse.json({ success: false, message: "Không tìm thấy hồ sơ cán bộ." }, { status: 404 });

    const path = `${id}/${randomUUID()}.${extension}`;
    const { error: uploadError } = await admin.storage.from("staff-avatars").upload(path, file, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });
    if (uploadError) throw uploadError;

    const { data: publicData } = admin.storage.from("staff-avatars").getPublicUrl(path);
    const { data, error } = await admin.from("profiles").update({ avatar_url: publicData.publicUrl }).eq("id", id).select("id,avatar_url").single();
    if (error) throw error;

    await writeAuditLog(admin, auth, {
      entityType: "STAFF_PROFILE",
      entityId: id,
      targetUserId: id,
      action: "UPDATE_AVATAR",
      oldValues: { avatar_url: profile.avatar_url },
      newValues: { avatar_url: data.avatar_url },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Admin staff avatar upload:", error);
    return NextResponse.json({ success: false, message: "Không thể tải ảnh đại diện lên. Vui lòng thử lại." }, { status: 500 });
  }
}
