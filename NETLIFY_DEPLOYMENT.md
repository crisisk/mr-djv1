# Mr. DJ - Netlify Deployment Guide

## 🚀 Quick Start (5 minuten!)

### Stap 1: Connect GitHub Repo
1. Log in op [Netlify](https://app.netlify.com)
2. Klik "Add new site" → "Import an existing project"
3. Kies "GitHub"
4. Selecteer repository: `crisisk/mr-djv1`
5. Klik "Authorize Netlify"

### Stap 2: Configure Build Settings
Netlify detecteert automatisch de `netlify.toml` configuratie!

**Verify deze settings:**
- **Build command:** `npm ci --prefix frontend && npm run build --prefix frontend`
- **Publish directory:** `frontend/dist`
- **Branch:** `main`

Klik "Deploy site"

### Stap 3: Wait for Deployment (1-2 minuten)
Netlify bouwt en deploy automatisch!

Je krijgt een URL zoals: `https://mr-dj-abc123.netlify.app`

### Stap 3b: Snellere vervolgbuilds met caching
- De `netlify.toml` cachet nu standaard `frontend/.npm` (npm package tarballs) en `frontend/node_modules`.
- Eerste build: blijft ~1-2 minuten (download + caching van dependencies).
- Vervolgbuilds: npm kan direct uit de cache installeren en hoeft alleen gewijzigde packages binnen te halen.
- Resultaat: snellere previews, minder build-minuten en sneller lokaal testen via de Netlify CLI.

> ℹ️ **Geen CMS/Identity nodig:** Deze site wordt als statische Vite-build geleverd. Netlify Identity en Git Gateway hoeven niet geactiveerd te worden.

---

## 🎯 Custom Domain (Optioneel)

### Optie A: mr-dj.nl wijzen naar Netlify
1. Netlify: Site settings → Domain management
2. Klik "Add custom domain"
3. Vul in: `mr-dj.nl`
4. Netlify geeft je DNS instructies
5. Update DNS bij domain provider:
   - A record: `75.2.60.5`
   - CNAME www: `jouw-site.netlify.app`
6. Wait 24-48 uur voor DNS propagation
7. Netlify activeert automatisch HTTPS!

### Optie B: Subdomain (staging.mr-dj.nl)
1. Zelfde stappen als Optie A
2. Maar gebruik: `staging.mr-dj.nl`
3. CNAME: `staging` → `jouw-site.netlify.app`

---

## 📊 Performance & Monitoring

### Lighthouse Scores (Verwacht)
- **Performance:** 95-100
- **Accessibility:** 90-95
- **Best Practices:** 95-100
- **SEO:** 90-95

### Lighthouse Performance Budgets
- `@netlify/plugin-lighthouse` bewaakt nu resource- en timing-budgets.
- Budgets: scripts ≤ 180 KB, totale pagina ≤ 500 KB, interactief ≤ 4s, FCP ≤ 2s.
- Deploys falen pas na review, maar logs tonen direct waar overschrijdingen plaatsvinden.
- Bewaakt regressies automatisch voor `/` en kan worden uitgebreid voor andere routes.

### Netlify Analytics (Optioneel, €9/mnd)
- Real-time visitor stats
- No cookies needed
- GDPR compliant
- Better than Google Analytics voor privacy

---

## 🔧 Troubleshooting

### Content Updates Niet Zichtbaar?
1. Controleer of de laatste commit met content-wijzigingen naar `main` is gepusht
2. Wacht 1-2 minuten voor de Netlify rebuild
3. Doe een harde refresh in de browser (Ctrl+Shift+R)
4. Bekijk de Netlify deploy log op build-fouten

### Build Fails?
1. Check Netlify deploy log
2. Meestal: file path issue
3. Fix in GitHub → Auto redeploy

---

## 💰 Kosten

**Gratis Tier:**
- ✅ 100 GB bandwidth/mnd
- ✅ 300 build minuten/mnd
- ✅ Unlimited sites
- ✅ HTTPS/SSL included
- ✅ CDN included
- ✅ Identity (optioneel): 1,000 users (niet nodig voor deze site)

**Genoeg voor Mr. DJ!** 🎉

Alleen betalen als:
- > 100 GB traffic (€20/100 GB extra)
- > 300 build min (€7/500 min extra)
- Netlify Analytics gewenst (€9/mnd)

**Verwacht: €0/mnd** voor eerste 6-12 maanden!

---

## 🎉 Benefits

✅ **Blazing Fast:** CDN worldwide  
✅ **Auto HTTPS:** SSL certificates included  
✅ **Auto Deploy:** Push to GitHub → Live in 2 min  
✅ **Rollback:** Easy rollback to previous version
✅ **Preview:** Deploy previews for every PR  
✅ **Forms:** Netlify Forms included (100/mnd free)

**Perfect voor Mr. DJ!** 🚀

---

## 🌐 Offline & Form Fallbacks

- **Contactformulier fallback:** Het formulier in `frontend/public/index.html` is geconfigureerd met `data-netlify="true"` en een verborgen `form-name`. Wanneer JavaScript of de app-shell faalt, vangt Netlify het formulier automatisch op en stuurt inzendingen naar de Forms-inbox.
- **Spam-bescherming:** Een honeypot-veld (`netlify-honeypot="bot-field"`) blokkeert eenvoudige bots zonder extra scripts.
- **Offline pagina:** `frontend/public/offline.html` levert een statische fallback zodra de service worker detecteert dat er geen netwerk is. De pagina bevat directe links om te bellen/mailen en een knop terug naar de homepage zodra de verbinding herstelt.
- **Tip:** Voeg in `netlify.toml` een redirect toe van `/*` naar `/offline.html` met status `200` binnen de offline-caching rules van je service worker als je de fallback in de PWA-flow wilt opnemen.

