import { useMemo } from 'react';
import { getDocument, getNavigator } from '../lib/environment.js';
import { DEFAULT_LOCALE, normalizeLocale } from '../utils/localization.js';

const detectPreferredLocale = (fallback = DEFAULT_LOCALE) => {
  const documentRef = getDocument();
  const docLang = documentRef?.documentElement?.lang;
  if (docLang) {
    return normalizeLocale(docLang);
  }

  const navigatorRef = getNavigator();
  if (navigatorRef) {
    if (Array.isArray(navigatorRef.languages)) {
      for (const lang of navigatorRef.languages) {
        const normalized = normalizeLocale(lang);
        if (normalized) {
          return normalized;
        }
      }
    }

    if (navigatorRef.language) {
      return normalizeLocale(navigatorRef.language);
    }
  }

  return fallback;
};

const usePreferredLocale = (fallback = DEFAULT_LOCALE) =>
  useMemo(() => detectPreferredLocale(fallback), [fallback]);

export { detectPreferredLocale };
export default usePreferredLocale;
