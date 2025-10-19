# Social Media Configuration Guide
**Mr. DJ Website - Social Media Links & Integration**

Last Updated: 2025-10-19

---

## Overview

This guide explains how to update social media links throughout the Mr. DJ website and provides best practices for social media integration.

---

## Current Social Media Implementation

### Footer Social Media Links

**Location:** `/opt/mr-dj/mr-dj-eds-components/src/components/Organisms/Footer.jsx`
**Lines:** 183-217

### Current Links (As of 2025-10-19)

The following social media links are currently configured:

| Platform | Current URL | Status |
|----------|-------------|--------|
| Facebook | `https://www.facebook.com/mrdj.nl` | ✅ Configured |
| Instagram | `https://www.instagram.com/mrdj.nl` | ✅ Configured |
| LinkedIn | `https://www.linkedin.com/company/mrdj-nl` | ✅ Configured |

---

## How to Update Social Media Links

### Step 1: Edit Footer Component

Open the Footer component file:
```bash
nano /opt/mr-dj/mr-dj-eds-components/src/components/Organisms/Footer.jsx
```

### Step 2: Locate Social Media Section

Find the "Social Media Icons" section around line 183:
```javascript
{/* Social Media Icons */}
<div className="flex gap-3">
```

### Step 3: Update Individual Links

#### Facebook Link
**Current (Line 184-194):**
```javascript
<a
  href="https://www.facebook.com/mrdj.nl"
  target="_blank"
  rel="noopener noreferrer"
  className="w-12 h-12 bg-white/10 hover:bg-[#00AEEF] text-white rounded-lg flex items-center justify-center transition-all hover:scale-110"
  aria-label="Facebook"
>
  {/* SVG icon */}
</a>
```

**To Update:**
Replace `https://www.facebook.com/mrdj.nl` with your actual Facebook page URL.

#### Instagram Link
**Current (Line 195-205):**
```javascript
<a
  href="https://www.instagram.com/mrdj.nl"
  target="_blank"
  rel="noopener noreferrer"
  className="w-12 h-12 bg-white/10 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 text-white rounded-lg flex items-center justify-center transition-all hover:scale-110"
  aria-label="Instagram"
>
  {/* SVG icon */}
</a>
```

**To Update:**
Replace `https://www.instagram.com/mrdj.nl` with your actual Instagram profile URL.

#### LinkedIn Link
**Current (Line 206-217):**
```javascript
<a
  href="https://www.linkedin.com/company/mrdj-nl"
  target="_blank"
  rel="noopener noreferrer"
  className="w-12 h-12 bg-white/10 hover:bg-[#0077B5] text-white rounded-lg flex items-center justify-center transition-all hover:scale-110"
  aria-label="LinkedIn"
>
  {/* SVG icon */}
</a>
```

**To Update:**
Replace `https://www.linkedin.com/company/mrdj-nl` with your actual LinkedIn company page URL.

---

## Adding Additional Social Media Platforms

### YouTube

To add a YouTube channel link, add this code after the LinkedIn link:

```javascript
<a
  href="https://www.youtube.com/@mrdj-nl"
  target="_blank"
  rel="noopener noreferrer"
  className="w-12 h-12 bg-white/10 hover:bg-[#FF0000] text-white rounded-lg flex items-center justify-center transition-all hover:scale-110"
  aria-label="YouTube"
>
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
</a>
```

### TikTok

To add a TikTok profile link:

```javascript
<a
  href="https://www.tiktok.com/@mrdj.nl"
  target="_blank"
  rel="noopener noreferrer"
  className="w-12 h-12 bg-white/10 hover:bg-black text-white rounded-lg flex items-center justify-center transition-all hover:scale-110"
  aria-label="TikTok"
>
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
</a>
```

### Twitter/X

To add a Twitter/X profile link:

```javascript
<a
  href="https://twitter.com/mrdj_nl"
  target="_blank"
  rel="noopener noreferrer"
  className="w-12 h-12 bg-white/10 hover:bg-black text-white rounded-lg flex items-center justify-center transition-all hover:scale-110"
  aria-label="Twitter"
>
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
</a>
```

---

## Updating Schema.org Social Media Links

Social media links are also included in the Organization schema for SEO purposes.

**Location:** `/opt/mr-dj/mr-dj-eds-components/src/utils/schemaOrg.js`
**Lines:** 28-32

```javascript
"sameAs": [
  "https://www.facebook.com/mrdj.nl",
  "https://www.instagram.com/mrdj.nl",
  "https://www.linkedin.com/company/mrdj-nl"
]
```

### To Update:
1. Open the schemaOrg.js file
2. Locate the `generateOrganizationSchema` function
3. Update the URLs in the `sameAs` array
4. Add additional platforms if needed

**Example with YouTube added:**
```javascript
"sameAs": [
  "https://www.facebook.com/mrdj.nl",
  "https://www.instagram.com/mrdj.nl",
  "https://www.linkedin.com/company/mrdj-nl",
  "https://www.youtube.com/@mrdj-nl"
]
```

---

## Open Graph & Twitter Card Configuration

Social media meta tags are configured in the main HTML file for proper link sharing.

**Location:** `/opt/mr-dj/mr-dj-eds-components/index.html`
**Lines:** 61-79

### Current Configuration

#### Open Graph (Facebook)
```html
<meta property="og:type" content="website" />
<meta property="og:url" content="https://mr-dj.sevensa.nl/" />
<meta property="og:site_name" content="Mr. DJ" />
<meta property="og:title" content="Mr. DJ - Dé Feestspecialist van het Zuiden | DJ + Saxofoon" />
<meta property="og:description" content="15+ jaar ervaring, 2500+ geslaagde feesten. Boek de beste DJ + Saxofoon voor bruiloften, bedrijfsfeesten en meer in Noord-Brabant en Limburg." />
<meta property="og:image" content="https://mr-dj.sevensa.nl/images/logo.png" />
<meta property="og:image:width" content="1000" />
<meta property="og:image:height" content="1000" />
<meta property="og:image:alt" content="Mr. DJ Logo - Dé Feestspecialist van het Zuiden" />
<meta property="og:locale" content="nl_NL" />
```

#### Twitter Card
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="https://mr-dj.sevensa.nl/" />
<meta name="twitter:title" content="Mr. DJ - Dé Feestspecialist van het Zuiden | DJ + Saxofoon" />
<meta name="twitter:description" content="15+ jaar ervaring, 2500+ geslaagde feesten. Boek de beste DJ + Saxofoon voor bruiloften, bedrijfsfeesten en meer." />
<meta name="twitter:image" content="https://mr-dj.sevensa.nl/images/logo.png" />
<meta name="twitter:image:alt" content="Mr. DJ Logo - Dé Feestspecialist van het Zuiden" />
```

### Recommended Image Sizes

For optimal social media sharing:

| Platform | Recommended Size | Aspect Ratio |
|----------|-----------------|--------------|
| Facebook | 1200 x 630 px | 1.91:1 |
| Twitter | 1200 x 675 px | 16:9 |
| LinkedIn | 1200 x 627 px | 1.91:1 |
| Instagram | 1080 x 1080 px | 1:1 |

**Current logo:** 1000 x 1000 px (1:1) - Works for all platforms but consider creating dedicated social sharing images.

---

## Testing Social Media Integration

### Facebook Sharing Debugger
- URL: https://developers.facebook.com/tools/debug/
- Tests Open Graph tags
- Shows preview of how links will appear when shared

### Twitter Card Validator
- URL: https://cards-dev.twitter.com/validator
- Tests Twitter Card tags
- Shows preview of tweet cards

### LinkedIn Post Inspector
- URL: https://www.linkedin.com/post-inspector/
- Tests LinkedIn sharing
- Shows preview of shared posts

---

## Social Media Pixels & Tracking

### Facebook Pixel

To add Facebook Pixel for tracking:

1. Get your Facebook Pixel ID from Facebook Business Manager
2. Add to `/opt/mr-dj/mr-dj-eds-components/index.html` in the `<head>` section:

```html
<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
<noscript>
<img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"/>
</noscript>
<!-- End Facebook Pixel Code -->
```

### Instagram (uses Facebook Pixel)
Instagram conversions are tracked through Facebook Pixel since Instagram is owned by Facebook.

---

## Quick Reference: Social Media URLs

### Format Examples

| Platform | URL Format | Example |
|----------|-----------|---------|
| Facebook Page | `https://www.facebook.com/[username]` | `https://www.facebook.com/mrdj.nl` |
| Instagram | `https://www.instagram.com/[username]` | `https://www.instagram.com/mrdj.nl` |
| LinkedIn Company | `https://www.linkedin.com/company/[company-name]` | `https://www.linkedin.com/company/mrdj-nl` |
| YouTube | `https://www.youtube.com/@[channel-name]` | `https://www.youtube.com/@mrdj-nl` |
| TikTok | `https://www.tiktok.com/@[username]` | `https://www.tiktok.com/@mrdj.nl` |
| Twitter/X | `https://twitter.com/[username]` | `https://twitter.com/mrdj_nl` |

---

## Deployment Checklist

After updating social media links:

- [ ] Update links in Footer.jsx
- [ ] Update sameAs array in schemaOrg.js
- [ ] Test all links to ensure they work
- [ ] Check if links open in new tab (target="_blank")
- [ ] Verify links have proper rel attributes (rel="noopener noreferrer")
- [ ] Test social sharing with Facebook Debugger
- [ ] Test social sharing with Twitter Card Validator
- [ ] Check Google Search Console for Organization schema updates
- [ ] Update this documentation with new links

---

## Current Placeholder Links

### Status: ✅ ALL CONFIGURED

All social media links in the Footer are properly configured:

1. **Facebook:** `https://www.facebook.com/mrdj.nl` - ✅ Active
2. **Instagram:** `https://www.instagram.com/mrdj.nl` - ✅ Active
3. **LinkedIn:** `https://www.linkedin.com/company/mrdj-nl` - ✅ Active

**Note:** Verify these URLs point to your actual social media accounts. If the accounts don't exist yet, create them or update the links accordingly.

---

## Best Practices

### Link Attributes
Always include these attributes on social media links:
- `target="_blank"` - Opens in new tab
- `rel="noopener noreferrer"` - Security best practice
- `aria-label="[Platform Name]"` - Accessibility

### Icon Consistency
- Use consistent icon sizes (currently 24px / w-6 h-6)
- Maintain hover effects for better UX
- Use brand colors on hover (Facebook blue, Instagram gradient, etc.)

### Performance
- SVG icons are embedded inline (no external requests)
- Icons are optimized for file size
- Hover animations use CSS transforms (GPU accelerated)

---

## Maintenance Schedule

### Weekly
- Monitor social media engagement from website traffic
- Check for broken links (use link checker tool)

### Monthly
- Review social media analytics
- Update social sharing images if needed
- Test sharing on all platforms

### Quarterly
- Audit social media presence
- Update URLs if accounts change
- Review and update Open Graph images

---

## Support & Resources

### Tools
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

### Documentation
- Open Graph Protocol: https://ogp.me/
- Twitter Cards: https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards
- Schema.org SameAs: https://schema.org/sameAs

---

**Document Version:** 1.0
**Last Updated:** 2025-10-19
**Next Review:** 2025-11-19
