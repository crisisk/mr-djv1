export const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

export const getWindow = () => (typeof window !== 'undefined' ? window : undefined);

export const getDocument = () => (typeof document !== 'undefined' ? document : undefined);

export const getNavigator = () => (typeof navigator !== 'undefined' ? navigator : undefined);
