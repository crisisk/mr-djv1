/**
 * Color utility helpers for design token manipulation.
 *
 * Ensures we consistently convert hex color values coming from the
 * design token JSON into rgba strings with an alpha channel. This is
 * shared by multiple organism components so that any formatting fixes
 * automatically propagate.
 */

/**
 * Convert a hex color value to an RGBA string with the provided alpha.
 *
 * @param {string} hex - The hex color (e.g. "#1A2C4B" or "1A2C4B").
 * @param {number} alpha - A number between 0 and 1.
 * @returns {string} RGBA string representation.
 */
export function withAlpha(hex, alpha) {
  if (typeof hex !== 'string' || !hex.trim()) {
    throw new TypeError('Expected a hex color string');
  }

  const normalized = hex.replace('#', '').trim();

  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    throw new Error(`Invalid hex color provided: ${hex}`);
  }

  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default {
  withAlpha,
};
