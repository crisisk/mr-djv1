export const DEFAULT_LOCALE = 'nl';

export const normalizeLocale = (locale) => {
  if (!locale || typeof locale !== 'string') {
    return DEFAULT_LOCALE;
  }

  const lower = locale.toLowerCase();
  const [primary] = lower.split(/[-_]/);
  return primary || DEFAULT_LOCALE;
};

export const resolveLocale = (preferred, fallback = DEFAULT_LOCALE) => {
  const normalized = normalizeLocale(preferred);
  return normalized || fallback;
};

const getTranslationTable = (input) => {
  if (!input) {
    return null;
  }

  if (typeof input === 'string') {
    return { nl: input, en: input };
  }

  if (Array.isArray(input)) {
    return { nl: input, en: input };
  }

  if (typeof input === 'object' && input.translations && typeof input.translations === 'object') {
    return input.translations;
  }

  return null;
};

export const resolveLocalizedValue = (input, locale = DEFAULT_LOCALE) => {
  if (typeof input === 'string') {
    return input;
  }

  const translations = getTranslationTable(input);
  if (!translations) {
    return '';
  }

  const normalized = normalizeLocale(locale);
  if (typeof translations[normalized] === 'string') {
    return translations[normalized];
  }

  if (typeof translations.nl === 'string') {
    return translations.nl;
  }

  const first = Object.values(translations).find((value) => typeof value === 'string');
  return typeof first === 'string' ? first : '';
};

export const resolveLocalizedList = (input, locale = DEFAULT_LOCALE) => {
  if (Array.isArray(input)) {
    return input;
  }

  const translations = getTranslationTable(input);
  if (!translations) {
    return [];
  }

  const normalized = normalizeLocale(locale);
  const candidate = translations[normalized] ?? translations.nl ?? Object.values(translations).find(Array.isArray);
  return Array.isArray(candidate) ? candidate : [];
};

const mergeTranslationTables = (nextValue, existing) => {
  const table = { ...existing };
  const normalizedNext = getTranslationTable(nextValue);

  if (normalizedNext) {
    Object.entries(normalizedNext).forEach(([key, value]) => {
      if (typeof value === 'string' || Array.isArray(value)) {
        table[key] = value;
      }
    });
  }

  if (!table.nl) {
    table.nl = typeof nextValue === 'string' ? nextValue : Array.isArray(nextValue) ? nextValue : '';
  }

  if (table.en === undefined) {
    table.en = table.nl;
  }

  return table;
};

export const createTranslationObject = (value, existing) => ({
  translations: mergeTranslationTables(value, existing?.translations),
});

export const createTranslationList = (value, existing) => ({
  translations: mergeTranslationTables(Array.isArray(value) ? value : [], existing?.translations),
});
