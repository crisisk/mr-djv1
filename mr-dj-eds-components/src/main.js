import tokens from './lib/design-tokens.json';
import { getDocument, getWindow } from './lib/environment.js';

const flattenTokens = (object, prefix = []) => {
  return Object.entries(object).reduce((acc, [key, value]) => {
    if (Array.isArray(value)) {
      return acc;
    }

    if (value && typeof value === 'object' && !('value' in value)) {
      return { ...acc, ...flattenTokens(value, [...prefix, key]) };
    }

    if (value && typeof value === 'object' && 'value' in value) {
      const variableName = ['--', ...prefix, key]
        .join('-')
        .replace(/\s+/g, '-')
        .toLowerCase();

      acc[variableName] = value.value;
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

  const windowRef = getWindow();
  const getExistingValue = (name) => {
    const inlineValue = target.style.getPropertyValue?.(name)?.trim();
    if (inlineValue) {
      return inlineValue;
    }

    if (windowRef && typeof windowRef.getComputedStyle === 'function') {
      const computed = windowRef.getComputedStyle(target);
      return computed?.getPropertyValue(name)?.trim();
    }

    return '';
  };

  const variables = flattenTokens(tokens);
  Object.entries(variables).forEach(([name, value]) => {
    if (getExistingValue(name)) {
      return;
    }

    target.style.setProperty(name, value);
  });
};

export default tokens;
