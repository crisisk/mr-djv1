import tokens from './theme/tokens.js';
import { getDocument } from './lib/environment.js';

const toKebabCase = (value) => value
  .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
  .replace(/\s+/g, '-')
  .toLowerCase();

const flattenTokens = (object, prefix = []) => {
  return Object.entries(object).reduce((acc, [key, value]) => {
    if (Array.isArray(value)) {
      return acc;
    }

    const nextPrefix = [...prefix, toKebabCase(key)];

    if (value && typeof value === 'object') {
      return { ...acc, ...flattenTokens(value, nextPrefix) };
    }

    if (typeof value === 'string' || typeof value === 'number') {
      const variableName = ['--', ...nextPrefix].join('-');
      acc[variableName] = value;
      return acc;
    }

    return acc;
  }, {});
};

/**
 * Apply all design tokens as CSS custom properties on the provided element.
 * When no element is supplied, the document root is used so the tokens are
 * available application wide.
 */
export const applyDesignTokens = (target = getDocument()?.documentElement ?? null) => {
  if (!target || !target.style) {
    return;
  }

  const variables = flattenTokens(tokens);
  Object.entries(variables).forEach(([name, value]) => {
    target.style.setProperty(name, value);
  });
};

export default tokens;
