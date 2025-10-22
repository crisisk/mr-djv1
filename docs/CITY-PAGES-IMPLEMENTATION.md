# City Pages Implementation Guide

## Overview
10 SEO-geoptimaliseerde city landing pages gegenereerd voor Mr. DJ, targeting Brabant cities.

## Generated Cities

1. **Eindhoven** (`/dj-eindhoven`)
2. **Tilburg** (`/dj-tilburg`)
3. **'s-Hertogenbosch** (`/dj-s-hertogenbosch`)
4. **Breda** (`/dj-breda`)
5. **Helmond** (`/dj-helmond`)
6. **Oss** (`/dj-oss`)
7. **Roosendaal** (`/dj-roosendaal`)
8. **Bergen op Zoom** (`/dj-bergen-op-zoom`)
9. **Uden** (`/dj-uden`)
10. **Veghel** (`/dj-veghel`)

## File Locations

- **Content**: `/srv/apps/mr-djv1/content/cities/*.md`
- **Generator Script**: `/srv/apps/mr-djv1/scripts/generate-city-pages.js`
- **React Component**: `/srv/apps/mr-djv1/mr-dj-eds-components/src/pages/CityPage.jsx`

## Content Structure

Each city page includes:

### 1. Frontmatter (Metadata)
```yaml
---
title: "DJ huren Eindhoven | Mr. DJ"
description: "Professionele DJ services in Eindhoven..."
slug: "dj-eindhoven"
city: "Eindhoven"
region: "Noord-Brabant"
keywords: "dj eindhoven, dj huren eindhoven, bruiloft dj eindhoven"
---
```

### 2. Hero Section
- H1 with city name
- Value proposition
- Local targeting

### 3. Services Section
- Bruiloft DJ {city}
- Bedrijfsfeest DJ {city}
- Verjaardag DJ {city}

### 4. Pricing Section
- Transparent pricing
- Package tiers
- Local mention

### 5. CTA Section
- Contact form link with city parameter
- Direct call-to-action

### 6. FAQ Section
- City-specific Q&A
- Local information
- Trust building

### 7. Schema.org Markup
- LocalBusiness
- Service
- Organization
- AggregateRating (future)

## SEO Optimization

### Keywords per City
- Primary: "dj {stad}"
- Secondary: "dj huren {stad}"
- Long-tail: "bruiloft dj {stad}", "feest dj {stad}"

### Meta Tags
```html
<title>DJ huren {Stad} | Mr. DJ</title>
<meta name="description" content="...">
<meta name="keywords" content="...">
<link rel="canonical" href="https://mr-dj.sevensa.nl/dj-{slug}">
```

### Internal Linking
- Link to main services
- Link between cities
- Link to contact form

## Routing Setup

### Option 1: Static Routes (Nginx)
```nginx
# In nginx.conf
location /dj-eindhoven {
    try_files $uri /index.html;
}
location /dj-tilburg {
    try_files $uri /index.html;
}
# ... etc for all cities
```

### Option 2: React Router (Recommended)
```javascript
// In App.jsx
import CityPage from './pages/CityPage';

<Route path="/dj-:citySlug" element={<CityPage />} />
```

### Option 3: Next.js Dynamic Routes
```javascript
// pages/dj-[city].js
export async function getStaticPaths() {
  const cities = ['eindhoven', 'tilburg', ...];
  return {
    paths: cities.map(city => ({ params: { city } })),
    fallback: false
  };
}
```

## Implementation Steps

### 1. Copy Content Files
```bash
cp -r /srv/apps/mr-djv1/content/cities /srv/apps/mr-djv1/frontend/public/content/
```

### 2. Add React Router
```bash
cd /srv/apps/mr-djv1/mr-dj-eds-components
npm install react-router-dom
```

### 3. Update App.jsx
```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CityPage from './pages/CityPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dj-:citySlug" element={<CityPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 4. Build & Deploy
```bash
npm run build
rsync -av dist/ ../frontend/public/
docker-compose up -d --build eds-frontend
```

## Analytics Tracking

Add city-specific events to dataLayer:

```javascript
window.dataLayer.push({
  event: 'city_page_view',
  city: 'Eindhoven',
  pageType: 'city_landing'
});
```

## A/B Testing Ideas

1. **CTA Button Text**
   - "Offerte Aanvragen" vs "Direct Contact"

2. **Pricing Visibility**
   - Show prices upfront vs "Vraag offerte"

3. **Social Proof**
   - Testimonials vs Trust badges

## Content Expansion

### Future Additions
- Customer reviews per city
- Local venue recommendations
- City-specific photo galleries
- Upcoming events in city

### Additional Cities
To add more cities:

```bash
node scripts/generate-city-pages.js
```

Edit the `cities` array in the script to add:
- Veldhoven
- Best
- Waalwijk
- Etc.

## Performance

### Optimizations
- ✅ Static HTML generation
- ✅ Minimal JavaScript
- ✅ Lazy image loading
- ✅ Schema.org for rich snippets
- ✅ Mobile-first design

### Core Web Vitals Target
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1

## Maintenance

### Monthly Tasks
1. Check Google Search Console for city keyword rankings
2. Update content based on seasonal events
3. Add new customer reviews
4. Monitor conversion rates per city

### Quarterly Tasks
1. Expand to new cities
2. A/B test CTA variations
3. Update pricing if needed
4. Refresh photos/content

## Monitoring

### Key Metrics
- Organic traffic per city page
- Conversion rate (form submissions)
- Average position in Google
- Click-through rate from SERP

### Google Search Console
Filter by page URL:
- `/dj-eindhoven`
- `/dj-tilburg`
- etc.

Track:
- Impressions
- Clicks
- Average position
- CTR

## Support

For questions or issues:
- Technical: backend@sevensa.nl
- Content: marketing@sevensa.nl
- SEO: seo@sevensa.nl

## Quick Commands

```bash
# Generate new city pages
node /srv/apps/mr-djv1/scripts/generate-city-pages.js

# Check generated files
ls -la /srv/apps/mr-djv1/content/cities/

# Test city page locally
open http://localhost:5173/dj-eindhoven

# Deploy to production
npm run build && docker-compose up -d --build
```

## Success Criteria

✅ All 10 city pages live
✅ Schema.org markup validated
✅ Mobile responsive
✅ Load time < 3s
✅ Contact form tracking
✅ SEO meta tags complete
✅ Internal linking structure

Target: 50+ organic visits/month per city page within 3 months.
