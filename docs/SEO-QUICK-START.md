# SEO Implementation Quick Start Guide

**For Developers: Get SEO features running in 5 minutes**

---

## 1. Add MetaTags to Pages (2 minutes)

### Homepage
```jsx
// pages/index.jsx
import { MetaTags, generateHomeMetaTags } from '@/components/SEO';

export default function HomePage() {
  const metaTags = generateHomeMetaTags();

  return (
    <>
      <MetaTags {...metaTags} />
      {/* Your page content */}
    </>
  );
}
```

### City Pages
```jsx
// pages/dj-[city].jsx
import { MetaTags, generateCityMetaTags } from '@/components/SEO';

export default function CityPage({ city, cityData }) {
  const metaTags = generateCityMetaTags(city, cityData);

  return (
    <>
      <MetaTags {...metaTags} />
      {/* Your page content */}
    </>
  );
}
```

### Service Pages
```jsx
// pages/diensten/[service]-dj.jsx
import { MetaTags, generateServiceMetaTags } from '@/components/SEO';

export default function ServicePage({ service }) {
  const metaTags = generateServiceMetaTags(service); // 'bruiloft', 'bedrijfsfeest', 'verjaardag'

  return (
    <>
      <MetaTags {...metaTags} />
      {/* Your page content */}
    </>
  );
}
```

---

## 2. Add Structured Data to HTML (1 minute)

### In your HTML `<head>` or layout component:
```jsx
// components/Layout.jsx or pages/_document.jsx
import Head from 'next/head';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(require('/frontend/public/schema.json'))
          }}
        />
      </Head>
      {children}
    </>
  );
}
```

Or simply add to `public/index.html`:
```html
<script type="application/ld+json" src="/schema.json"></script>
```

---

## 3. Initialize Performance Optimizations (1 minute)

### Option A: In your main entry file
```javascript
// main.js or App.jsx
import { initPerformanceOptimizations } from '@/utils/performance';

// At the top level or in useEffect
initPerformanceOptimizations();
```

### Option B: Auto-initialization
The performance.js module auto-initializes by default. Just import it:
```javascript
import '@/utils/performance';
```

---

## 4. Enable Lazy Loading for Images (1 minute)

### Update your Image components:
```jsx
// Before
<img src="/media/photo.jpg" alt="Photo" />

// After
<img
  data-src="/media/photo.jpg"
  alt="Professional DJ performing at wedding in Netherlands"
  loading="lazy"
  decoding="async"
  className="lazy-loading"
/>
```

The performance utilities will automatically lazy load all images with `data-src`.

### Or use the helper function:
```javascript
import { getResponsiveImageAttrs } from '@/utils/performance';

const imageAttrs = getResponsiveImageAttrs('/media/photo.jpg', {
  widths: [320, 640, 1024, 1920],
  format: 'webp'
});

<img {...imageAttrs} alt="..." />
```

---

## 5. Install React Helmet Async (if not already installed)

The MetaTags component requires react-helmet-async:

```bash
npm install react-helmet-async
```

Then wrap your app:
```jsx
// App.jsx or index.jsx
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      {/* Your app */}
    </HelmetProvider>
  );
}
```

---

## 6. Verify Everything Works

### Check Meta Tags
1. Run your dev server
2. View page source
3. Look for `<meta property="og:title">` tags
4. Test with [Facebook Debugger](https://developers.facebook.com/tools/debug/)

### Check Structured Data
1. Visit your homepage
2. View source and look for `<script type="application/ld+json">`
3. Test with [Google Rich Results Test](https://search.google.com/test/rich-results)

### Check Performance
```bash
cd /srv/apps/mr-djv1
./scripts/seo/core-web-vitals-check.sh -u http://localhost:3000
```

---

## 7. Deploy Checklist

Before pushing to production:

- [ ] MetaTags added to all page types
- [ ] Schema.json is publicly accessible at /schema.json
- [ ] robots.txt is publicly accessible at /robots.txt
- [ ] Performance utilities initialized
- [ ] Images use lazy loading
- [ ] Tested meta tags with social media debuggers
- [ ] Tested structured data with Google Rich Results Test
- [ ] Run Core Web Vitals check

---

## Troubleshooting

### Meta tags not showing
- Ensure `<HelmetProvider>` wraps your app
- Check browser console for errors
- Verify component import paths

### Images not lazy loading
- Check images have `data-src` attribute
- Verify performance.js is imported
- Check browser console for IntersectionObserver errors

### Schema.json 404
- Ensure file is in `public/` directory
- Check build/deployment copies public files
- Verify path is `/schema.json` not `/public/schema.json`

---

## Performance Best Practices

### Above-the-Fold Images
Don't lazy load hero images:
```jsx
<img
  src="/media/hero.jpg"  // Use src, not data-src
  alt="..."
  fetchpriority="high"
  decoding="async"
/>
```

### Critical CSS
Inline critical CSS in `<head>` for faster First Contentful Paint.

### Preload Hero Images
```javascript
import { preloadCriticalImages } from '@/utils/performance';

preloadCriticalImages([
  '/media/hero-image.jpg',
  '/media/logo.png'
]);
```

---

## Next Steps

1. **Generate Sitemaps** - Create XML sitemaps for pages, images, videos
2. **Submit to Search Console** - Add property and submit sitemaps
3. **Set Up Monitoring** - Weekly Core Web Vitals checks
4. **Implement Internal Links** - Follow [Internal Linking Strategy](./SEO-INTERNAL-LINKING-STRATEGY.md)

---

## Full Documentation

- [SEO Implementation Summary](./SEO-IMPLEMENTATION-SUMMARY.md) - Complete overview
- [Internal Linking Strategy](./SEO-INTERNAL-LINKING-STRATEGY.md) - Linking guidelines
- [SEO Scripts README](../scripts/seo/README.md) - Script documentation

---

**Need Help?**
- Check the [full implementation summary](./SEO-IMPLEMENTATION-SUMMARY.md)
- Review example pages in the codebase
- Run the Core Web Vitals checker for performance insights

---

**Last Updated:** October 18, 2025
