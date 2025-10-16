export function resolveApiBase() {
  const envBase = typeof import.meta !== 'undefined'
    ? import.meta?.env?.VITE_BACKEND_URL || import.meta?.env?.VITE_API_BASE_URL
    : null;

  if (envBase && typeof envBase === 'string') {
    return envBase.replace(/\/$/, '');
  }

  return '/api';
}
