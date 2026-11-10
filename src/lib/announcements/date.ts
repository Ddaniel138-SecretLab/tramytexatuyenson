export type EventDateParseResult =
  | { valid: true; value: string | null }
  | { valid: false };

/** Validates a date-only value (YYYY-MM-DD) without applying timezone conversion. */
export function parseEventDate(value: unknown): EventDateParseResult {
  if (value === undefined || value === null || value === '') {
    return { valid: true, value: null };
  }

  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return { valid: false };
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    return { valid: false };
  }

  return { valid: true, value };
}

/** Formats SQL DATE values as dd/mm/yyyy without UTC date shifting. */
export function formatEventDate(value?: string | null): string {
  if (!value) return 'Chưa xác định';

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (match) return `${match[3]}/${match[2]}/${match[1]}`;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Chưa xác định';

  return parsed.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
