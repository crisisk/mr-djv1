# Deployment Notes - Mr. DJ Website

## URL Update (PENDING)

**Status:** ⏳ Uitgesteld tot livegang
**Reden:** Wacht op klant goedkeuring
**Action Required:**
- Update alle URLs van `staging.sevensa.nl` naar `mr-dj.sevensa.nl`
- Files te updaten: sitemap.xml + alle HTML files in /frontend/public/
- Commando: `find . -type f \( -name "*.html" -o -name "*.xml" \) -exec sed -i 's/staging\.sevensa\.nl/mr-dj.sevensa.nl/g' {} +`

**Huidige Situatie:**
- ✅ 132 URLs in sitemap
- ✅ 15 local-seo pages gebouwd
- ❌ URLs wijzen naar staging.sevensa.nl (correctie bij livegang)

**Datum Logged:** 21 Oktober 2025

---

## Next Deployment Steps

1. Volledige website rebuilden
2. Container deployen
3. Testen op staging URLs
4. **NA klant goedkeuring:** URLs updaten naar mr-dj.sevensa.nl
