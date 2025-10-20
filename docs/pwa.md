# Progressive Web App Support

## Manifest

The frontend exposes a [`manifest.webmanifest`](../frontend/public/manifest.webmanifest) file so browsers can install MR DJ Entertainment as a standalone application. The manifest defines the app name, colors, and favicon-based icon set to keep the install prompt consistent with the brand palette.

## Service Worker Registration

The Vite build now uses [`vite-plugin-pwa`](https://vite-plugin-pwa.netlify.app/) to generate the service worker during `vite build` and `vite preview`. The plugin is initialised in [`frontend/vite.config.ts`](../frontend/vite.config.ts) and the worker is registered on the client via [`virtual:pwa-register`](https://vite-plugin-pwa.netlify.app/frameworks/vanilla.html#virtualpwaregister) in [`frontend/src/main.tsx`](../frontend/src/main.tsx). Registration happens immediately so updates are picked up without waiting for a reload.

## Offline Caching Strategy

The generated service worker uses Workbox runtime caching rules tailored to the MR DJ site:

- **`NetworkFirst` for pages:** navigation requests fall back to cached HTML when the network is unavailable, ensuring users can still revisit previously viewed pages while offline.
- **`StaleWhileRevalidate` for JS/CSS workers:** compiled scripts, styles, and web workers are served instantly from the cache while the service worker fetches fresh versions in the background.
- **`CacheFirst` for imagery:** media assets rely on the cache whenever possible, only hitting the network when missing or expired to preserve bandwidth.

These caches expire entries over time (24 hours for pages, one week for assets, and 30 days for imagery) to prevent storage bloat while retaining enough history for a reliable offline experience.
