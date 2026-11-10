import { NextRequest, NextResponse } from 'next/server';
import { requireStaff } from '@/lib/auth/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { readPagination, createPagination } from '@/lib/pagination';
import { normalizeText } from '@/lib/http';
import { writeAuditLog } from '@/lib/audit/write';
import { parseEventDate } from '@/lib/announcements/date';
import type { AnnouncementStatus, AnnouncementType } from '@/types/database';

const TYPES: AnnouncementType[] = ['VACCINATION', 'DISEASE_PREVENTION', 'HEALTH_CHECK', 'NUTRITION', 'MEDICAL_NOTICE', 'OTHER'];
const STATUSES: AnnouncementStatus[] = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];

function slugify(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 180);
}

export async function GET(request: NextRequest) {
  const auth = await requireStaff();
  if (!auth.authorized) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });

  const isManager = auth.profile.role === 'MANAGER';
  const params = request.nextUrl.searchParams;
  const { page, perPage, from, to } = readPagination(params, 10, 50);
  if (!isManager && !auth.profile.facility_id) {
    return NextResponse.json({ success: true, data: [], pagination: createPagination(page, perPage, 0), message: 'Tài khoản chưa được phân công cơ sở.' });
  }

  try {
    const search = params.get('search')?.trim() ?? '';
    const status = params.get('status');
    const type = params.get('type');
    const admin = createAdminClient();

    let query = admin.from('announcements').select(
      'id,title,slug,summary,content,type,facility_id,author_id,status,cover_image_url,attachments,published_at,event_date,expires_at,created_at,updated_at,facility:facilities(id,name),author:profiles!announcements_author_id_fkey(id,full_name)',
      { count: 'exact' },
    );
    if (isManager) query = query.or(`status.eq.PUBLISHED,author_id.eq.${auth.user.id}`);
    else query = query.eq('facility_id', auth.profile.facility_id!).or(`status.eq.PUBLISHED,author_id.eq.${auth.user.id}`);

    if (search) query = query.ilike('title', `%${search}%`);
    if (status && STATUSES.includes(status as AnnouncementStatus)) query = query.eq('status', status);
    if (type && TYPES.includes(type as AnnouncementType)) query = query.eq('type', type);

    const { data, error, count } = await query.order('created_at', { ascending: false }).range(from, to);
    if (error) throw error;
    const total = count ?? 0;

    return NextResponse.json({ success: true, data: data ?? [], pagination: createPagination(page, perPage, total) });
  } catch (error) {
    console.error('Staff announcements GET:', error);
    return NextResponse.json({ success: false, message: 'Không thể tải danh sách thông báo.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireStaff();
  if (!auth.authorized) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
  const isManager = auth.profile.role === 'MANAGER';
  if (!isManager && !auth.profile.facility_id) return NextResponse.json({ success: false, message: 'Tài khoản chưa được phân công cơ sở.' }, { status: 403 });

  try {
    const body = await request.json();
    const title = normalizeText(body.title, 250);
    const content = normalizeText(body.content, 30000);
    const summary = normalizeText(body.summary, 600) || null;
    const type = body.type as AnnouncementType;
    const status = (body.status ?? 'DRAFT') as AnnouncementStatus;
    const eventDate = parseEventDate(body.eventDate);

    if (!title || !content) return NextResponse.json({ success: false, message: 'Tiêu đề và nội dung là bắt buộc.' }, { status: 400 });
    if (!TYPES.includes(type) || !STATUSES.includes(status) || status === 'ARCHIVED') return NextResponse.json({ success: false, message: 'Loại hoặc trạng thái thông báo không hợp lệ.' }, { status: 400 });
    if (!eventDate.valid) return NextResponse.json({ success: false, message: 'Ngày diễn ra không hợp lệ.' }, { status: 400 });

    const admin = createAdminClient();
    const payload = {
      title,
      slug: slugify(normalizeText(body.slug, 180) || title),
      summary,
      content,
      type,
      facility_id: isManager ? null : auth.profile.facility_id,
      author_id: auth.user.id,
      status,
      cover_image_url: normalizeText(body.coverImageUrl, 1000) || null,
      attachments: Array.isArray(body.attachments) ? body.attachments.slice(0, 10) : [],
      published_at: status === 'PUBLISHED' ? new Date().toISOString() : null,
      event_date: eventDate.value,
      expires_at: body.expiresAt ? new Date(body.expiresAt).toISOString() : null,
    };

    const { data, error } = await admin.from('announcements').insert(payload).select('*').single();
    if (error) return NextResponse.json({ success: false, message: error.code === '23505' ? 'Slug đã tồn tại.' : error.message }, { status: 400 });

    await writeAuditLog(admin, auth, { entityType: 'ANNOUNCEMENT', entityId: data.id, action: 'CREATE', newValues: payload });
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Staff announcements POST:', error);
    return NextResponse.json({ success: false, message: 'Không thể tạo thông báo.' }, { status: 500 });
  }
}
