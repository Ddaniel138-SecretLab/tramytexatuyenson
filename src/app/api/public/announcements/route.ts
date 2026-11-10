import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { readPagination, createPagination } from '@/lib/pagination';
import type { AnnouncementType } from '@/types/database';

const TYPES: AnnouncementType[] = ['VACCINATION', 'DISEASE_PREVENTION', 'HEALTH_CHECK', 'NUTRITION', 'MEDICAL_NOTICE', 'OTHER'];

export async function GET(request: NextRequest) {
  try {
    const admin = createAdminClient();
    const params = request.nextUrl.searchParams;
    const { page, perPage, from, to } = readPagination(params, 9, 50);
    const search = params.get('search')?.trim() ?? '';
    const type = params.get('type');

    let query = admin
      .from('announcements')
      .select('id,title,slug,summary,type,facility_id,cover_image_url,published_at,event_date,created_at', { count: 'exact' })
      .eq('status', 'PUBLISHED')
      .not('published_at', 'is', null);

    if (search) query = query.ilike('title', `%${search}%`);
    if (type && TYPES.includes(type as AnnouncementType)) query = query.eq('type', type);

    const now = new Date().toISOString();
    query = query.or(`expires_at.is.null,expires_at.gt.${now}`);

    const { data, error, count } = await query
      .order('published_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    const total = count ?? 0;

    return NextResponse.json({
      success: true,
      data: data ?? [],
      pagination: createPagination(page, perPage, total),
    });
  } catch (error) {
    console.error('Public announcements:', error);
    return NextResponse.json({ success: false, message: 'Không thể tải danh sách thông báo.' }, { status: 500 });
  }
}
