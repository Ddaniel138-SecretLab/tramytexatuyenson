import { createClient } from "@/lib/supabase/client";
import type { AnnouncementAttachment } from "@/types/database";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_PDF_SIZE = 10 * 1024 * 1024;
const MAX_ATTACHMENTS = 10;

function safeFileName(name: string) {
  return name.normalize("NFC").replace(/[^\p{L}\p{N}._-]+/gu, "-").slice(-100) || "file";
}

function extension(file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext && /^[a-z0-9]{1,8}$/.test(ext)) return ext;
  if (file.type === "image/jpeg") return "jpg";
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  if (file.type === "application/pdf") return "pdf";
  return "bin";
}

async function uploadPublicFile(bucket: string, path: string, file: File) {
  const supabase = createClient();
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(error.message || `Không thể tải ${file.name}.`);
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadProfileAvatar(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("Vui lòng chọn file ảnh.");
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("Chỉ hỗ trợ ảnh JPEG, PNG hoặc WebP.");
  if (file.size > MAX_IMAGE_SIZE) throw new Error("Ảnh đại diện không được vượt quá 5 MB.");

  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
  const path = `${user.id}/${crypto.randomUUID()}.${extension(file)}`;
  return uploadPublicFile("staff-avatars", path, file);
}

export async function uploadAnnouncementAssets(input: {
  facilityId: string | null;
  coverImageUrl: string;
  coverFile: File | null;
  attachments: AnnouncementAttachment[];
  attachmentFiles: File[];
}) {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
  if (input.attachmentFiles.length + input.attachments.length > MAX_ATTACHMENTS) {
    throw new Error(`Mỗi thông báo chỉ được đính kèm tối đa ${MAX_ATTACHMENTS} file PDF.`);
  }

  const scope = input.facilityId || "admin";
  let coverImageUrl = input.coverImageUrl;
  if (input.coverFile) {
    const file = input.coverFile;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("Ảnh thông báo chỉ hỗ trợ JPEG, PNG hoặc WebP.");
    if (file.size > MAX_IMAGE_SIZE) throw new Error("Ảnh thông báo không được vượt quá 5 MB.");
    const path = `${scope}/${user.id}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
    coverImageUrl = await uploadPublicFile("announcement-images", path, file);
  }

  const newAttachments: AnnouncementAttachment[] = [];
  for (const file of input.attachmentFiles) {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      throw new Error(`${file.name}: chỉ hỗ trợ tài liệu PDF.`);
    }
    if (file.size > MAX_PDF_SIZE) throw new Error(`${file.name}: dung lượng vượt quá 10 MB.`);
    const path = `${scope}/${user.id}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
    const url = await uploadPublicFile("announcement-attachments", path, file);
    newAttachments.push({ name: file.name, url, size: file.size, mimeType: file.type || "application/pdf" });
  }

  return { coverImageUrl, attachments: [...input.attachments, ...newAttachments] };
}
