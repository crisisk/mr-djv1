const LEVEL_PRIORITY = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
} as const;

type LogLevel = keyof typeof LEVEL_PRIORITY;

type ConsoleMethod = (...args: unknown[]) => void;

type Logger = {
  debug: ConsoleMethod;
  info: ConsoleMethod;
  warn: ConsoleMethod;
  error: ConsoleMethod;
};

const resolveLevel = (): LogLevel => {
  const fromEnv = typeof import.meta !== "undefined" ? import.meta.env?.VITE_LOG_LEVEL : undefined;
  if (typeof fromEnv === "string") {
    const normalised = fromEnv.toLowerCase() as LogLevel;
    if (normalised in LEVEL_PRIORITY) {
      return normalised;
    }
  }

  if (typeof process !== "undefined") {
    const fallback = process.env?.LOG_LEVEL;
    if (typeof fallback === "string") {
      const normalised = fallback.toLowerCase() as LogLevel;
      if (normalised in LEVEL_PRIORITY) {
        return normalised;
      }
    }
  }

  return "info";
};

const logAt = (level: LogLevel, method: ConsoleMethod, currentLevel: LogLevel): ConsoleMethod => {
  const methodLevel = LEVEL_PRIORITY[level];
  const minimumLevel = LEVEL_PRIORITY[currentLevel];

  return (...args: unknown[]) => {
    if (methodLevel < minimumLevel) {
      return;
    }

    method(...args);
  };
};

const createLogger = (level: LogLevel): Logger => {
  const safeConsole: Console = typeof console !== "undefined" ? console : ({} as Console);

  return {
    debug: logAt("debug", safeConsole.debug?.bind(safeConsole) ?? (() => {}), level),
    info: logAt("info", safeConsole.info?.bind(safeConsole) ?? (() => {}), level),
    warn: logAt("warn", safeConsole.warn?.bind(safeConsole) ?? (() => {}), level),
    error: logAt("error", safeConsole.error?.bind(safeConsole) ?? (() => {}), level),
  };
};

export const logger = createLogger(resolveLevel());
