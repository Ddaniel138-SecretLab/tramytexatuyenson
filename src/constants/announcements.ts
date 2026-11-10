import type { AnnouncementType } from '@/types/database';

export const ANNOUNCEMENT_TYPE_LABELS: Record<AnnouncementType, string> = {
  VACCINATION: 'Tiêm chủng',
  DISEASE_PREVENTION: 'Phòng chống dịch',
  HEALTH_CHECK: 'Khám sức khỏe',
  NUTRITION: 'Dinh dưỡng',
  MEDICAL_NOTICE: 'Thông tin y tế',
  OTHER: 'Khác',
};

export const ANNOUNCEMENT_TYPE_FALLBACK_IMAGES: Record<AnnouncementType, string> = {
  VACCINATION: '/announcements/types/tiem-chung.jpg',
  DISEASE_PREVENTION: '/announcements/types/phong-chong-dich.jpeg',
  HEALTH_CHECK: '/announcements/types/kham-suc-khoe.jpg',
  NUTRITION: '/announcements/types/dinh-duong.jpg',
  MEDICAL_NOTICE: '/announcements/types/thong-tin-y-te.jpg',
  OTHER: '/announcements/types/thong-tin-y-te.jpg',
};

export function getAnnouncementImagePath(
  type: AnnouncementType,
  coverImageUrl?: string | null,
): string {
  return coverImageUrl?.trim() || ANNOUNCEMENT_TYPE_FALLBACK_IMAGES[type];
}
