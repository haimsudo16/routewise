export function formatKm(value, decimals = 1) {
  if (value === null || value === undefined) return '—';
  return `${Number(value).toFixed(decimals)} KM`;
}

export function formatMinutes(totalMinutes) {
  if (totalMinutes === null || totalMinutes === undefined) return '—';
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  if (hours <= 0) return `${minutes}MIN`;
  return `${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
}

export function formatCurrency(value, decimals = 2) {
  if (value === null || value === undefined) return '—';
  return Number(value).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function formatDate(dateString, options = { month: 'short', day: 'numeric', year: 'numeric' }) {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export function formatDateTime(dateString) {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function initialsFromName(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}
