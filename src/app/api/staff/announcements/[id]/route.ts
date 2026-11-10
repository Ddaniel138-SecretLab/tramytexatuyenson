import { NextRequest, NextResponse } from 'next/server';
import { requireStaff } from '@/lib/auth/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isUuid, normalizeText } from '@/lib/http';
import { writeAuditLog } from '@/lib/audit/write';
import { parseEventDate } from '@/lib/announcements/date';
import type { AnnouncementStatus, AnnouncementType } from '@/types/database';

const TYPES: AnnouncementType[] = ['VACCINATION', 'DISEASE_PREVENTION', 'HEALTH_CHECK', 'NUTRITION', 'MEDICAL_NOTICE', 'OTHER'];
const STATUSES: AnnouncementStatus[] = ['DRAFT', 'PUBLISHED'];

function slugify(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 180);
}

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireStaff();
  if (!auth.authorized) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
  if (!auth.profile.facility_id) return NextResponse.json({ success: false, message: 'Tài khoản chưa được phân công cơ sở.' }, { status: 403 });

  const { id } = await context.params;
  if (!isUuid(id)) return NextResponse.json({ success: false, message: 'Mã thông báo không hợp lệ.' }, { status: 400 });

  const admin = createAdminClient();
  const { data, error } = await admin.from('announcements').select('*')
    .eq('id', id)
    .eq('facility_id', auth.profile.facility_id)
    .eq('author_id', auth.user.id)
    .maybeSingle();

  if (error || !data) return NextResponse.json({ success: false, message: 'Không tìm thấy thông báo hoặc bạn không có quyền chỉnh sửa.' }, { status: 404 });
  return NextResponse.json({ success: true, data });
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireStaff();
  if (!auth.authorized) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
  if (!auth.profile.facility_id) return NextResponse.json({ success: false, message: 'Tài khoản chưa được phân công cơ sở.' }, { status: 403 });

  const { id } = await context.params;
  if (!isUuid(id)) return NextResponse.json({ success: false, message: 'Mã thông báo không hợp lệ.' }, { status: 400 });

  try {
    const admin = createAdminClient();
    const { data: old } = await admin.from('announcements').select('*')
      .eq('id', id)
      .eq('facility_id', auth.profile.facility_id)
      .eq('author_id', auth.user.id)
      .maybeSingle();

    if (!old) return NextResponse.json({ success: false, message: 'Bạn chỉ được chỉnh sửa thông báo do chính mình tạo.' }, { status: 403 });

    const body = await request.json();
    const patch: Record<string, unknown> = {};

    if (body.title !== undefined) patch.title = normalizeText(body.title, 250);
    if (body.slug !== undefined || body.title !== undefined) patch.slug = slugify(normalizeText(body.slug ?? body.title, 180));
    if (body.summary !== undefined) patch.summary = normalizeText(body.summary, 600) || null;
    if (body.content !== undefined) patch.content = normalizeText(body.content, 30000);
    if (body.type !== undefined) {
      if (!TYPES.includes(body.type)) return NextResponse.json({ success: false, message: 'Loại thông báo không hợp lệ.' }, { status: 400 });
      patch.type = body.type;
    }
    if (body.status !== undefined) {
      if (!STATUSES.includes(body.status)) return NextResponse.json({ success: false, message: 'Trạng thái không hợp lệ.' }, { status: 400 });
      patch.status = body.status;
      patch.published_at = body.status === 'PUBLISHED' ? old.published_at ?? new Date().toISOString() : null;
    }
    if (body.coverImageUrl !== undefined) patch.cover_image_url = normalizeText(body.coverImageUrl, 1000) || null;
    if (body.attachments !== undefined) patch.attachments = Array.isArray(body.attachments) ? body.attachments.slice(0, 10) : [];
    if (body.expiresAt !== undefined) patch.expires_at = body.expiresAt ? new Date(body.expiresAt).toISOString() : null;
    if (body.eventDate !== undefined) {
      const eventDate = parseEventDate(body.eventDate);
      if (!eventDate.valid) return NextResponse.json({ success: false, message: 'Ngày diễn ra không hợp lệ.' }, { status: 400 });
      patch.event_date = eventDate.value;
    }

    const { data, error } = await admin.from('announcements').update(patch)
      .eq('id', id)
      .eq('author_id', auth.user.id)
      .select('*')
      .single();

    if (error) return NextResponse.json({ success: false, message: error.code === '23505' ? 'Slug đã tồn tại.' : error.message }, { status: 400 });

    await writeAuditLog(admin, auth, { entityType: 'ANNOUNCEMENT', entityId: id, action: 'UPDATE', oldValues: old, newValues: patch });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Staff announcements PATCH:', error);
    return NextResponse.json({ success: false, message: 'Không thể cập nhật thông báo.' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireStaff();
  if (!auth.authorized) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
  if (!auth.profile.facility_id) return NextResponse.json({ success: false, message: 'Tài khoản chưa được phân công cơ sở.' }, { status: 403 });

  const { id } = await context.params;
  if (!isUuid(id)) return NextResponse.json({ success: false, message: 'Mã thông báo không hợp lệ.' }, { status: 400 });

  const admin = createAdminClient();
  const { data: old } = await admin.from('announcements').select('*')
    .eq('id', id)
    .eq('facility_id', auth.profile.facility_id)
    .eq('author_id', auth.user.id)
    .maybeSingle();

  if (!old) return NextResponse.json({ success: false, message: 'Bạn chỉ được xóa thông báo do chính mình tạo.' }, { status: 403 });

  const { error } = await admin.from('announcements').delete().eq('id', id).eq('author_id', auth.user.id);
  if (error) return NextResponse.json({ success: false, message: 'Không thể xóa thông báo.' }, { status: 500 });

  await writeAuditLog(admin, auth, { entityType: 'ANNOUNCEMENT', entityId: id, action: 'DELETE', oldValues: old });
  return NextResponse.json({ success: true, message: 'Đã xóa thông báo.' });
}
