# Mister DJ Website - Sitemap

## Site Structure

### 🏠 Homepage (`/`)
**Purpose**: Landing page with value proposition, services overview, social proof, and CTA
**Components Used**:
- HeroSection (with video background from showreel-001.mp4)
- Service Cards (Bruiloft, Feesten, Zakelijk)
- Stats/Metrics Section (15+ jaar, 2500+ events)
- Gallery Preview (6 featured images)
- Testimonials Section (3 testimonials with avatars)
- Pricing Overview
- FAQ Accordion (5 most common questions)
- Contact CTA
- Contact Form

**Key CTAs**:
- "Vraag Offerte Aan" (Primary)
- "Bekijk Portfolio" (Secondary)
- "Neem Contact Op" (Tertiary)

---

### 💍 Bruiloft DJ (`/bruiloft`)
**Purpose**: Wedding-specific services, packages, and showcase
**Components Used**:
- HeroSection (wedding-focused with bruiloft images)
- ServiceHighlight (ceremony, reception, evening party)
- PricingTable (3 wedding packages)
- Gallery Grid (21 bruiloft images)
- Testimonials (wedding-specific reviews)
- Timeline/Process Steps
- FAQ (wedding-specific questions)
- Contact Form

**Key CTAs**:
- "Bekijk Pakketten"
- "Vraag Bruiloft Offerte"
- "Plan Vrijblijvend Gesprek"

**Sub-sections**:
- Ceremonie muziek
- Receptie entertainment
- Avondfeest DJ
- Extras (Photobooth, Sax, Licht)

---

### 🎉 Feesten & Partijen (`/feesten`)
**Purpose**: Party and event services showcase
**Components Used**:
- HeroSection (party-focused with feest images)
- Service Grid (Drive-in shows, Verjaardagen, Jubilea, Corporate)
- Gallery Grid (28 feest images)
- Video Showcase (showreels)
- PricingTable (flexible packages)
- Testimonials (party-specific)
- FAQ
- Contact Form

**Key CTAs**:
- "Bekijk Mogelijkheden"
- "Vraag Offerte"

**Event Types**:
- Drive-in shows
- Verjaardagsfeesten (50+, 60+, etc.)
- Jubilea
- Openings
- Festivals

---

### 💼 Zakelijke Events (`/zakelijk`)
**Purpose**: Corporate event services
**Components Used**:
- HeroSection (corporate-focused)
- Service Highlights (Bedrijfsfeesten, Beurzen, Product launches)
- Case Studies (3-4 corporate events)
- Benefits/USPs for corporate clients
- Testimonials (B2B focused)
- FAQ (corporate-specific)
- Contact Form (with company field)

**Key CTAs**:
- "Plan Bedrijfsfeest"
- "Vraag Corporate Offerte"

---

### 📸 Portfolio/Galerij (`/galerij`)
**Purpose**: Full media gallery with photos and videos
**Components Used**:
- Gallery Tabs (Bruiloften, Feesten, Video's, Team)
- Filterable Gallery Grid
- Lightbox/Modal for image viewing
- Video Player for testimonials and showreels
- Category Tags

**Sections**:
- Bruiloften (21 images)
- Feesten (28 images)
- Video's (6 showreels + 4 testimonials)
- Team (6 team photos)
- Locaties (4 venue photos)

**Filters**:
- Type: Bruiloft, Feest, Corporate, Video
- Year: 2024, 2023, 2022
- Locatie: Eindhoven, Tilburg, Den Bosch, etc.

---

### 👥 Over Ons (`/over-ons`)
**Purpose**: About page with team, story, values
**Components Used**:
- HeroSection (team-focused)
- Story Timeline (15+ jaar geschiedenis)
- Team Cards (6 team members)
- Values/USPs Grid
- Stats Section
- Call to Action

**Content**:
- Company story
- Team introductions (6 team members with photos)
- Values (Professioneel, Betrouwbaar, Persoonlijk)
- Equipment showcase
- Certifications/Partners

---

### 💰 Pakketten & Prijzen (`/prijzen`)
**Purpose**: Detailed pricing and package information
**Components Used**:
- HeroSection
- PricingTable (3-tier: Basis, All-In, Premium)
- Comparison Table
- Add-ons Grid (Photobooth, Sax, Extra verlichting)
- FAQ (pricing-specific)
- Contact CTA

**Packages**:
1. **Basis** (€695)
   - DJ 4 uur
   - Standaard geluid/licht
   - Voor- en nabespreking

2. **All-In** (€1295)
   - DJ 6 uur
   - Premium geluid/licht
   - Photobooth 2 uur
   - Onbeperkte muziekwensen

3. **Premium** (Op aanvraag)
   - DJ hele dag
   - Ceremonie + receptie + avond
   - Live saxofonist
   - Premium verlichting
   - Video impressie

---

### 📞 Contact (`/contact`)
**Purpose**: Contact information and inquiry form
**Components Used**:
- HeroSection (contact-focused)
- ContactForm (enhanced with all fields)
- Contact Information Cards (Phone, Email, Address)
- Map (Google Maps embed)
- Social Media Links
- Working Hours
- Response Time Guarantee

**Form Fields**:
- Naam
- Email
- Telefoon
- Type evenement (Select)
- Datum evenement (DatePicker)
- Locatie
- Aantal gasten
- Budget range
- Bericht
- Nieuwsbrief opt-in (Checkbox)

---

### ❓ FAQ (`/faq`)
**Purpose**: Comprehensive FAQ page
**Components Used**:
- HeroSection
- FAQ Accordion (categorized)
- Category Tabs (Algemeen, Bruiloft, Prijzen, Technisch)
- Search functionality

**Categories**:
- Algemeen (15 vragen)
- Bruiloft-specifiek (10 vragen)
- Prijzen & Pakketten (8 vragen)
- Technisch & Logistiek (7 vragen)

---

### 📝 Blog/Tips (`/blog`) [FUTURE]
**Purpose**: SEO content, tips, inspiration
**Future implementation**

---

## Navigation Structure

### Header (Desktop)
```
Logo | Home | Diensten ▾ | Portfolio | Over Ons | Prijzen | Contact | [Offerte Aanvragen]
             |
             └─ Bruiloft DJ
             └─ Feesten & Partijen
             └─ Zakelijke Events
```

### Header (Mobile)
```
Logo [Menu ☰]
```

### Footer
```
Column 1: Diensten        Column 2: Info          Column 3: Contact       Column 4: Social
- Bruiloft DJ             - Over Ons             - Tel: XXX              - Instagram
- Feesten & Partijen      - Portfolio            - Email: XXX            - Facebook
- Zakelijke Events        - Prijzen              - Adres: XXX            - YouTube
                          - FAQ
                          - Blog

Bottom: © 2025 Mister DJ | Privacy | Voorwaarden | Sitemap
```

---

## User Journeys

### Journey 1: Bruiloft Boeking
1. Homepage → HeroSection CTA "Bruiloft DJ"
2. `/bruiloft` → Browse packages and gallery
3. View wedding testimonials
4. Check FAQ
5. Click "Vraag Bruiloft Offerte"
6. Fill contact form
7. Confirmation page

### Journey 2: Quick Quote
1. Homepage → CTA "Vraag Offerte"
2. Contact form modal/page
3. Submit
4. Confirmation

### Journey 3: Browse & Inspire
1. Homepage → "Bekijk Portfolio"
2. `/galerij` → Filter bruiloft photos
3. View testimonial videos
4. Navigate to `/bruiloft`
5. Request quote

### Journey 4: Research & Compare
1. Organic search → `/prijzen`
2. Compare packages
3. Check FAQ
4. View `/over-ons` for credibility
5. Contact via form or phone

---

## SEO Strategy

### Primary Keywords
- feest dj zuid nederland
- dj bruiloft brabant
- dj bedrijfsfeest
- bruiloft dj eindhoven
- feest dj tilburg

### Page-Specific Keywords
- `/`: Main keywords + brand
- `/bruiloft`: wedding dj, trouw dj, bruiloft entertainment
- `/feesten`: feest dj, party dj, drive-in show
- `/zakelijk`: bedrijfsfeest dj, corporate dj, evenementen dj
- `/galerij`: dj portfolio, bruiloft foto's, feest impressies
- `/prijzen`: dj kosten, bruiloft dj prijs, feest dj tarief

### Content Strategy
- Rich media (photos, videos)
- Testimonials on every service page
- FAQ schema markup
- LocalBusiness schema
- Breadcrumbs
- Alt text on all images

---

## Technical Requirements

### Performance Goals
- Lighthouse Score: 90+
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1

### Image Optimization
- WebP format with JPEG fallback
- Lazy loading below fold
- Responsive images (srcset)
- Proper sizing (no oversized images)

### Video Optimization
- MP4 format compressed
- Poster images for all videos
- Lazy loading
- Autoplay muted for hero sections

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- ARIA labels
- Focus indicators
- Alt text on all images

---

## Analytics & Tracking

### Key Events to Track
- CTA clicks (primary, secondary)
- Form submissions
- Video plays
- Gallery interactions
- Phone number clicks
- Email clicks
- PDF downloads (price lists)

### Conversion Goals
1. Contact form submission
2. Phone call (click-to-call)
3. Quote request
4. Newsletter signup

---

## A/B Test Opportunities

1. **Hero CTA**: "Vraag Offerte" vs "Plan Gesprek" vs "Bekijk Pakketten"
2. **Hero Media**: Video autoplay vs static image
3. **Pricing Display**: Tiers vs à la carte vs contact-only
4. **Social Proof**: Text testimonials vs video testimonials
5. **Gallery Layout**: Grid vs masonry vs carousel

---

## Mobile-First Considerations

### Mobile Navigation
- Sticky header with CTA
- Hamburger menu
- Quick links: Call, WhatsApp, Email

### Mobile Optimizations
- Click-to-call buttons prominent
- Simplified forms (fewer fields)
- Vertical stack layouts
- Touch-friendly buttons (min 44x44px)
- Reduced video autoplay on mobile

---

## Implementation Priority

### Phase 1 (MVP) - Core Pages
1. ✅ Homepage (`/`)
2. ✅ Bruiloft (`/bruiloft`)
3. ✅ Contact (`/contact`)
4. ✅ Portfolio (`/galerij`)

### Phase 2 - Service Pages
5. Feesten (`/feesten`)
6. Zakelijk (`/zakelijk`)
7. Prijzen (`/prijzen`)

### Phase 3 - Supporting Pages
8. Over Ons (`/over-ons`)
9. FAQ (`/faq`)

### Phase 4 - Enhancement
10. Blog setup
11. Advanced filtering
12. Booking system integration
