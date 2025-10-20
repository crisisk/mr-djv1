import localeDictionary from '../../../content/settings/locales.json';

const DEFAULT_LOCALE = 'nl';

const getNestedValue = (source, pathSegments) =>
  pathSegments.reduce((acc, segment) => (acc && segment in acc ? acc[segment] : undefined), source);

const formatTemplate = (template, params) => {
  if (typeof template !== 'string') {
    return template;
  }

  return template.replace(/{{\s*([^{}\s]+)\s*}}/g, (_, key) => {
    return Object.prototype.hasOwnProperty.call(params, key) ? params[key] : '';
  });
};

export const translate = (key, { locale = DEFAULT_LOCALE, defaultValue, params = {} } = {}) => {
  const pathSegments = key.split('.');
  const localeEntry = getNestedValue(localeDictionary[locale] ?? {}, pathSegments);
  const fallbackEntry = getNestedValue(localeDictionary[DEFAULT_LOCALE] ?? {}, pathSegments);

  const template = localeEntry ?? fallbackEntry ?? defaultValue;

  if (template === undefined || template === null) {
    return defaultValue ?? '';
  }

  if (typeof template === 'object') {
    return template;
  }

  const formatted = formatTemplate(template, params);

  if (!formatted && defaultValue) {
    return defaultValue;
  }

  return formatted;
};

export const getLocaleDictionary = () => localeDictionary;

export const getDefaultLocale = () => DEFAULT_LOCALE;
