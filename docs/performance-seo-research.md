# Performance, Vindbaarheid & Klantfit Onderzoek

## Aanpak
- **Code-audit:** review van frontend HTML/CSS/JS en backend API-routes op performance, SEO en personalisatie.
- **Meetpunten:** Core Web Vitals best practices, structured data vereisten (Schema.org), inhoudelijke relevantie voor primaire doelgroepen (bruiloften, bedrijfsfeesten, private events).
- **Data:** huidige configuraties in `frontend/public/index.html`, `frontend/public/assets/js/main.js`, API responses en documentatie.

## Bevindingen
### Snelheid
- JavaScript laadt direct bij DOMContentLoaded, waardoor catalogusdata altijd fetcht, ook wanneer een gebruiker de secties niet bekijkt.
- Afbeeldingen missen `loading="lazy"` en er ontbreekt een duidelijke critical rendering strategie (preload, deferred scripts).
- Backend responses voor pakketten en reviews worden elke request opnieuw opgehaald, zonder cachinglaag.

### Vindbaarheid (SEO)
- Er ontbrak gestructureerde data (LocalBusiness/Service/FAQ) en sitemap/robots configuratie, waardoor zoekmachines minder context krijgen.
- Meta-informatie focust op algemene keywords; er zijn geen Open Graph/Twitter tags of canonical URL.
- Geen FAQ- of persona-content die inspeelt op zoekintentie ("DJ bruiloft Brabant", "DJ bedrijfsfeest Eindhoven" enz.).

### Relevantie & Klantmatch
- Content benoemt doelgroep breed, maar er is geen interactieve begeleiding richting het meest relevante aanbod of CTA.
- Contactformulier vraagt type event, maar er is geen koppeling tussen gekozen persona en voorgestelde pakketten/boodschappen.
- Reviews/pakketten missen context over regio en waardepropositie (dansgarantie, personalisatie).

## Aanbevolen & Geïmplementeerde Verbeteringen
- **Lazy fetch & critical path optimalisatie:** assets preladen, script `defer`, lazy loading van catalogusdata.
- **Runtime caching:** gedeelde in-memory cache met TTL voor pakketten en reviews zodat API snel blijft en rate-limits gerespecteerd worden.
- **SEO uitbreidingen:** JSON-LD (`LocalBusiness`, `Service`, `FAQPage`), canonical, social meta, sitemap en robots configuratie.
- **Persona Fit Finder:** interactieve sectie die per doelgroep (bruiloft, bedrijfsfeest, private party) voordelen, bewijs en aanbevolen pakketten toont én de contactaanvraag personaliseert.
- **FAQ content:** beantwoording van topvragen (duur, dansgarantie, regio, apparatuur) voor hogere relevantie en featured snippet kansen.

## Open Volgende Stappen
- Integreren van performance monitoring (bijv. Lighthouse CI) in de pipeline.
- Uitbreiden van content vanuit CMS zodat marketingteam persona-copy kan beheren.
- Overwegen van edge caching / CDN voor API als load toeneemt en externe mailproviders geïntegreerd zijn.

