import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const admin = createAdminClient();
    const { data, error } = await admin
      .from('announcements')
      .select('id,title,slug,summary,content,type,facility_id,cover_image_url,attachments,published_at,event_date,expires_at,created_at,facility:facilities(id,name)')
      .eq('slug', slug)
      .eq('status', 'PUBLISHED')
      .not('published_at', 'is', null)
      .maybeSingle();

    if (error) throw error;
    if (!data || (data.expires_at && new Date(data.expires_at).getTime() <= Date.now())) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy thông báo.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Public announcement detail:', error);
    return NextResponse.json({ success: false, message: 'Không thể tải thông báo.' }, { status: 500 });
  }
}
