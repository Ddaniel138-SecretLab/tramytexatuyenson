export type AppRole = "ADMIN" | "STAFF";
export type AnnouncementType =
  | "VACCINATION"
  | "DISEASE_PREVENTION"
  | "HEALTH_CHECK"
  | "NUTRITION"
  | "MEDICAL_NOTICE"
  | "OTHER";
export type AnnouncementStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Facility {
  id: string;
  name: string;
  code: string | null;
  address: string | null;
  phone: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  role: AppRole;
  facility_id: string | null;
  phone: string | null;
  position: string | null;
  avatar_url: string | null;
  must_change_password: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  facility?: Pick<Facility, "id" | "name" | "code"> | null;
  email?: string | null;
}

export interface AnnouncementAttachment {
  name: string;
  url: string;
  size: number;
  mimeType: string;
}

export interface Announcement {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  type: AnnouncementType;
  facility_id: string | null;
  author_id: string | null;
  status: AnnouncementStatus;
  cover_image_url: string | null;
  attachments?: AnnouncementAttachment[];
  published_at: string | null;
  event_date: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  facility?: Pick<Facility, "id" | "name"> | null;
  author?: Pick<Profile, "id" | "full_name"> | null;
}

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ApiListResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
  message?: string;
}
