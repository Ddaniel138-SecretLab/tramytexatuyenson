export const FACILITY_IMAGE_BY_CODE: Record<string, string> = {
  HUONG_HOA: "/facilities/huong-hoa.jpg",
  THANH_THACH: "/facilities/huong-hoa.jpg",
};

export function getFacilityImagePath(
  code?: string | null,
): string | null {
  if (!code?.trim()) {
    return null;
  }

  const normalizedCode = code.trim().toUpperCase();

  return FACILITY_IMAGE_BY_CODE[normalizedCode] ?? null;
}