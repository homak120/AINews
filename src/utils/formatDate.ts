/**
 * Formats an ISO date string as "Mar 31, 2026".
 */
export function formatDate(isoDate: string): string {
  const parts = isoDate.split('-').map(Number);
  const date = new Date(parts[0]!, parts[1]! - 1, parts[2]!);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
