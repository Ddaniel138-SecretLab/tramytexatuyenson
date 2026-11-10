import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isUuid, normalizeText } from "@/lib/http";
import { writeAuditLog } from "@/lib/audit/write";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isDuplicateEmailError(message: string) {
  return /already.*(registered|exist)|email.*(already|taken|exist)|user.*already|duplicate.*email/i.test(
    message,
  );
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, message: auth.message },
      { status: auth.status },
    );
  }

  const { id } = await context.params;
  if (!isUuid(id)) {
    return NextResponse.json(
      { success: false, message: "Mã cán bộ không hợp lệ." },
      { status: 400 },
    );
  }

  const admin = createAdminClient();
  const [{ data, error }, userResult] = await Promise.all([
    admin
      .from("profiles")
      .select("*,facility:facilities(id,name,code)")
      .eq("id", id)
      .in("role", ["STAFF", "MANAGER"])
      .maybeSingle(),
    admin.auth.admin.getUserById(id),
  ]);

  if (error || !data || userResult.error || !userResult.data.user) {
    return NextResponse.json(
      { success: false, message: "Không tìm thấy cán bộ." },
      { status: 404 },
    );
  }

  const email = userResult.data.user.email ?? null;
  return NextResponse.json({ success: true, data: { ...data, email } });
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, message: auth.message },
      { status: auth.status },
    );
  }

  const { id } = await context.params;
  if (!isUuid(id)) {
    return NextResponse.json(
      { success: false, message: "Mã cán bộ không hợp lệ." },
      { status: 400 },
    );
  }

  try {
    const admin = createAdminClient();
    const [{ data: old, error: profileLookupError }, userResult] =
      await Promise.all([
        admin
          .from("profiles")
          .select("*")
          .eq("id", id)
          .in("role", ["STAFF", "MANAGER"])
          .maybeSingle(),
        admin.auth.admin.getUserById(id),
      ]);

    if (profileLookupError) throw profileLookupError;
    if (!old || userResult.error || !userResult.data.user) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy cán bộ." },
        { status: 404 },
      );
    }

    const body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: "Dữ liệu cập nhật không hợp lệ." },
        { status: 400 },
      );
    }

    const oldEmail = userResult.data.user.email ?? null;
    let newEmail = oldEmail ?? "";
    let emailChanged = false;

    if (body.email !== undefined) {
      newEmail = normalizeText(body.email, 254).toLowerCase();

      if (!EMAIL_REGEX.test(newEmail)) {
        return NextResponse.json(
          { success: false, message: "Email không hợp lệ." },
          { status: 400 },
        );
      }

      emailChanged = newEmail !== (oldEmail ?? "").trim().toLowerCase();
    }

    const patch: Record<string, unknown> = {};

    if (body.fullName !== undefined) {
      patch.full_name = normalizeText(body.fullName, 150);
    }
    if (body.phone !== undefined) {
      patch.phone = normalizeText(body.phone, 30) || null;
    }
    if (body.position !== undefined) {
      patch.position = normalizeText(body.position, 120) || null;
    }
    if (body.avatarUrl !== undefined) {
      patch.avatar_url = normalizeText(body.avatarUrl, 1000) || null;
    }
    if (body.role !== undefined) {
      if (!["STAFF", "MANAGER"].includes(body.role)) {
        return NextResponse.json(
          { success: false, message: "Vai trò không hợp lệ." },
          { status: 400 },
        );
      }
      patch.role = body.role;
    }
    if (body.facilityId !== undefined) {
      patch.facility_id = body.facilityId || null;
    }
    if (body.isActive !== undefined) {
      patch.is_active = body.isActive === true;
    }

    if (patch.full_name === "") {
      return NextResponse.json(
        { success: false, message: "Họ tên không được để trống." },
        { status: 400 },
      );
    }

    if (patch.facility_id) {
      if (!isUuid(patch.facility_id)) {
        return NextResponse.json(
          { success: false, message: "Cơ sở không hợp lệ." },
          { status: 400 },
        );
      }

      const { data: facility, error: facilityError } = await admin
        .from("facilities")
        .select("id,is_active")
        .eq("id", String(patch.facility_id))
        .maybeSingle();

      if (facilityError) throw facilityError;
      if (!facility || !facility.is_active) {
        return NextResponse.json(
          {
            success: false,
            message: "Cơ sở không tồn tại hoặc đã ngừng hoạt động.",
          },
          { status: 400 },
        );
      }
    }

    // Email đăng nhập được lưu trong auth.users, không phải profiles.
    // Admin API cập nhật trực tiếp và không yêu cầu luồng xác nhận email.
    if (emailChanged) {
      const { error: emailError } = await admin.auth.admin.updateUserById(
        id,
        { email: newEmail, email_confirm: true },
      );

      if (emailError) {
        const duplicate = isDuplicateEmailError(emailError.message);
        return NextResponse.json(
          {
            success: false,
            message: duplicate
              ? "Email này đã được sử dụng bởi tài khoản khác. Vui lòng kiểm tra lại."
              : emailError.message || "Không thể cập nhật email đăng nhập.",
          },
          { status: duplicate ? 409 : 400 },
        );
      }
    }

    let updatedProfile = old;

    if (Object.keys(patch).length > 0) {
      const { data, error } = await admin
        .from("profiles")
        .update(patch)
        .eq("id", id)
        .select("*")
        .single();

      if (error) {
        // Nếu cập nhật profile thất bại, cố gắng khôi phục email Auth cũ.
        if (emailChanged && oldEmail) {
          const { error: rollbackError } =
            await admin.auth.admin.updateUserById(id, {
              email: oldEmail,
              email_confirm: true,
            });

          if (rollbackError) {
            console.error(
              "Admin staff email rollback failed:",
              rollbackError.message,
            );
          }
        }

        throw error;
      }

      updatedProfile = data;
    }

    await writeAuditLog(admin, auth, {
      entityType: "STAFF_PROFILE",
      entityId: id,
      targetUserId: id,
      action: "UPDATE",
      oldValues: { ...old, email: oldEmail },
      newValues: { ...patch, email: newEmail },
      metadata: emailChanged
        ? { emailChanged: true }
        : {},
    });

    return NextResponse.json({
      success: true,
      data: { ...updatedProfile, email: newEmail },
    });
  } catch (error) {
    console.error("Admin staff PATCH:", error);
    return NextResponse.json(
      { success: false, message: "Không thể cập nhật cán bộ." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, message: auth.message },
      { status: auth.status },
    );
  }

  const { id } = await context.params;
  if (!isUuid(id)) {
    return NextResponse.json(
      { success: false, message: "Mã cán bộ không hợp lệ." },
      { status: 400 },
    );
  }

  const admin = createAdminClient();
  const { data: old } = await admin
    .from("profiles")
    .select("*")
    .eq("id", id)
    .in("role", ["STAFF", "MANAGER"])
    .maybeSingle();

  if (!old) {
    return NextResponse.json(
      { success: false, message: "Không tìm thấy cán bộ." },
      { status: 404 },
    );
  }

  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 },
    );
  }

  await writeAuditLog(admin, auth, {
    entityType: "STAFF_PROFILE",
    entityId: id,
    targetUserId: id,
    action: "DELETE",
    oldValues: old,
  });

  return NextResponse.json({
    success: true,
    message: "Đã xóa tài khoản và hồ sơ cán bộ.",
  });
}
