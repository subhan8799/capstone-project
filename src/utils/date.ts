export function yearFromDate(dateString?: string): string {
  if (!dateString) return 'N/A';
  return new Date(dateString).getFullYear().toString();
}

export function formatAccountDate(dateString?: string | null): string {
  if (!dateString) return 'Unknown';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
}