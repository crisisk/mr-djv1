const dataLayerName = "dataLayer";

type Ga4EventParams = Record<string, unknown>;

export interface Ga4Event {
  name: string;
  params?: Ga4EventParams;
}

const isBrowser = typeof window !== "undefined";

const getDataLayer = (): unknown[] | null => {
  if (!isBrowser) {
    return null;
  }

  const globalWindow = window as unknown as Record<string, unknown>;
  const dataLayer = (globalWindow[dataLayerName] as unknown[]) ?? [];

  if (!globalWindow[dataLayerName]) {
    globalWindow[dataLayerName] = dataLayer;
  }

  return dataLayer;
};

export const pushEvent = ({ name, params }: Ga4Event): void => {
  if (!name) {
    if (import.meta.env?.MODE !== "production") {
      console.warn("[ga4] Event name is required before pushing to the dataLayer.");
    }
    return;
  }

  const dataLayer = getDataLayer();

  if (!dataLayer) {
    return;
  }

  const payload = {
    event: name,
    ...(params ?? {}),
  };

  dataLayer.push(payload);
};
