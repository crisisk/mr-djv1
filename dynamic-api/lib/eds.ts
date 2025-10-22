
export type Tokens = Record<string, any>;

export async function fetchTokens(): Promise<Tokens> {
  const res = await fetch('/api/eds/tokens', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch tokens');
  return res.json();
}

export function applyTheme(tokens: Tokens) {
  if (!tokens) return;
  // Guard against SSR - only run in browser
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const brand600 = tokens?.color?.brand?.["600"];
  if (brand600) root.style.setProperty('--color-brand-600', brand600);
}
