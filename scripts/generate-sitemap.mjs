import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')
const routesConfigPath = path.join(repoRoot, 'frontend', 'src', 'routes.json')
const sitemapOutputPath = path.join(repoRoot, 'frontend', 'public', 'sitemap.xml')

const escapeXml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const buildAbsoluteUrl = (siteUrl, routePath) => {
  if (!routePath) {
    throw new Error('Route entry is missing a "path" value')
  }

  if (/^https?:\/\//i.test(routePath)) {
    return routePath
  }

  const normalizedBase = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl
  if (routePath.startsWith('/')) {
    return `${normalizedBase}${routePath}`
  }

  return `${normalizedBase}/${routePath}`
}

const applyTemplate = (template, record, { slugField = 'slug' } = {}) =>
  template
    .replace(/\{([^}]+)\}/g, (match, key) => {
      if (!(key in record)) {
        throw new Error(`Missing field "${key}" in record for template ${template}`)
      }
      return record[key]
    })
    .replace(/:(\w+)/g, (match, key) => {
      const fieldName = key === 'slug' ? slugField : key
      if (!(fieldName in record)) {
        throw new Error(`Missing field "${fieldName}" in record for template ${template}`)
      }
      return record[fieldName]
    })

const normalizeEntry = (entry) => {
  if (!entry.path && !entry.pathTemplate) {
    throw new Error('Route entry must define either "path" or "pathTemplate"')
  }

  return {
    changefreq: entry.changefreq ?? null,
    priority: entry.priority ?? null,
    lastmod: entry.lastmod ?? null,
    slugField: entry.slugField ?? 'slug',
    path: entry.path ?? null,
    pathTemplate: entry.pathTemplate ?? null,
    source: entry.source ?? null,
    lastmodField: entry.lastmodField ?? null,
  }
}

const expandRoutes = async (configEntries, configDir) => {
  const routes = []

  for (const rawEntry of configEntries) {
    const entry = normalizeEntry(rawEntry)

    if (entry.path) {
      routes.push({
        path: entry.path,
        changefreq: entry.changefreq,
        priority: entry.priority,
        lastmod: entry.lastmod,
      })
      continue
    }

    if (!entry.source) {
      throw new Error(
        `Route entry using "pathTemplate" must provide a "source" file: ${JSON.stringify(rawEntry)}`,
      )
    }

    const sourcePath = path.resolve(configDir, entry.source)
    const sourceContents = await fs.readFile(sourcePath, 'utf8')

    let records
    try {
      records = JSON.parse(sourceContents)
    } catch (error) {
      throw new Error(`Unable to parse JSON from ${sourcePath}: ${error.message}`)
    }

    if (!Array.isArray(records)) {
      throw new Error(`Expected an array of records in ${sourcePath}`)
    }

    for (const record of records) {
      const resolvedPath = applyTemplate(entry.pathTemplate, record, {
        slugField: entry.slugField,
      })

      const resolvedLastmod = entry.lastmodField ? record[entry.lastmodField] ?? null : entry.lastmod

      routes.push({
        path: resolvedPath,
        changefreq: entry.changefreq,
        priority: entry.priority,
        lastmod: resolvedLastmod,
      })
    }
  }

  return routes
}

const formatSitemap = (siteUrl, routes) => {
  const unique = []
  const seen = new Set()

  for (const route of routes) {
    const loc = buildAbsoluteUrl(siteUrl, route.path)

    if (seen.has(loc)) {
      continue
    }
    seen.add(loc)

    unique.push({ ...route, loc })
  }

  const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']

  for (const route of unique) {
    lines.push('  <url>')
    lines.push(`    <loc>${escapeXml(route.loc)}</loc>`)

    if (route.lastmod) {
      lines.push(`    <lastmod>${escapeXml(route.lastmod)}</lastmod>`)
    }

    if (route.changefreq) {
      lines.push(`    <changefreq>${escapeXml(route.changefreq)}</changefreq>`)
    }

    if (route.priority != null) {
      const priorityValue =
        typeof route.priority === 'number' && Number.isInteger(route.priority)
          ? route.priority.toFixed(1)
          : String(route.priority)
      lines.push(`    <priority>${escapeXml(priorityValue)}</priority>`)
    }

    lines.push('  </url>')
  }

  lines.push('</urlset>')
  return `${lines.join('\n')}\n`
}

const main = async () => {
  const configDir = path.dirname(routesConfigPath)
  const configRaw = await fs.readFile(routesConfigPath, 'utf8')

  let config
  try {
    config = JSON.parse(configRaw)
  } catch (error) {
    throw new Error(`Unable to parse sitemap config at ${routesConfigPath}: ${error.message}`)
  }

  if (!config.siteUrl) {
    throw new Error('routes.json must specify a "siteUrl" value')
  }

  if (!Array.isArray(config.routes)) {
    throw new Error('routes.json must include a "routes" array')
  }

  const routes = await expandRoutes(config.routes, configDir)
  const sitemapXml = formatSitemap(config.siteUrl, routes)

  await fs.writeFile(sitemapOutputPath, sitemapXml, 'utf8')
  console.log(`✅ Generated sitemap with ${routes.length} entries at ${path.relative(repoRoot, sitemapOutputPath)}`)
}

main().catch((error) => {
  console.error('❌ Failed to generate sitemap:')
  console.error(error)
  process.exit(1)
})
