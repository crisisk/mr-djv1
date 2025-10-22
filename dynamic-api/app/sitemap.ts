import { MetadataRoute } from 'next'

/**
 * Next.js Sitemap Generator
 * Generates sitemap.xml for all 114 pages
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mr-dj.sevensa.nl'
  // Use stable date to prevent sitemap regeneration on every build
  const lastModified = '2025-10-22'

  const routes: Array<{
    url: string
    priority: number
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  }> = [
    // High priority pages
    { url: '', priority: 1.0, changeFrequency: 'weekly' },
    { url: '/bruiloft', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/feesten', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/zakelijk', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/contact', priority: 0.9, changeFrequency: 'monthly' },
    { url: '/pakketten', priority: 0.9, changeFrequency: 'monthly' },
    { url: '/over-ons', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/galerij', priority: 0.8, changeFrequency: 'weekly' },
    { url: '/faq', priority: 0.7, changeFrequency: 'monthly' },

    // DJ city pages
    { url: '/dj-eindhoven', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/dj-tilburg', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/dj-breda', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/dj-den-bosch', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/dj-maastricht', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/dj-rotterdam', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/dj-amsterdam', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/dj-utrecht', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/dj-den-haag', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/dj-arnhem', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/dj-nijmegen', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/dj-helmond', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/dj-venlo', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/dj-bergen-op-zoom', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/dj-roosendaal', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/dj-oss', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/dj-uden', priority: 0.6, changeFrequency: 'monthly' },
    { url: '/dj-veghel', priority: 0.6, changeFrequency: 'monthly' },
    { url: '/dj-veldhoven', priority: 0.6, changeFrequency: 'monthly' },
    { url: '/dj-waalwijk', priority: 0.6, changeFrequency: 'monthly' },

    // City landing pages (main cities)
    { url: '/eindhoven', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/tilburg', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/breda', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/den-bosch', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/maastricht', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/rotterdam', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/amsterdam', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/utrecht', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/den-haag', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/arnhem', priority: 0.6, changeFrequency: 'monthly' },
    { url: '/nijmegen', priority: 0.6, changeFrequency: 'monthly' },
    { url: '/helmond', priority: 0.6, changeFrequency: 'monthly' },
    { url: '/venlo', priority: 0.6, changeFrequency: 'monthly' },
    { url: '/bergen-op-zoom', priority: 0.6, changeFrequency: 'monthly' },
    { url: '/roosendaal', priority: 0.6, changeFrequency: 'monthly' },
    { url: '/oss', priority: 0.6, changeFrequency: 'monthly' },
    { url: '/uden', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/veghel', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/veldhoven', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/waalwijk', priority: 0.5, changeFrequency: 'monthly' },

    // New city pages (40 additional smaller cities)
    { url: '/beek', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/best', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/boxtel', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/brunssum', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/dongen', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/drunen', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/echt-susteren', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/eijsden', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/etten-leur', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/geldrop', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/gennep', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/goirle', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/haelen', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/heerlen', priority: 0.6, changeFrequency: 'monthly' },
    { url: '/heeze', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/hoensbroek', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/horst', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/kaatsheuvel', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/kerkrade', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/landgraaf', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/made', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/meerssen', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/nederweert', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/oosterhout', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/panningen', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/reuver', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/rijen', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/roermond', priority: 0.6, changeFrequency: 'monthly' },
    { url: '/rosmalen', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/s-hertogenbosch', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/schijndel', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/simpelveld', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/sittard-geleen', priority: 0.6, changeFrequency: 'monthly' },
    { url: '/stein', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/tegelen', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/valkenburg', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/valkenswaard', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/veenendaal', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/venray', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/weert', priority: 0.6, changeFrequency: 'monthly' },

    // Saxophonist pages
    { url: '/saxofonist-eindhoven', priority: 0.6, changeFrequency: 'monthly' },
    { url: '/saxofonist-tilburg', priority: 0.6, changeFrequency: 'monthly' },
    { url: '/saxofonist-breda', priority: 0.6, changeFrequency: 'monthly' },
    { url: '/saxofonist-den-bosch', priority: 0.6, changeFrequency: 'monthly' },
    { url: '/saxofonist-maastricht', priority: 0.6, changeFrequency: 'monthly' },
    { url: '/saxofonist-rotterdam', priority: 0.6, changeFrequency: 'monthly' },
    { url: '/saxofonist-amsterdam', priority: 0.6, changeFrequency: 'monthly' },
    { url: '/saxofonist-utrecht', priority: 0.6, changeFrequency: 'monthly' },
    { url: '/saxofonist-den-haag', priority: 0.6, changeFrequency: 'monthly' },
    { url: '/saxofonist-arnhem', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/saxofonist-nijmegen', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/saxofonist-helmond', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/saxofonist-venlo', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/saxofonist-bergen-op-zoom', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/saxofonist-roosendaal', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/saxofonist-oss', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/saxofonist-uden', priority: 0.4, changeFrequency: 'monthly' },
    { url: '/saxofonist-veghel', priority: 0.4, changeFrequency: 'monthly' },
    { url: '/saxofonist-veldhoven', priority: 0.4, changeFrequency: 'monthly' },
    { url: '/saxofonist-waalwijk', priority: 0.4, changeFrequency: 'monthly' },

    // Legal pages
    { url: '/privacyverklaring', priority: 0.3, changeFrequency: 'yearly' },
    { url: '/algemene-voorwaarden', priority: 0.3, changeFrequency: 'yearly' },
    { url: '/cookiebeleid', priority: 0.3, changeFrequency: 'yearly' },
    { url: '/disclaimer', priority: 0.3, changeFrequency: 'yearly' },

    // Admin (low priority)
    { url: '/admin/login', priority: 0.1, changeFrequency: 'never' },
  ]

  return routes.map(({ url, priority, changeFrequency }) => ({
    url: `${baseUrl}${url}`,
    lastModified: lastModified,
    changeFrequency,
    priority,
  }))
}
