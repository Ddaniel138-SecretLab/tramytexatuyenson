import type { AnnouncementType } from '@/types/database';
import {
  ANNOUNCEMENT_TYPE_LABELS,
  ANNOUNCEMENT_TYPE_FALLBACK_IMAGES,
  getAnnouncementImagePath,
} from '@/constants/announcements';

export const announcementTypeLabels: Record<AnnouncementType, string> = ANNOUNCEMENT_TYPE_LABELS;
export const announcementTypeImages: Record<AnnouncementType, string> = ANNOUNCEMENT_TYPE_FALLBACK_IMAGES;
export { getAnnouncementImagePath };

export function formatAnnouncementDate(value?: string | null): string {
  if (!value) return 'Chưa cập nhật';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Chưa cập nhật';

  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
