# SEO Submission Checklist
## Mr. DJ Website - Search Engine Indexatie

**Website:** https://mr-dj.sevensa.nl
**Status:** Ready for production deployment
**Last updated:** 2025-10-18

---

## Quick Links

| Platform | URL | Status |
|----------|-----|--------|
| **Google Search Console** | https://search.google.com/search-console/ | [ ] Setup |
| **Bing Webmaster Tools** | https://www.bing.com/webmasters/ | [ ] Setup |
| **Live Website** | https://mr-dj.sevensa.nl | [ ] Online |
| **Sitemap** | https://mr-dj.sevensa.nl/sitemap.xml | [ ] Accessible |
| **Robots.txt** | https://mr-dj.sevensa.nl/robots.txt | [ ] Configured |

---

## Pre-Launch Checklist

### Technical Requirements

- [ ] **Website is live** op https://mr-dj.sevensa.nl
- [ ] **SSL certificate** actief (HTTPS werkt)
- [ ] **Sitemap.xml** gegenereerd en toegankelijk
- [ ] **Robots.txt** geconfigureerd en toegankelijk
- [ ] **Meta tags** op alle paginas (title, description)
- [ ] **Canonical tags** correct ingesteld
- [ ] **Mobile responsive** design getest
- [ ] **Core Web Vitals** geoptimaliseerd (laadsnelheid)
- [ ] **Structured data** toegevoegd (Schema.org)
- [ ] **404 page** bestaat en werkt
- [ ] **500 error page** geconfigureerd

### Content Requirements

- [ ] **Homepage** volledig met content
- [ ] **Diensten pagina** met DJ services
- [ ] **Prijzen pagina** met packages
- [ ] **Over Ons** met bedrijfsinfo
- [ ] **Contact pagina** met werkend formulier
- [ ] **Alt text** op alle images
- [ ] **H1 tags** op elke pagina (uniek)
- [ ] **Internal linking** structuur
- [ ] **Geen placeholder content**
- [ ] **Alle links werken** (geen 404s)

### Pre-Launch Tests

```bash
# Test website accessibility
curl -I https://mr-dj.sevensa.nl
# Expected: HTTP/2 200

# Test sitemap
curl -I https://mr-dj.sevensa.nl/sitemap.xml
# Expected: HTTP/2 200, Content-Type: application/xml

# Test robots.txt
curl https://mr-dj.sevensa.nl/robots.txt
# Expected: File with sitemap reference

# Check for meta tags
curl -s https://mr-dj.sevensa.nl | grep -i "meta name"

# Test mobile-friendly
# Use: https://search.google.com/test/mobile-friendly

# Test page speed
# Use: https://pagespeed.web.dev/
```

---

## Google Search Console Setup

### Phase 1: Initial Setup (30 minutes)

- [ ] **Login** to Google Search Console
- [ ] **Add property:** https://mr-dj.sevensa.nl
- [ ] **Choose verification method:** HTML tag (recommended)
- [ ] **Add meta tag** to `/srv/apps/mr-djv1/public/index.html`:
  ```html
  <meta name="google-site-verification" content="YOUR_CODE" />
  ```
- [ ] **Deploy** updated index.html
- [ ] **Verify ownership** in GSC
- [ ] **Verification successful** ✓

### Phase 2: Configuration (15 minutes)

- [ ] **Submit sitemap:** `sitemap.xml`
- [ ] **Set international targeting:** Netherlands
- [ ] **Set language:** Dutch (nl)
- [ ] **Check URL inspection** for homepage
- [ ] **Add team members** (min. 2 owners)

### Phase 3: URL Submission (10 minutes)

Submit belangrijkste paginas via URL Inspection:

- [ ] https://mr-dj.sevensa.nl/ (homepage)
- [ ] https://mr-dj.sevensa.nl/diensten
- [ ] https://mr-dj.sevensa.nl/prijzen
- [ ] https://mr-dj.sevensa.nl/over-ons
- [ ] https://mr-dj.sevensa.nl/contact

**How:** URL Inspection tool > Request Indexing

### Expected Timeline

| Time | Milestone |
|------|-----------|
| Immediate | Property verified |
| 24-48 hours | First crawl, sitemap processed |
| 3-7 days | First pages in index |
| 2-4 weeks | Full site indexed |
| 1-3 months | Stable ranking data |

---

## Bing Webmaster Tools Setup

### Phase 1: Initial Setup (20 minutes)

**Option A: Import from Google (Fastest)**
- [ ] **Login** to Bing Webmaster Tools
- [ ] **Click** "Import from Google Search Console"
- [ ] **Authorize** Google account access
- [ ] **Import** complete ✓

**Option B: Manual Setup**
- [ ] **Login** to Bing Webmaster Tools
- [ ] **Add site:** https://mr-dj.sevensa.nl
- [ ] **Choose verification:** XML file (recommended)
- [ ] **Download** BingSiteAuth.xml
- [ ] **Upload to** `/srv/apps/mr-djv1/public/`
- [ ] **Deploy** changes
- [ ] **Verify** ownership
- [ ] **Verification successful** ✓

### Phase 2: Configuration (15 minutes)

- [ ] **Submit sitemap:** `sitemap.xml`
- [ ] **Set country:** Netherlands
- [ ] **Set language:** Dutch (nl-NL)
- [ ] **Configure crawl control:** Auto
- [ ] **Run SEO analyzer** (first scan)
- [ ] **Add team members**

### Phase 3: URL Submission (10 minutes)

Submit via URL Submission tool:
```
https://mr-dj.sevensa.nl/
https://mr-dj.sevensa.nl/diensten
https://mr-dj.sevensa.nl/prijzen
https://mr-dj.sevensa.nl/over-ons
https://mr-dj.sevensa.nl/contact
```

- [ ] **Submit top 5 URLs**
- [ ] **Limit:** 10 URLs per dag (standaard account)

### Expected Timeline

| Time | Milestone |
|------|-----------|
| Immediate | Site verified |
| 24-48 hours | First crawl |
| 3-7 days | First pages indexed |
| 1-2 weeks | Most pages indexed |
| 2-4 weeks | First traffic data |

---

## IndexNow Setup (Optional - Recommended)

IndexNow zorgt voor snellere indexatie bij updates.

### Setup (30 minutes)

- [ ] **Generate API key:**
  ```bash
  openssl rand -hex 32
  # Save this key: [your-key-here]
  ```

- [ ] **Create key file:**
  ```bash
  echo "YOUR_KEY" > /srv/apps/mr-djv1/public/YOUR_KEY.txt
  ```

- [ ] **Deploy** key file
- [ ] **Test accessibility:**
  ```bash
  curl https://mr-dj.sevensa.nl/YOUR_KEY.txt
  ```

- [ ] **Configure in Bing** Webmaster Tools > IndexNow
- [ ] **Test submission:**
  ```bash
  curl -X POST "https://api.indexnow.org/indexnow" \
    -H "Content-Type: application/json" \
    -d '{
      "host": "mr-dj.sevensa.nl",
      "key": "YOUR_KEY",
      "keyLocation": "https://mr-dj.sevensa.nl/YOUR_KEY.txt",
      "urlList": ["https://mr-dj.sevensa.nl/"]
    }'
  ```

- [ ] **Verify:** HTTP 200 response
- [ ] **Integration complete** ✓

---

## Post-Launch Monitoring

### Week 1: Initial Check

**Daily (5 minutes):**
- [ ] Check Google Search Console coverage
- [ ] Check Bing indexation status
- [ ] Monitor for crawl errors

**Focus:**
- Verify pages are being crawled
- Fix any immediate errors
- Ensure sitemaps are processed

### Week 2-4: Active Monitoring

**Every 2-3 days (10 minutes):**
- [ ] Google Search Console performance
- [ ] Bing Search Performance report
- [ ] Check indexed pages count
- [ ] Review new errors/warnings

**Actions:**
- Fix crawl errors immediately
- Re-submit URLs if needed
- Adjust sitemap if issues found

### Month 2+: Regular Maintenance

**Weekly (15 minutes):**
- [ ] Review performance trends (clicks, impressions)
- [ ] Check ranking positions for target keywords
- [ ] Monitor backlinks (new/lost)
- [ ] Review SEO reports for new issues

**Monthly (30 minutes):**
- [ ] Deep dive keyword analysis
- [ ] Content performance review
- [ ] Technical SEO audit
- [ ] Competitor analysis

---

## Key Metrics to Track

### Google Search Console

| Metric | Target | Where to Find |
|--------|--------|---------------|
| **Indexed Pages** | 95%+ of sitemap URLs | Coverage report |
| **Average Position** | <20 (first 2 pages) | Performance report |
| **CTR** | >3% | Performance report |
| **Total Clicks** | Growing trend | Performance report |
| **Coverage Errors** | 0 | Coverage report |
| **Mobile Usability** | No errors | Mobile Usability report |
| **Core Web Vitals** | All green | Core Web Vitals report |

### Bing Webmaster Tools

| Metric | Target | Where to Find |
|--------|--------|---------------|
| **Indexed Pages** | 90%+ of sitemap URLs | Site Explorer |
| **SEO Score** | >75/100 | SEO Reports |
| **Crawl Errors** | <5 | Crawl Information |
| **Total Clicks** | Growing | Search Performance |
| **Backlinks** | Growing | Inbound Links |

---

## Important URLs Checklist

### Core Pages (Must Index)

- [ ] https://mr-dj.sevensa.nl/ (Homepage)
- [ ] https://mr-dj.sevensa.nl/diensten (Services)
- [ ] https://mr-dj.sevensa.nl/prijzen (Pricing)
- [ ] https://mr-dj.sevensa.nl/over-ons (About)
- [ ] https://mr-dj.sevensa.nl/contact (Contact)

### Supporting Pages

- [ ] https://mr-dj.sevensa.nl/portfolio (if exists)
- [ ] https://mr-dj.sevensa.nl/reviews (if exists)
- [ ] https://mr-dj.sevensa.nl/faq (if exists)
- [ ] https://mr-dj.sevensa.nl/blog (if exists)

### Technical Pages

- [ ] https://mr-dj.sevensa.nl/privacy (Privacy Policy)
- [ ] https://mr-dj.sevensa.nl/terms (Terms of Service)

---

## Target Keywords (Nederland)

### Primary Keywords
- dj huren
- dj boeken
- feest dj
- bruiloft dj
- bedrijfsfeest dj

### Secondary Keywords
- dj prijs
- dj kosten
- party dj
- dj service
- professionele dj

### Long-tail Keywords
- dj huren voor bruiloft
- goedkope dj huren
- dj boeken bedrijfsfeest
- ervaren dj huren
- dj met apparatuur huren

**Track these** in both Google Search Console and Bing Webmaster Tools Performance reports.

---

## Troubleshooting Quick Reference

### Issue: Pages Not Indexed

**Check:**
1. Is sitemap submitted and processed? ✓
2. Does robots.txt allow crawling? ✓
3. Are there noindex tags on pages? ✗
4. Are there server errors (5xx)? ✗
5. Is page accessible (no login required)? ✓

**Fix:**
```bash
# Check robots.txt
curl https://mr-dj.sevensa.nl/robots.txt

# Check for noindex
curl -s https://mr-dj.sevensa.nl/PAGE | grep -i "noindex"

# Test page accessibility
curl -I https://mr-dj.sevensa.nl/PAGE
```

### Issue: Sitemap Errors

**Common errors:**
- 404: Sitemap not found → Check file location
- Timeout: Sitemap too large → Split into multiple
- Format error: Invalid XML → Validate with xmllint

**Fix:**
```bash
# Validate XML
xmllint --noout /srv/apps/mr-djv1/public/sitemap.xml

# Check size
ls -lh /srv/apps/mr-djv1/public/sitemap.xml
# Should be < 50MB, < 50,000 URLs
```

### Issue: Verification Failed

**Try:**
1. Clear browser cache
2. Wait 10-15 minutes after deployment
3. Verify file/tag is live with curl
4. Try different verification method

```bash
# Test meta tag
curl -s https://mr-dj.sevensa.nl | grep "verification"

# Test verification file
curl https://mr-dj.sevensa.nl/googleXXX.html
curl https://mr-dj.sevensa.nl/BingSiteAuth.xml
```

---

## Additional Tools

### Validation Tools

- [ ] **Mobile-Friendly Test:** https://search.google.com/test/mobile-friendly
- [ ] **Rich Results Test:** https://search.google.com/test/rich-results
- [ ] **PageSpeed Insights:** https://pagespeed.web.dev/
- [ ] **Schema Markup Validator:** https://validator.schema.org/

### Analytics Integration

- [ ] **Google Analytics 4** setup and linked to GSC
- [ ] **Microsoft Clarity** (optional, free heatmaps)
- [ ] **Google Tag Manager** for event tracking

### SEO Extensions (Browser)

- **Recommended Chrome extensions:**
  - SEO Meta in 1 Click
  - Lighthouse
  - Redirect Path
  - SEOquake

---

## Team Responsibilities

### Technical Lead
- [ ] Verification implementations (meta tags, files)
- [ ] Sitemap generation and maintenance
- [ ] Fix technical SEO issues
- [ ] API integrations (IndexNow)

### Marketing Team
- [ ] Monitor performance metrics
- [ ] Keyword research and tracking
- [ ] Content optimization
- [ ] Competitor analysis

### Content Team
- [ ] Create SEO-optimized content
- [ ] Update meta descriptions
- [ ] Image alt text optimization
- [ ] Blog/news content strategy

---

## Monthly SEO Report Template

### Performance Summary

**Period:** [Month Year]

#### Google Search Console
- Total Clicks: [number] (↑/↓ [%] vs previous month)
- Total Impressions: [number] (↑/↓ [%])
- Average CTR: [%] (↑/↓ [%])
- Average Position: [number] (↑/↓)
- Indexed Pages: [number] / [total pages]

#### Bing Webmaster Tools
- Total Clicks: [number] (↑/↓ [%])
- Total Impressions: [number] (↑/↓ [%])
- Average Position: [number] (↑/↓)
- Indexed Pages: [number] / [total pages]

### Top Performing Pages
1. [URL] - [clicks] clicks
2. [URL] - [clicks] clicks
3. [URL] - [clicks] clicks

### Top Keywords
1. [keyword] - Position [#], [clicks] clicks
2. [keyword] - Position [#], [clicks] clicks
3. [keyword] - Position [#], [clicks] clicks

### Issues Identified
- [ ] [Issue description]
- [ ] [Issue description]

### Actions Taken
- [ ] [Action description]
- [ ] [Action description]

### Next Month Goals
- [ ] [Goal]
- [ ] [Goal]

---

## Emergency Contacts

### Google Search Console Issues
- **Help Center:** https://support.google.com/webmasters/
- **Community Forum:** https://support.google.com/webmasters/community

### Bing Webmaster Tools Issues
- **Help Center:** https://www.bing.com/webmasters/help/
- **Support Forum:** https://www.bing.com/webmasters/community

### Mr. DJ Team
- **Technical Lead:** [Naam] - [Email]
- **SEO Manager:** [Naam] - [Email]
- **Project Manager:** [Naam] - [Email]

---

## Resources & Documentation

### Internal Documentation
- **Google Search Console Guide:** `/srv/apps/mr-djv1/docs/GOOGLE-SEARCH-CONSOLE-SETUP.md`
- **Bing Webmaster Guide:** `/srv/apps/mr-djv1/docs/BING-WEBMASTER-SETUP.md`
- **This Checklist:** `/srv/apps/mr-djv1/docs/SEO-SUBMISSION-CHECKLIST.md`

### External Resources
- **Google SEO Starter Guide:** https://developers.google.com/search/docs/beginner/seo-starter-guide
- **Bing Webmaster Guidelines:** https://www.bing.com/webmasters/help/webmasters-guidelines-30fba23a
- **Schema.org Documentation:** https://schema.org/
- **Web.dev Best Practices:** https://web.dev/

---

## Success Criteria

### 30 Days Post-Launch

- [ ] 50%+ of pages indexed in Google
- [ ] 30%+ of pages indexed in Bing
- [ ] No critical errors in either console
- [ ] At least 1 organic visitor from search
- [ ] Core Web Vitals in "Good" range

### 90 Days Post-Launch

- [ ] 90%+ of pages indexed in both
- [ ] Top 20 position for brand name searches
- [ ] 50+ organic clicks per week
- [ ] 5+ keywords ranking on page 1-3
- [ ] Backlinks from at least 3 sources

### 6 Months Post-Launch

- [ ] 100 organic clicks per week
- [ ] 10+ keywords ranking on page 1
- [ ] Domain authority increasing
- [ ] Featured in Google Maps (if applicable)
- [ ] Positive trend in all key metrics

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-10-18 | Initial checklist created | [Your Name] |

---

## Sign-Off

**Initial Setup Completed:**

- [ ] Google Search Console configured - Date: _____ - By: _____
- [ ] Bing Webmaster Tools configured - Date: _____ - By: _____
- [ ] IndexNow implemented - Date: _____ - By: _____
- [ ] Team trained on monitoring - Date: _____ - By: _____

**Approved by:**
- Technical Lead: _____________________ Date: _____
- Marketing Manager: __________________ Date: _____
- Project Owner: ______________________ Date: _____

---

**Ready to launch? Let's get Mr. DJ online en vindbaar! 🎵**
