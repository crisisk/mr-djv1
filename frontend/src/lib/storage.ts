const isBrowser = typeof window !== "undefined" && typeof window.localStorage !== "undefined";

type JsonValue = Record<string, unknown> | Array<unknown> | string | number | boolean | null;

function getStorage(): Storage | null {
  if (!isBrowser) {
    return null;
  }

  try {
    return window.localStorage;
  } catch (error) {
    console.warn("Local storage is not accessible.", error);
    return null;
  }
}

export function getItem(key: string): string | null {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  try {
    return storage.getItem(key);
  } catch (error) {
    console.warn(`Failed to read key "${key}" from localStorage.`, error);
    return null;
  }
}

export function setItem(key: string, value: string): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.setItem(key, value);
  } catch (error) {
    console.warn(`Failed to write key "${key}" to localStorage.`, error);
  }
}

export function removeItem(key: string): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.removeItem(key);
  } catch (error) {
    console.warn(`Failed to remove key "${key}" from localStorage.`, error);
  }
}

export function getJSON<T = unknown>(key: string): T | null {
  const value = getItem(key);
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn(`Failed to parse JSON from key "${key}".`, error);
    return null;
  }
}

export function setJSON(key: string, value: JsonValue): void {
  try {
    const serialized = JSON.stringify(value);
    setItem(key, serialized);
  } catch (error) {
    console.warn(`Failed to serialise JSON for key "${key}".`, error);
  }
}
