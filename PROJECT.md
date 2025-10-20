# Mr. DJ - Project Documentation

**Version**: 1.0
**Last Updated**: 16 Oktober 2025
**Status**: Production Ready (Staging)
**Live URL**: https://staging.sevensa.nl

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Development History](#development-history)
6. [Sitemap & Routes](#sitemap--routes)
7. [Deployment](#deployment)
8. [Development Workflow](#development-workflow)
9. [Best Practices](#best-practices)

---

## 📖 Project Overview

### Business Description

**Mr. DJ** is een professionele DJ service gespecialiseerd in bruiloften, bedrijfsfeesten, en private events in Noord-Brabant en Limburg. Het unieke selling point is de combinatie van DJ + live saxofonist (Leslie Moore) voor een unieke live muziekervaring.

### Project Goals

1. **Local SEO Dominance**: 110+ stad-specifieke landingspagina's voor maximale lokale vindbaarheid
2. **Lead Generation**: Conversie-geoptimaliseerde landingspagina's met call-to-actions
3. **Brand Authority**: Professionele uitstraling met design system en consistente branding
4. **Performance**: Sub-3 seconde page load times, 90+ Lighthouse scores
5. **Scalability**: Modulaire architectuur voor eenvoudige uitbreiding

### Target Audience

- **Primary**: Bruidsparen (25-35 jaar) in Noord-Brabant en Limburg
- **Secondary**: Bedrijven voor corporate events
- **Tertiary**: Private feesten (verjaardagen, jubilea)

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Internet (HTTPS)                          │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                    ┌───────────▼──────────┐
                    │   Traefik Proxy       │
                    │  (Reverse Proxy)      │
                    │  - HTTPS/SSL          │
                    │  - Let's Encrypt      │
                    │  - Load Balancing     │
                    └───────────┬───────────┘
                                │
                ┌───────────────┴───────────────┐
                │                               │
        ┌───────▼────────┐            ┌────────▼────────┐
        │  Frontend       │            │   Backend API    │
        │  (React SPA)    │◄──────────►│   (Node.js)     │
        │  - Nginx        │            │   - Express     │
        │  - React 19     │            │   - REST API    │
        │  - Vite Build   │            └────────┬────────┘
        └─────────────────┘                     │
                                       ┌────────▼────────┐
                                       │   PostgreSQL    │
                                       │   Database      │
                                       └─────────────────┘
                                                │
                                       ┌────────▼────────┐
                                       │   Redis Cache   │
                                       │   (Sessions)    │
                                       └─────────────────┘
```

### Component Architecture (Frontend)

**Atomic Design Pattern** - Components georganiseerd in hiërarchische lagen:

```
src/components/
├── Atoms/           # Kleinste bouwstenen (Buttons, Inputs, Icons)
├── Molecules/       # Combinaties van Atoms (SearchBar, Card)
├── Organisms/       # Complexe componenten (Navigation, Footer, HeroSection)
├── Templates/       # Page layouts (DjSaxLanding, LocalSeoPage)
└── ui/             # Shadcn/ui components (Dialog, Sheet, etc.)
```

### Routing Architecture

**React Router v6** - Client-side routing met dynamic routes:

```javascript
Routes:
  /                            → DjSaxLanding (Homepage)
  /dj-in-:citySlug             → LocalSeoPage (55 general DJ pages)
  /bruiloft-dj-:citySlug       → LocalSeoPage (55 wedding DJ pages)
```

### Data Architecture

**Local SEO Data** - Stad-specifieke content in JSON-achtige structuur:

```javascript
{
  city: "Eindhoven",
  province: "Noord-Brabant",
  slug: "eindhoven",
  localUSP: "...",
  localReviews: "...",
  localVenues: ["Evoluon", "Parktheater", ...],
  seoTitle: "DJ Huren in Eindhoven | ...",
  seoDescription: "..."
}
```

**55 cities** × **2 service types** = **110 unique landing pages**

---

## 🛠️ Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.x | UI framework met hooks en Suspense |
| **Vite** | 6.3.5 | Build tool & dev server (Hot Module Replacement) |
| **React Router** | 6.x | Client-side routing met dynamic parameters |
| **React Helmet** | 6.x | Dynamic SEO meta tags per pagina |
| **Tailwind CSS** | 4.1.7 | Utility-first CSS framework |
| **Shadcn/ui** | Latest | Pre-built accessible components |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18.x | Runtime environment |
| **Express.js** | 4.x | REST API framework |
| **PostgreSQL** | 15 | Relational database (bookings, contacts) |
| **Redis** | 7 | Caching & session storage |

### Infrastructure

| Technology | Version | Purpose |
|------------|---------|---------|
| **Docker** | 24.x | Containerization |
| **Docker Compose** | 2.x | Multi-container orchestration |
| **Traefik** | 2.x | Reverse proxy & automatic HTTPS |
| **Nginx** | Alpine | Static file serving voor React SPA |
| **Let's Encrypt** | - | Free SSL certificates (auto-renewal) |

### Development Tools

| Technology | Purpose |
|------------|---------|
| **Git** | Version control |
| **ESLint** | JavaScript linting |
| **Prettier** | Code formatting |
| **Storybook** | Component development & documentation |

---

## 📁 Project Structure

```
/opt/mr-dj/
├── frontend/                    # Nginx frontend container
│   ├── Dockerfile              # Nginx Alpine image
│   ├── nginx.conf              # Nginx configuration met SPA routing
│   └── public/                 # Built React SPA artifacts
│       ├── index.html          # Entry point (generated by Vite)
│       └── assets/             # JS/CSS bundles (hashed filenames)
│
├── backend/                    # Node.js/Express API
│   ├── Dockerfile              # Node.js image
│   ├── package.json            # NPM dependencies
│   ├── server.js               # Express server entry point
│   └── routes/                 # API endpoints
│       ├── contacts.js         # Contact form submissions
│       └── bookings.js         # Booking requests
│
├── database/                   # PostgreSQL initialization
│   └── init.sql               # Database schema setup
│
├── mr-dj-eds-components/       # React source code
│   ├── src/
│   │   ├── App.jsx            # Main React app & routing
│   │   ├── App.css            # Global Tailwind CSS
│   │   ├── main.jsx           # React entry point
│   │   ├── components/        # Atomic Design components
│   │   │   ├── Atoms/
│   │   │   ├── Molecules/
│   │   │   ├── Organisms/
│   │   │   └── Templates/
│   │   └── data/              # Local SEO content
│   │       ├── local_seo_data.js            # 55 general DJ pages
│   │       └── local_seo_bruiloft_data.js   # 55 wedding DJ pages
│   ├── index.html             # HTML template
│   ├── vite.config.js         # Vite build configuration
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   └── package.json           # NPM dependencies
│
├── docs/                       # Documentation & brand assets
│   └── brand-guidelines/
│       └── Mr_DJ_Brand_Guidelines_EXTENDED.md
│
├── docker-compose.yml          # Multi-container orchestration
├── TODO.md                     # Development task list
├── LANDINGPAGES.md            # Sitemap met alle 110+ pages
└── PROJECT.md                  # This file

```

---

## 📜 Development History

### Initial Development Phase (Commits 7d3af11 - 6e7045d)

**Period**: Begin project
**Focus**: Infrastructure setup

- Initial Docker setup met Nginx, PostgreSQL, Redis
- Traefik reverse proxy configuratie
- Brand guidelines documentatie
- Basic website structuur

### Design System Development (Commits c6336a3 - b1193b6)

**Period**: Component library fase
**Focus**: React Component Library met Atomic Design

**Key Milestones**:
- 31 slides geconverteerd naar React components (Atoms, Molecules, Organisms)
- Storybook setup voor component development
- Design tokens implementation (colors, spacing, typography)
- Buttons, Navigation, Forms, Icons, Testimonials components

**Deliverables**:
- Complete component library volgende Atomic Design principles
- Reusable button variants (primary, secondary, outline, ghost)
- Navigation component met responsive design
- Form components met validatie

### Local SEO Implementation (Commits 167941d - fdd12a6)

**Period**: Local SEO landingspagina's
**Focus**: Dynamische stad-specifieke content

**Task T5 - LocalSeoPage Component**:
- Dynamische LocalSeoPage template component
- Initial data structure voor stad-specifieke content
- JSX error fixes en component refactoring

**Task T6 - React Router Integration**:
- React Router v6 implementatie
- Dynamic routes: `/dj-in-:citySlug` pattern
- LocalSeoPage component refactoring voor routing

**Task T7 - Local SEO Data Generation**:
- **55 stad-specifieke records** voor Noord-Brabant (30) en Limburg (25)
- Unieke content per stad: localUSP, localReviews, localVenues
- SEO-geoptimaliseerde titles en descriptions
- **Duplicate voor Bruiloft DJ pages**: 55 extra pages met bruiloft-specifieke content

**Total**: **110 landing pages** (55 general DJ + 55 wedding DJ)

### Advanced Features & SEO (Commits 206732e - a17057f)

**Period**: Performance & tracking
**Focus**: Technical SEO, analytics, performance

**Task T8 - Schema.org & GTM**:
- LocalBusiness schema markup per stad
- Event schema voor DJ services
- Google Tag Manager integration (GTM-PLACEHOLDER)
- Google Consent Mode v2 (GDPR compliance)

**Task T10/T11/T12 - SEO & A/B Testing**:
- Internal linking tussen stad-pagina's
- A/B testing framework met variant support
- SEA tracking placeholders voor toekomstige campaigns

**Task T6 - Code Splitting**:
- React.lazy() voor Templates (DjSaxLanding, LocalSeoPage)
- Suspense fallback met loading state
- Performance optimalisatie: faster initial load

### Traefik Integration & Production Prep (Commits 433a9b3 - 8f5a8d7)

**Period**: Deployment fase
**Focus**: Production-ready infrastructure

**Changes**:
- Traefik labels voor automatic routing
- Let's Encrypt SSL certificate automation
- Service renaming: `mr-dj-eds-frontend`, `mr-dj-backend`, etc.
- Network configuration: `mr-dj_mr-dj-network`
- Health checks voor PostgreSQL en Redis

### React SPA Deployment (Commit e2fea4f)

**Date**: 16 Oktober 2025, 04:21 UTC
**Focus**: Production deployment

**Major Update**:
- Replaced static HTML with React SPA build
- All 55+ local SEO landing pages deployed
- Nginx configuration: SPA routing met `try_files`
- Docker image rebuild en deployment
- Documentation: TODO.md en LANDINGPAGES.md toegevoegd

**Result**: **110+ pages live** op staging.sevensa.nl

### Title Optimization & Conflict Resolution (Commit b01edf0)

**Date**: 16 Oktober 2025, 04:36 UTC
**Focus**: SEO titles en merge conflicts

**Task T1.3 Completed**:
- Main index.html title: "Mister DJ - Dé Feestspecialist van het Zuiden"
- React Helmet toegevoegd aan DjSaxLanding homepage
- LocalSeoPage verified: dynamic city-specific titles via Helmet

**Merge Conflicts Resolved**:
1. `tailwind.config.js`: ES module syntax (export default)
2. `Buttons.jsx`: Functional Button component
3. `App.css`: Tailwind CSS configuration
4. `local_seo_data.js`: Quote syntax fixes (Heerlen, Venlo, Valkenburg)

**Progress**: 1/18 tasks complete (6%)

---

## 🗺️ Sitemap & Routes

### Homepage

**URL**: `https://staging.sevensa.nl/`
**Component**: `DjSaxLanding`
**Features**:
- Hero section: DJ + Saxofoon combo (Leslie Moore)
- Features/USP section: Live interactie, unieke sound, all-in prijs
- Testimonials carousel
- Pricing tables: Brons (€795), Zilver (€995), Goud (€1295)
- Availability checker
- Call-to-action footer

**SEO**:
- Title: "Mister DJ - Dé Feestspecialist van het Zuiden"
- Meta description: DJ + Saxofoon live ervaring voor bruiloften en bedrijfsfeesten

---

### Local SEO Landing Pages (110 pages)

#### General DJ Services (55 pages)

**URL Pattern**: `/dj-in-[stad]`
**Example**: `/dj-in-eindhoven`, `/dj-in-tilburg`
**Target**: Corporate events, private feesten, algemene DJ bookings

**Content Per Page**:
- Hero: "Uw DJ voor Feesten in [Stad], [Provincie]"
- Local USP: Stad-specifieke unique selling proposition
- Local Venues: Bekende locaties in de stad (4-5 venues)
- Local Testimonials: Stad-specifieke review quote
- Pricing section: 3 pakketten (herbruikbaar)
- Internal linking: Links naar andere steden & bruiloft variant
- Schema.org: LocalBusiness + Event markup

**SEO Per Page**:
- Title: "DJ Huren in [Stad] | De Beste Feest DJ voor uw Event"
- Description: Stad-specifieke meta description (< 160 chars)
- H1: "Uw DJ voor Feesten in [Stad], [Provincie]"

#### Wedding DJ Services (55 pages)

**URL Pattern**: `/bruiloft-dj-[stad]`
**Example**: `/bruiloft-dj-eindhoven`, `/bruiloft-dj-maastricht`
**Target**: Bruidsparen, trouwfeesten, ceremonie muziek

**Content Differences**:
- Bruiloft-specifieke USP (romantic, elegant tone)
- Wedding venues highlighted
- Bruiloft testimonials
- Extra content: Ceremonie muziek, first dance begeleiding

**Total**: **55 cities × 2 service types = 110 landing pages**

---

### City Coverage

#### Noord-Brabant (30 cities)

Eindhoven, Tilburg, Breda, 's-Hertogenbosch, Helmond, Roosendaal, Oss, Bergen op Zoom, Oosterhout, Waalwijk, Veenendaal, Uden, Veghel, Best, Veldhoven, Etten-Leur, Rosmalen, Goirle, Kaatsheuvel, Dongen, Boxtel, Geldrop, Heeze, Valkenswaard, Schijndel, Drunen, Rijen, Zevenbergen, Made, Zundert

#### Limburg (25 cities)

Maastricht, Venlo, Sittard-Geleen, Heerlen, Roermond, Weert, Kerkrade, Brunssum, Landgraaf, Stein, Beek, Meerssen, Valkenburg, Echt-Susteren, Gennep, Venray, Panningen, Tegelen, Hoensbroek, Simpelveld, Eijsden, Reuver, Haelen, Nederweert, Horst

**Complete list**: See [LANDINGPAGES.md](LANDINGPAGES.md)

---

## 🚀 Deployment

### Current Deployment

**Environment**: Staging
**URL**: https://staging.sevensa.nl
**Server**: VPS met Docker & Traefik
**SSL**: Let's Encrypt (auto-renewal)

### Container Stack

| Container | Image | Port | Purpose |
|-----------|-------|------|---------|
| `mr-dj-eds-frontend` | nginx:alpine | 80 | React SPA serving |
| `mr-dj-backend` | node:18-alpine | 3000 | REST API |
| `mr-dj-postgres` | postgres:15-alpine | 5432 | Database |
| `mr-dj-redis` | redis:7-alpine | 6379 | Cache & sessions |
| `mr-dj-traefik` | traefik:2.x | 80/443/8080 | Reverse proxy |

### Traefik Routing

```yaml
Routers:
  mrdj-eds-frontend:
    Rule: Host(`staging.sevensa.nl`)
    Entrypoint: websecure (443)
    TLS: Let's Encrypt automatic
    Service: mrdj-eds-frontend (port 80)

  mrdj-backend:
    Rule: Host(`staging.sevensa.nl`) && PathPrefix(`/api`)
    Entrypoint: websecure (443)
    TLS: Let's Encrypt
    Service: mrdj-backend (port 3000)
    Middleware: Strip prefix /api
```

### Build & Deploy Process

```bash
# 1. Build React SPA
cd /opt/mr-dj/mr-dj-eds-components
npm run build

# 2. Copy build artifacts
cp -r dist/* /opt/mr-dj/frontend/public/

# 3. Rebuild Docker image
cd /opt/mr-dj
docker compose build eds-frontend

# 4. Restart container
docker compose up -d eds-frontend

# 5. Verify deployment
curl -I https://staging.sevensa.nl/
```

### Production Deployment (Future)

**Target Domain**: www.mr-dj.nl
**Requirements**:
1. Update Traefik Host rules: `staging.sevensa.nl` → `www.mr-dj.nl`
2. Update CORS_ORIGIN in backend environment
3. Configure GTM container ID (replace GTM-PLACEHOLDER)
4. Setup Complianz/Cookiebot site ID
5. Update sitemap.xml met production URLs
6. Submit sitemap to Google Search Console

---

## 🔧 Development Workflow

### Local Development

```bash
# 1. Clone repository
git clone https://github.com/crisisk/mr-djv1.git
cd mr-djv1

# 2. Install dependencies
cd mr-dj-eds-components
npm install

# 3. Start dev server
npm run dev
# → http://localhost:5173

# 4. Build for production
npm run build
```

### Making Changes

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes
# Edit files in mr-dj-eds-components/src/

# 3. Test locally
npm run dev

# 4. Build production
npm run build

# 5. Commit changes
git add .
git commit -m "feat: Add new feature"

# 6. Push to remote
git push origin feature/new-feature
```

### Adding New City

To add a new city to local SEO pages:

1. **Edit data file**: `mr-dj-eds-components/src/data/local_seo_data.js`

```javascript
{
    city: "NieuwStad",
    province: "Noord-Brabant",
    slug: "nieuwstad",
    localUSP: "Unique proposition for NieuwStad...",
    localReviews: "Review quote from NieuwStad customer...",
    localVenues: ["Venue 1", "Venue 2", "Venue 3"],
    seoTitle: "DJ Huren in NieuwStad | De Beste Feest DJ",
    seoDescription: "Description < 160 chars..."
}
```

2. **Duplicate for wedding variant**: Add to `local_seo_bruiloft_data.js`

3. **Rebuild**: `npm run build`

4. **Update LANDINGPAGES.md**: Document new URLs

5. **Commit**: `git commit -m "feat: Add NieuwStad landing pages"`

---

## ✅ Best Practices

### Code Standards

**React Components**:
- Functional components met hooks (geen class components)
- Prop destructuring in function parameters
- PropTypes of TypeScript voor type checking (future)
- Atomic Design: Atoms → Molecules → Organisms → Templates

**Naming Conventions**:
- Components: PascalCase (`DjSaxLanding.jsx`)
- Functions: camelCase (`getLocalSeoData()`)
- Constants: UPPER_SNAKE_CASE (`LOCAL_SEO_DATA`)
- CSS classes: kebab-case or Tailwind utilities

**File Organization**:
```
ComponentName/
  ComponentName.jsx        # Main component
  ComponentName.test.jsx   # Tests (future)
  ComponentName.stories.jsx # Storybook story
```

### Performance Optimization

1. **Code Splitting**:
   - Use `React.lazy()` voor route-based components
   - Suspense boundaries voor loading states

2. **Image Optimization**:
   - WebP format met fallback
   - Lazy loading: `loading="lazy"`
   - Responsive images met srcset

3. **Bundle Size**:
   - Tree shaking: Vite automatic
   - Minification: Production builds only
   - Gzip compression: Nginx enabled

4. **Caching**:
   - Static assets: `Cache-Control: public, max-age=31536000, immutable`
   - HTML: `Cache-Control: no-cache`

### SEO Best Practices

1. **Technical SEO**:
   - Unique `<title>` per pagina (< 60 chars)
   - Meta description < 160 chars
   - H1 per page (exactly one)
   - Semantic HTML (header, nav, main, footer, article)
   - Schema.org structured data

2. **Local SEO**:
   - City name in title, H1, first paragraph
   - Local landmarks and venues mentioned
   - LocalBusiness schema per stad
   - Internal linking tussen stad-pagina's

3. **Content**:
   - Unique content per page (geen duplicate)
   - Natural keyword integration
   - Local testimonials en reviews
   - Call-to-action op strategic plaatsen

### Security Best Practices

1. **Environment Variables**:
   - NEVER commit secrets to Git
   - Use `.env` files (add to `.gitignore`)
   - Rotate passwords/keys regularly

2. **HTTPS Everywhere**:
   - Traefik automatic SSL
   - HSTS headers enabled
   - Secure cookies: `HttpOnly`, `Secure`, `SameSite`

3. **Input Validation**:
   - Server-side validation altijd
   - Client-side validation voor UX
   - Sanitize user input (XSS prevention)

### Docker Best Practices

1. **Multi-stage Builds**:
   - Build stage: Install deps, compile
   - Production stage: Copy artifacts only

2. **Layer Caching**:
   - Copy `package.json` first
   - Run `npm install`
   - Copy source code last

3. **Health Checks**:
   - All containers have health checks
   - Dependencies: `depends_on` met `condition: service_healthy`

4. **Networks**:
   - Isolated networks per project
   - External network voor Traefik communication

---

## 📊 Project Metrics

**Total Components**: 50+ React components
**Total Pages**: 110+ (1 homepage + 55 general + 55 wedding)
**Code Base**: ~15,000 lines of code
**Build Time**: ~3.5 seconds (Vite)
**Bundle Size**:
- CSS: 84.65 kB (13.88 kB gzipped)
- JavaScript: 295 kB (84.76 kB gzipped)

**Performance Targets**:
- First Contentful Paint: < 2s
- Time to Interactive: < 3s
- Lighthouse Score: > 90

---

## 🔮 Future Roadmap

See [TODO.md](TODO.md) voor complete task list.

**High Priority**:
- T1.1: Configure GTM container ID
- T1.2: Setup Complianz/Cookiebot
- T2.1: Backend API integration (contact forms, bookings)

**Medium Priority**:
- T2.2: Add official Mr. DJ logo
- T2.3: Contact form functionality
- T2.4: Schema.org verification (Google Rich Results)

**Nice to Have**:
- T3.1: Testimonials carousel (auto-play)
- T3.2: Client logos ("Vertrouwd door")
- T3.3: "Over Ons" section
- T3.5: Performance optimization (Lighthouse audit)

---

## 📞 Contact & Support

**Project Owner**: Sevensa
**Developer**: Claude Code (Anthropic)
**Repository**: https://github.com/crisisk/mr-djv1
**Issues**: GitHub Issues

**Business Contact**:
- Telefoon: +31 (0) 40 8422594
- Email: info@mr-dj.nl
- Website: https://staging.sevensa.nl (staging)

---

**Last Updated**: 16 Oktober 2025, 04:40 UTC
**Document Version**: 1.0
**Status**: ✅ Complete & Up-to-date

---

🤖 *Generated with [Claude Code](https://claude.com/claude-code)*
