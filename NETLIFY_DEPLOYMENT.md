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
- **Build command:** `echo 'Building Mr. DJ website...' && ls -la frontend/public`
- **Publish directory:** `frontend/public`
- **Branch:** `main`

Klik "Deploy site"

### Stap 3: Wait for Deployment (1-2 minuten)
Netlify bouwt en deploy automatisch!

Je krijgt een URL zoals: `https://mr-dj-abc123.netlify.app`

### Stap 3b: Snellere vervolgbuilds met caching
- De `netlify.toml` cachet nu automatisch de `node_modules` directory.
- Eerste build: blijft ~1-2 minuten (download + caching van dependencies).
- Vervolgbuilds: besparen gemiddeld 20-30 seconden omdat npm install wordt overgeslagen.
- Resultaat: snellere previews en minder build-minuten verbruik.

### Stap 4: Enable Netlify Identity
1. Ga naar Site settings → Identity
2. Klik "Enable Identity"
3. Scroll naar "Registration preferences"
4. Selecteer "Invite only" (voor security)
5. Klik "Save"

### Stap 5: Enable Git Gateway
1. Blijf in Identity settings
2. Scroll naar "Services" → "Git Gateway"
3. Klik "Enable Git Gateway"
4. Klik "Generate access token" (Netlify doet dit automatisch)
5. Klaar!

### Stap 6: Invite Bart
1. Ga naar Identity tab
2. Klik "Invite users"
3. Vul Bart's email in
4. Klik "Send"
5. Bart krijgt email met invite link

### Stap 7: Bart's First Login
1. Bart klikt op link in email
2. Bart maakt wachtwoord aan
3. Bart gaat naar: `https://jouw-site.netlify.app/admin`
4. Bart logt in met email + wachtwoord
5. Bart kan nu content editten! 🎉

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

### CMS Login Werkt Niet?
1. Check of Identity is enabled
2. Check of Git Gateway is enabled
3. Check of Bart is invited
4. Check spam folder voor invite email

### Content Updates Niet Zichtbaar?
1. Check of Bart op "Publish" heeft geklikt (niet alleen "Save")
2. Wait 1-2 minuten voor rebuild
3. Hard refresh browser (Ctrl+Shift+R)
4. Check Netlify deploy log

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
- ✅ Identity: 1,000 users

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
✅ **CMS Included:** Netlify Identity + Git Gateway  
✅ **Rollback:** Easy rollback to previous version  
✅ **Preview:** Deploy previews for every PR  
✅ **Forms:** Netlify Forms included (100/mnd free)  

**Perfect voor Mr. DJ!** 🚀

