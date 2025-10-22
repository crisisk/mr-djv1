const DEFAULT_LOCALE = 'nl-NL'
const DEFAULT_CURRENCY = 'EUR'
const DEFAULT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
}

function isValidNumber(value: unknown): value is number | bigint {
  return typeof value === 'number' || typeof value === 'bigint'
}

export function fmtCurrency(
  value: number | bigint,
  options: (Intl.NumberFormatOptions & { currency?: string }) = {}
): string {
  const { currency = DEFAULT_CURRENCY, ...formatOptions } = options

  if (!isValidNumber(value)) {
    return String(value)
  }

  try {
    return new Intl.NumberFormat(DEFAULT_LOCALE, {
      style: 'currency',
      currency,
      ...formatOptions
    }).format(value)
  } catch {
    const numericValue = typeof value === 'bigint' ? Number(value) : value
    const fallbackValue =
      typeof numericValue === 'number' && Number.isFinite(numericValue)
        ? numericValue.toFixed(2)
        : String(value)

    return `${fallbackValue} ${currency}`.trim()
  }
}

export function fmtNumber(
  value: number | bigint,
  options: Intl.NumberFormatOptions = {}
): string {
  if (!isValidNumber(value)) {
    return String(value)
  }

  try {
    return new Intl.NumberFormat(DEFAULT_LOCALE, options).format(value)
  } catch {
    return String(value)
  }
}

export function fmtDate(
  value: Date | string | number | null | undefined,
  options: Intl.DateTimeFormatOptions = DEFAULT_DATE_OPTIONS
): string | null {
  if (value === null || value === undefined) {
    return null
  }

  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  try {
    return new Intl.DateTimeFormat(DEFAULT_LOCALE, options).format(date)
  } catch {
    return date.toISOString().split('T')[0]
  }
}
