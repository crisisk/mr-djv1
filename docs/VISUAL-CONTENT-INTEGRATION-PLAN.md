# 🎨 Mr. DJ Visual Content Integration Plan

**Doel**: Hoogwaardige foto's en video's uploaden → Automatisch verwerkt op de website met optimaal design

---

## 📁 Content Upload Structuur

### Stap 1: Upload naar Repository

```
/srv/apps/mr-djv1/content/media/
├── photos/
│   ├── hero/                    # Homepage hero images (1920x1080)
│   │   ├── dj-performance-1.jpg
│   │   ├── wedding-party-1.jpg
│   │   └── corporate-event-1.jpg
│   │
│   ├── gallery/                 # Galerij foto's (1200x800)
│   │   ├── weddings/
│   │   │   ├── bruiloft-eindhoven-001.jpg
│   │   │   └── bruiloft-tilburg-001.jpg
│   │   ├── corporate/
│   │   │   └── bedrijfsfeest-001.jpg
│   │   └── parties/
│   │       └── verjaardag-001.jpg
│   │
│   ├── team/                    # Team foto's (600x600 vierkant)
│   │   ├── dj-profile-1.jpg
│   │   └── dj-profile-2.jpg
│   │
│   └── venues/                  # Locatie foto's (800x600)
│       ├── eindhoven/
│       ├── tilburg/
│       └── breda/
│
├── videos/
│   ├── hero/                    # Hero video's (MP4, max 10MB)
│   │   ├── dj-showreel.mp4
│   │   └── event-highlights.mp4
│   │
│   ├── testimonials/            # Klant testimonials (MP4, 30-60sec)
│   │   ├── testimonial-wedding-1.mp4
│   │   └── testimonial-corporate-1.mp4
│   │
│   └── shorts/                  # Korte clips (MP4, 15-30sec)
│       ├── equipment-showcase.mp4
│       └── mixing-demo.mp4
│
└── optimized/                   # Auto-gegenereerde optimalisaties
    ├── webp/                    # WebP conversies
    ├── thumbnails/              # Thumbnails (400x300)
    └── compressed/              # Gecomprimeerde videos
```

---

## 🚀 Automatische Verwerking Workflow

### Workflow Diagram

```
┌─────────────────────────────────────────────────────────┐
│  1. Upload Content                                      │
│  → rsync/scp naar /content/media/                       │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  2. Run Processing Script                               │
│  → bash scripts/content/process-media.sh                │
│                                                          │
│  Acties:                                                │
│  • Optimaliseer afbeeldingen (WebP, resize)            │
│  • Comprimeer video's (H.264, lagere bitrate)          │
│  • Genereer thumbnails                                  │
│  • Update metadata JSON                                 │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  3. Update Website Components                           │
│  → Automatisch ingeladen via data files                │
│                                                          │
│  • Hero sections: hero images/videos                    │
│  • Gallery grids: gallery photos                        │
│  • Team section: team photos                            │
│  • City pages: venue photos                             │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  4. Build & Deploy                                      │
│  → npm run build && docker-compose up -d                │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Plaatsing per Pagina Type

### 1. Homepage (`/`)

**Hero Section** (Full-width, boven de fold)
- **Type**: Carrousel met 3-5 images + video optie
- **Dimensions**: 1920x1080 (16:9)
- **Source**: `/content/media/photos/hero/`
- **Component**: `<DjSaxLanding>`
- **Design**:
  ```jsx
  <section className="hero-fullscreen relative h-screen">
    <video autoPlay muted loop className="absolute inset-0 object-cover">
      <source src="/media/videos/hero/dj-showreel.mp4" />
    </video>
    <div className="overlay bg-gradient-to-b from-black/40 to-black/70">
      <h1>Mr. DJ - Jouw Perfecte DJ</h1>
      <button>Offerte Aanvragen</button>
    </div>
  </section>
  ```

**Gallery Section** (3-koloms grid)
- **Type**: Foto grid met lightbox
- **Dimensions**: 1200x800 (3:2)
- **Source**: `/content/media/photos/gallery/`
- **Design**: Masonry grid met hover effects

**Team Section** (Horizontale kaarten)
- **Type**: DJ profiles met foto
- **Dimensions**: 600x600 (1:1 vierkant)
- **Source**: `/content/media/photos/team/`

---

### 2. City Pages (`/dj-in-{city}`)

**Hero Image** (Per stad uniek)
- **Type**: Lokale landmark + DJ setup
- **Dimensions**: 1920x1080
- **Source**: `/content/media/photos/venues/{city}/`
- **Voorbeeld**:
  ```jsx
  // Eindhoven
  heroImage: "/media/photos/venues/eindhoven/philips-stadion-dj.jpg"

  // Tilburg
  heroImage: "/media/photos/venues/tilburg/lochal-event.jpg"
  ```

**Gallery Grid** (Lokale events)
- **Type**: 2x2 grid van lokale events
- **Dimensions**: 800x600
- **Source**: `/content/media/photos/gallery/{eventType}/{city}/`

---

### 3. Service Pages (`/bruiloft-dj`, `/bedrijfsfeest-dj`)

**Header Image** (Event-specifiek)
- **Type**: Hero met event-type focus
- **Dimensions**: 1920x1080
- **Source**: `/content/media/photos/gallery/{eventType}/`

**Video Testimonials** (Embedded)
- **Type**: Video player met thumbnail
- **Dimensions**: 1280x720 (16:9)
- **Source**: `/content/media/videos/testimonials/`
- **Design**:
  ```jsx
  <div className="video-testimonial">
    <video controls poster="/media/videos/thumbnails/testimonial-1.jpg">
      <source src="/media/videos/testimonials/testimonial-wedding-1.mp4" />
    </video>
    <p className="caption">Jan & Marie - Bruiloft Eindhoven</p>
  </div>
  ```

---

## 🛠️ Processing Script

### Auto-Optimization Script

**Locatie**: `/scripts/content/process-media.sh`

**Features**:
1. **Image Optimization**:
   - Convert to WebP (80% quality)
   - Resize to multiple breakpoints (mobile, tablet, desktop)
   - Generate thumbnails (400x300)
   - Strip EXIF data

2. **Video Optimization**:
   - Compress to H.264 (CRF 23)
   - Generate poster frames
   - Create compressed versions (mobile-friendly)

3. **Metadata Generation**:
   - Create JSON manifest met alle media
   - Dimensions, file sizes, alt text placeholders

**Usage**:
```bash
# Upload content
rsync -av ~/Desktop/photos/* /srv/apps/mr-djv1/content/media/photos/

# Process
bash /srv/apps/mr-djv1/scripts/content/process-media.sh

# Output:
# ✅ Processed 15 images → WebP saved 60% space
# ✅ Compressed 3 videos → 10MB → 3MB each
# ✅ Generated 15 thumbnails
# ✅ Updated media-manifest.json
```

---

## 📊 Media Manifest JSON

**Locatie**: `/content/media/media-manifest.json`

```json
{
  "hero": [
    {
      "id": "hero-1",
      "original": "/media/photos/hero/dj-performance-1.jpg",
      "webp": "/media/optimized/webp/hero/dj-performance-1.webp",
      "thumbnail": "/media/optimized/thumbnails/hero/dj-performance-1.jpg",
      "alt": "Professional DJ performing at wedding in Eindhoven",
      "dimensions": {"width": 1920, "height": 1080},
      "category": "weddings",
      "location": "Eindhoven"
    }
  ],
  "gallery": {
    "weddings": [
      {
        "id": "wedding-eindhoven-1",
        "original": "/media/photos/gallery/weddings/bruiloft-eindhoven-001.jpg",
        "webp": "/media/optimized/webp/gallery/bruiloft-eindhoven-001.webp",
        "alt": "Beautiful wedding reception with DJ setup",
        "city": "Eindhoven"
      }
    ]
  },
  "videos": {
    "hero": [
      {
        "id": "showreel-1",
        "file": "/media/videos/hero/dj-showreel.mp4",
        "poster": "/media/optimized/thumbnails/dj-showreel.jpg",
        "duration": 45,
        "size": "3.2MB"
      }
    ]
  }
}
```

---

## 🎨 React Component Integration

### Image Component met Lazy Loading

**Locatie**: `/mr-dj-eds-components/src/components/Atoms/OptimizedImage.jsx`

```jsx
import React, { useState } from 'react';

const OptimizedImage = ({ src, alt, className, loading = 'lazy' }) => {
  const [loaded, setLoaded] = useState(false);

  // Auto-detect WebP support
  const webpSrc = src.replace(/\.(jpg|png)$/, '.webp');

  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img
        src={src}
        alt={alt}
        loading={loading}
        className={`${className} ${loaded ? 'loaded' : 'loading'}`}
        onLoad={() => setLoaded(true)}
      />
    </picture>
  );
};

export default OptimizedImage;
```

### Video Component met Controls

```jsx
const OptimizedVideo = ({ src, poster, autoPlay = false, controls = true }) => {
  return (
    <video
      className="w-full rounded-lg shadow-xl"
      poster={poster}
      autoPlay={autoPlay}
      muted={autoPlay}
      loop={autoPlay}
      controls={controls}
      playsInline
    >
      <source src={src} type="video/mp4" />
      Your browser doesn't support video playback.
    </video>
  );
};
```

---

## 📐 Image Specifications

### Aanbevolen Afmetingen

| Type | Dimensions | Aspect Ratio | Max Size | Format |
|------|-----------|--------------|----------|--------|
| **Hero Desktop** | 1920×1080 | 16:9 | 500KB | WebP/JPG |
| **Hero Mobile** | 768×1024 | 3:4 | 200KB | WebP/JPG |
| **Gallery** | 1200×800 | 3:2 | 300KB | WebP/JPG |
| **Team Photos** | 600×600 | 1:1 | 150KB | WebP/JPG |
| **Venue Photos** | 800×600 | 4:3 | 200KB | WebP/JPG |
| **Thumbnails** | 400×300 | 4:3 | 50KB | WebP/JPG |
| **Video Hero** | 1920×1080 | 16:9 | 10MB | MP4 |
| **Video Testimonial** | 1280×720 | 16:9 | 5MB | MP4 |

### Design Guidelines

**Foto Stijl**:
- ✅ Professioneel belicht (geen te donker)
- ✅ Focus op DJ + dansende mensen (energie)
- ✅ Herkenbare locaties voor city pages
- ✅ Diverse events (bruiloft, corporate, verjaardag)
- ✅ Branding zichtbaar (Mr. DJ logo op equipment)

**Video Stijl**:
- ✅ Eerste 3 seconden: impact moment
- ✅ Max 60 seconden (testimonials)
- ✅ Ondertiteling voor testimonials (NL)
- ✅ Muziek: uptempo, passend bij DJ vibe
- ✅ Branding: intro/outro met Mr. DJ logo

---

## 🔄 Complete Upload → Deploy Flow

### Stap-voor-Stap Proces

```bash
# ━━━ STAP 1: Upload Content ━━━
# Van je lokale machine naar server
rsync -av --progress \
  ~/Desktop/mr-dj-photos/ \
  root@sevensa.nl:/srv/apps/mr-djv1/content/media/photos/

rsync -av --progress \
  ~/Desktop/mr-dj-videos/ \
  root@sevensa.nl:/srv/apps/mr-djv1/content/media/videos/

# ━━━ STAP 2: Process Media ━━━
# SSH naar server
ssh root@sevensa.nl

cd /srv/apps/mr-djv1
bash scripts/content/process-media.sh

# Output:
# 🖼️  Processing images...
# ✅ Converted 25 images to WebP
# ✅ Generated responsive variants (mobile, tablet, desktop)
# ✅ Created 25 thumbnails
# 🎬 Processing videos...
# ✅ Compressed 5 videos (75MB → 15MB)
# ✅ Generated poster frames
# 📝 Updated media-manifest.json
# ⚡ Total processing time: 45 seconds

# ━━━ STAP 3: Update Website Data ━━━
# Automatisch: media-manifest.json wordt ingelezen door React

# ━━━ STAP 4: Build & Deploy ━━━
cd /srv/apps/mr-djv1/mr-dj-eds-components
npm run build

rsync -av dist/ ../frontend/public/

docker-compose up -d --build eds-frontend

# ━━━ STAP 5: Verify ━━━
curl -I https://mr-dj.sevensa.nl/media/photos/hero/dj-performance-1.webp
# Should return: HTTP/2 200

# Check website
open https://mr-dj.sevensa.nl
```

---

## 🎯 Design Patterns per Component

### 1. Hero Carrousel (Homepage)

**Visual Design**:
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  [← Previous]          HERO IMAGE           [Next →]│
│                                                     │
│        Mr. DJ - Professionele DJ Services          │
│        Bruiloften • Bedrijfsfeesten • Partijen     │
│                                                     │
│              [Offerte Aanvragen →]                  │
│                                                     │
│  ●  ○  ○  (carousel indicators)                    │
└─────────────────────────────────────────────────────┘
```

**Features**:
- Auto-rotate elke 5 seconden
- Swipe support op mobile
- Lazy loading voor images 2-5
- Video optie (muted autoplay)

---

### 2. Gallery Grid (3-koloms)

**Visual Design**:
```
┌──────────┐  ┌──────────┐  ┌──────────┐
│  IMAGE   │  │  IMAGE   │  │  IMAGE   │
│  Wedding │  │Corporate │  │ Birthday │
│  [hover] │  │  [hover] │  │  [hover] │
└──────────┘  └──────────┘  └──────────┘
     ↓ Click: Lightbox opens
┌───────────────────────────────────────┐
│  [←]     FULL IMAGE VIEW         [→]  │
│                                       │
│     Caption: Wedding @ Eindhoven      │
│                              [Close X]│
└───────────────────────────────────────┘
```

**Hover Effect**:
```css
.gallery-item:hover {
  transform: scale(1.05);
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  transition: all 0.3s ease;
}
```

---

### 3. Video Testimonial Section

**Visual Design**:
```
┌───────────────────────────────────────┐
│  "Mr. DJ maakte onze bruiloft         │
│   onvergetelijk!" - Jan & Marie       │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │  [▶️ Play Video]                 │ │
│  │  [Thumbnail: Happy couple]      │ │
│  │                                 │ │
│  │  Duration: 0:45                 │ │
│  └─────────────────────────────────┘ │
│                                       │
│  ⭐⭐⭐⭐⭐ 5/5 sterren                   │
└───────────────────────────────────────┘
```

---

## 📱 Responsive Design

### Mobile-First Breakpoints

```css
/* Mobile: 320px - 767px */
.hero-section {
  height: 80vh;
  background-position: center;
}

.gallery-grid {
  grid-template-columns: 1fr; /* 1 kolom */
}

/* Tablet: 768px - 1023px */
@media (min-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr); /* 2 kolommen */
  }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  .hero-section {
    height: 100vh;
  }

  .gallery-grid {
    grid-template-columns: repeat(3, 1fr); /* 3 kolommen */
  }
}
```

---

## ⚡ Performance Optimization

### Image Loading Strategy

1. **Above the Fold** (Hero): `loading="eager"`
2. **Below the Fold** (Gallery): `loading="lazy"`
3. **Progressive JPEG** voor grote hero images
4. **Blur-up placeholder** tijdens laden:

```jsx
<div className="image-container">
  <img
    src="/media/optimized/blur/hero-1-tiny.jpg"
    className="blur-placeholder"
  />
  <OptimizedImage
    src="/media/photos/hero/hero-1.jpg"
    alt="DJ Performance"
    onLoad={() => hidePlaceholder()}
  />
</div>
```

### Video Loading Strategy

1. **Hero Video**: Preload="auto", autoplay muted
2. **Testimonial Videos**: Preload="none" (wacht op play)
3. **Poster frames**: Altijd laden voor preview

---

## 🔍 SEO Optimization

### Image Alt Text Formule

```javascript
// Automatisch genereren
const generateAltText = (image) => {
  const { type, city, eventType } = image;

  return `${eventType} DJ performance in ${city} - Mr. DJ professional services`;

  // Voorbeelden:
  // "Bruiloft DJ performance in Eindhoven - Mr. DJ professional services"
  // "Bedrijfsfeest DJ setup in Tilburg - Mr. DJ professional services"
};
```

### Schema.org ImageObject

```json
{
  "@type": "ImageObject",
  "contentUrl": "https://mr-dj.sevensa.nl/media/photos/hero/wedding-1.jpg",
  "description": "Professional wedding DJ performing in Eindhoven",
  "name": "Wedding DJ Eindhoven",
  "author": {
    "@type": "Organization",
    "name": "Mr. DJ"
  }
}
```

---

## 📋 Pre-Upload Checklist

### Voor Foto's
- [ ] Minimaal 1920px breed voor hero images
- [ ] Correct aspect ratio (zie tabel)
- [ ] Copyright/model releases aanwezig
- [ ] Geen persoonlijke data zichtbaar (privacy)
- [ ] Mr. DJ branding zichtbaar waar mogelijk
- [ ] Goede belichting en scherpte
- [ ] Diverse locaties/events vertegenwoordigd

### Voor Video's
- [ ] MP4 H.264 codec
- [ ] Maximaal 10MB (hero) / 5MB (testimonials)
- [ ] 1920×1080 of 1280×720 resolutie
- [ ] Eerste frame is visueel aantrekkelijk (poster)
- [ ] Audio genormaliseerd (-3dB peak)
- [ ] Ondertiteling embedded (testimonials)
- [ ] Geen auteursrechtelijke muziek

---

## 🚨 Emergency Rollback

Als nieuwe content problemen veroorzaakt:

```bash
# Rollback naar vorige versie
cd /srv/apps/mr-djv1
git checkout HEAD^ content/media/

# Rebuild
bash scripts/content/process-media.sh
docker-compose up -d --build eds-frontend

# Of: gebruik backup
cp -r /srv/backups/media-2025-10-17/ content/media/
```

---

## 📞 Hulp Nodig?

**Quick Commands**:
```bash
# Check media manifest
cat /srv/apps/mr-djv1/content/media/media-manifest.json | jq '.'

# List uploaded images
ls -lh /srv/apps/mr-djv1/content/media/photos/hero/

# Test image accessibility
curl -I https://mr-dj.sevensa.nl/media/photos/hero/dj-performance-1.jpg

# Rebuild media processing
bash /srv/apps/mr-djv1/scripts/content/process-media.sh --force
```

---

## ✅ Volgende Stappen

1. **Nu Direct**: Review deze documentatie
2. **Vandaag**: Verzamel eerste batch content (5 hero images, 10 gallery photos)
3. **Deze Week**: Upload + process eerste content, test op website
4. **Volgende Week**: Full gallery deployment (50+ images, 5 videos)

**Contact**: backend@sevensa.nl voor technische vragen
