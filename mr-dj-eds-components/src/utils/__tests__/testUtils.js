import { vi } from 'vitest';

export const createMockStorage = () => {
  let store = {};

  return {
    getItem: vi.fn((key) => (key in store ? store[key] : null)),
    setItem: vi.fn((key, value) => {
      store[key] = String(value);
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    key: vi.fn((index) => Object.keys(store)[index] ?? null),
    get length() {
      return Object.keys(store).length;
    },
    __getStore: () => ({ ...store }),
    __setStore: (next) => {
      store = { ...next };
    }
  };
};

export const createMockDocument = () => {
  const cookies = {};

  const documentMock = {
    get cookie() {
      return Object.entries(cookies)
        .map(([name, value]) => `${name}=${value}`)
        .join('; ');
    },
    set cookie(value) {
      if (!value) return;

      const [pair, ...attributes] = value.split(';');
      if (!pair) return;

      const [namePart, ...valueParts] = pair.split('=');
      const name = namePart?.trim();
      if (!name) return;

      const cookieValue = valueParts.join('=');
      const expiresAttr = attributes.find((attr) => attr.trim().toLowerCase().startsWith('expires='));

      if (expiresAttr) {
        const expiresValue = expiresAttr.split('=')[1]?.trim();
        if (expiresValue) {
          const expiryDate = new Date(expiresValue);
          if (!Number.isNaN(expiryDate.getTime()) && expiryDate.getTime() <= 0) {
            delete cookies[name];
            return;
          }
        }
      }

      if (cookieValue === '') {
        delete cookies[name];
        return;
      }

      cookies[name] = cookieValue;
    },
    __clear() {
      Object.keys(cookies).forEach((key) => delete cookies[key]);
    },
    __getCookie(name) {
      return cookies[name];
    }
  };

  return documentMock;
};

const createMockLocation = () => {
  const url = new URL('https://example.com/');

  return {
    get href() {
      return url.href;
    },
    set href(value) {
      const next = new URL(value, url.href);
      url.href = next.href;
    },
    get origin() {
      return url.origin;
    },
    get pathname() {
      return url.pathname;
    },
    get search() {
      return url.search;
    },
    set search(value) {
      if (!value) {
        url.search = '';
        return;
      }

      url.search = value.startsWith('?') ? value : `?${value}`;
    },
    toString() {
      return url.toString();
    }
  };
};

const createMockHistory = (location) => ({
  pushState: vi.fn((_, __, newUrl) => {
    const target = new URL(newUrl, location.origin);
    location.href = target.href;
  })
});

export const setupDomMocks = ({ withDataLayer = true } = {}) => {
  const originals = {
    window: global.window,
    document: global.document,
    sessionStorage: global.sessionStorage,
    location: global.location
  };

  const storage = createMockStorage();
  const documentMock = createMockDocument();
  const location = createMockLocation();
  const history = createMockHistory(location);

  const windowMock = {
    sessionStorage: storage,
    location,
    history
  };

  if (withDataLayer) {
    windowMock.dataLayer = [];
  }

  global.document = documentMock;
  global.sessionStorage = storage;
  global.location = location;
  global.window = windowMock;

  return {
    storage,
    document: documentMock,
    location,
    history,
    dataLayer: windowMock.dataLayer,
    restore: () => {
      global.window = originals.window;
      global.document = originals.document;
      global.sessionStorage = originals.sessionStorage;
      global.location = originals.location;
    }
  };
};
