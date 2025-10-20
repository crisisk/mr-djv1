const fs = require('fs/promises');
const path = require('path');
const { spawn } = require('child_process');
const { runQuery } = require('../lib/db');

/**
 * @typedef {Object} CityAutomationContext
 * @property {string} repoRoot
 * @property {Object} fs
 * @property {?Function} fetchImpl
 * @property {?string} seoApiUrl
 * @property {?string} seoApiKey
 * @property {?string} seoKeywordSetId
 * @property {string} seoRegion
 * @property {Array<string>} themeKeywords
 * @property {string} llmProvider
 * @property {string} llmModel
 * @property {?string} llmApiKey
 * @property {?string} approvalEmail
 * @property {boolean} dryRun
 * @property {Array<string>} bannedClaims
 * @property {string} reviewFilePath
 * @property {string} reportFilePath
 * @property {string} citiesFilePath
 * @property {string} generatorScriptPath
 * @property {number} limit
 */

/**
 * @typedef {Object} KeywordEntry
 * @property {string} keyword
 * @property {?string} [city]
 * @property {?number} [searchVolume]
 * @property {Array<string>} [serpFeatures]
 * @property {?string} [region]
 * @property {?string} [country]
 * @property {?string} [geo]
 */

/**
 * @typedef {Object} FilteredKeywordEntry
 * @property {string} keyword
 * @property {?string} [city]
 * @property {?number} [searchVolume]
 * @property {Array<string>} [serpFeatures]
 * @property {?string} [region]
 * @property {?string} [country]
 * @property {?string} [geo]
 * @property {string} slug
 */

/**
 * @typedef {Object} GeneratedCityContent
 * @property {string} slug
 * @property {string} city
 * @property {string} intro
 * @property {Array<Object>} cases
 * @property {Array<string>} venues
 * @property {Array<Object>} faqs
 */

/**
 * @typedef {Object} TemplateContentParams
 * @property {string} keyword
 * @property {string} city
 * @property {?number} [searchVolume]
 * @property {Array<string>} [serpFeatures]
 */

/**
 * @typedef {Object} WorkflowResultItem
 * @property {string} slug
 * @property {string} keyword
 * @property {?string} city
 * @property {?number} [searchVolume]
 * @property {Array<string>} [serpFeatures]
 * @property {GeneratedCityContent} content
 * @property {Array<string>} [issues]
 */

/**
 * @typedef {Object} GeneratorSummary
 * @property {boolean} success
 * @property {boolean} skipped
 * @property {string} script
 * @property {?string} error
 */

/**
 * @typedef {Object} WorkflowSummary
 * @property {number} processed
 * @property {Array<WorkflowResultItem>} approved
 * @property {Array<WorkflowResultItem>} flagged
 * @property {number} skipped
 * @property {?GeneratorSummary} [generator]
 */

const DEFAULT_THEME_KEYWORDS = [
  'dj',
  'sax',
  'band',
  'bruiloft',
  'trouw',
  'feest',
  'event',
  'evenement',
  'entertainment',
  'ceremonie',
  'receptie',
  'borrel'
];

const DEFAULT_BANNED_CLAIMS = [
  '100% gratis',
  'volledig gratis',
  'onbeperkt gratis',
  'garandeerde winst',
  'risicoloos',
  'no cure no pay'
];

const REVIEW_FILE_HEADER =
  '# City content automation review queue\n\nDit document bevat content die handmatige controle vereist voordat de update kan worden gepusht naar productie.\n\n';

/**
 * Creates a normalized execution context that can be overridden during tests.
 *
 * @param {Object} [overrides]
 * @returns {CityAutomationContext}
 */
function resolveContext(overrides = {}) {
  const repoRoot = overrides.repoRoot || path.join(__dirname, '../../..');
  const defaultContext = {
    repoRoot,
    fs: fs,
    fetchImpl: typeof fetch === 'function' ? fetch.bind(global) : null,
    seoApiUrl: process.env.SEO_AUTOMATION_API_URL || null,
    seoApiKey: process.env.SEO_AUTOMATION_API_KEY || null,
    seoKeywordSetId: process.env.SEO_AUTOMATION_KEYWORDSET_ID || null,
    seoRegion: (process.env.SEO_AUTOMATION_REGION || 'Noord-Brabant').toLowerCase(),
    themeKeywords: (process.env.SEO_AUTOMATION_THEME_KEYWORDS || '')
      .split(',')
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean),
    llmProvider: process.env.CITY_AUTOMATION_LLM_PROVIDER || 'template',
    llmModel: process.env.CITY_AUTOMATION_LLM_MODEL || 'gpt-4.1-mini',
    llmApiKey: process.env.CITY_AUTOMATION_LLM_API_KEY || process.env.OPENAI_API_KEY || null,
    approvalEmail: process.env.SEO_AUTOMATION_APPROVAL_EMAIL || null,
    dryRun: process.env.CITY_AUTOMATION_DRY_RUN === 'true',
    bannedClaims: DEFAULT_BANNED_CLAIMS,
    reviewFilePath: path.join(repoRoot, 'docs', 'city-content-review.md'),
    reportFilePath: path.join(repoRoot, 'docs', 'city-content-automation-report.md'),
    citiesFilePath: path.join(repoRoot, 'content', 'local-seo', 'cities.json'),
    generatorScriptPath: path.join(repoRoot, 'scripts', 'generate-city-pages.mjs'),
    limit: 5
  };

  const context = { ...defaultContext, ...overrides };

  if (!context.themeKeywords || !context.themeKeywords.length) {
    context.themeKeywords = DEFAULT_THEME_KEYWORDS;
  }

  context.themeKeywords = Array.from(new Set(context.themeKeywords.map((item) => item.toLowerCase())));

  context.bannedClaims = Array.from(
    new Set((context.bannedClaims || DEFAULT_BANNED_CLAIMS).map((claim) => claim.toLowerCase()))
  );

  return context;
}

function ping(contextOverrides = {}) {
  const context = resolveContext(contextOverrides);
  return {
    ok: true,
    seoAutomationConfigured: Boolean(context.seoApiUrl),
    llmProvider: context.llmProvider,
    dryRun: Boolean(context.dryRun)
  };
}

function normalize(value) {
  if (!value || typeof value !== 'string') {
    return '';
  }

  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function slugifyCity(city) {
  const normalized = normalize(city);
  if (!normalized) {
    return null;
  }

  const suffix = normalized
    .split(' ')
    .filter(Boolean)
    .join('-');

  return suffix ? `dj-${suffix}` : null;
}

function extractCityFromKeyword(keyword) {
  const withoutDj = keyword
    .replace(/\bdj\b/gi, '')
    .replace(/\bbruiloft\b/gi, '')
    .replace(/\bevent\b/gi, '')
    .replace(/\bfeest\b/gi, '')
    .trim();

  const tokens = withoutDj.split(' ').filter(Boolean);
  if (!tokens.length) {
    return null;
  }

  const candidate = tokens[tokens.length - 1];
  return candidate.length >= 3 ? candidate : null;
}

/**
 * Builds a deterministic slug for a keyword or city entry.
 *
 * @param {KeywordEntry} item
 * @returns {string|null}
 */
function buildSlugFromKeyword(item) {
  if (!item) {
    return null;
  }

  if (item.slug) {
    return item.slug;
  }

  if (item.city) {
    const slug = slugifyCity(item.city);
    if (slug) {
      return slug;
    }
  }

  if (item.keyword) {
    const inferredCity = extractCityFromKeyword(item.keyword);
    if (inferredCity) {
      const slug = slugifyCity(inferredCity);
      if (slug) {
        return slug;
      }
    }
  }

  return null;
}

/**
 * Fetches keyword candidates from the SEO automation API.
 *
 * @param {Object} [contextOverrides]
 * @returns {Promise<{ keywords: KeywordEntry[] }>}
 */
async function fetchKeywordSet(contextOverrides = {}) {
  const context = resolveContext(contextOverrides);
  const fetchFn = context.fetchImpl;

  if (!context.seoApiUrl || !fetchFn) {
    return { keywords: [] };
  }

  try {
    const url = new URL(context.seoApiUrl);
    if (context.seoKeywordSetId) {
      url.searchParams.set('keywordSetId', context.seoKeywordSetId);
    }

    const response = await fetchFn(url.toString(), {
      headers: {
        Accept: 'application/json',
        Authorization: context.seoApiKey ? `Bearer ${context.seoApiKey}` : undefined
      }
    });

    if (!response.ok) {
      throw new Error(`SEO API responded with ${response.status}`);
    }

    const payload = await response.json();
    if (!payload || !Array.isArray(payload.keywords)) {
      return { keywords: [] };
    }

    return payload;
  } catch (error) {
    console.warn('[automation] Failed to fetch keyword set:', error.message);
    return { keywords: [] };
  }
}

function keywordMatchesTheme(keyword, themes) {
  const normalized = normalize(keyword);
  if (!normalized) {
    return false;
  }

  return themes.some((theme) => normalized.includes(theme));
}

function matchesRegion(entry, region) {
  const regionNormalized = region.toLowerCase();
  const fields = [entry.region, entry.country, entry.geo, entry.city];
  return fields.some((field) => typeof field === 'string' && normalize(field).includes(regionNormalized));
}

/**
 * Filters the inbound keyword list so only relevant, unique slugs remain.
 *
 * @param {Array<KeywordEntry>} [keywords]
 * @param {Object} [contextOverrides]
 * @returns {Array<FilteredKeywordEntry>}
 */
function filterKeywords(keywords = [], contextOverrides = {}) {
  const context = resolveContext(contextOverrides);
  const seenSlugs = new Set();

  return keywords
    .filter((entry) => {
      if (!entry || typeof entry.keyword !== 'string') {
        return false;
      }

      if (!matchesRegion(entry, context.seoRegion)) {
        return false;
      }

      if (!keywordMatchesTheme(entry.keyword, context.themeKeywords)) {
        return false;
      }

      const slug = buildSlugFromKeyword(entry);
      if (!slug || seenSlugs.has(slug)) {
        return false;
      }

      seenSlugs.add(slug);
      return true;
    })
    .map((entry) => ({
      ...entry,
      slug: buildSlugFromKeyword(entry)
    }));
}

/**
 * Resolves which slugs already exist in Postgres or the local JSON cache.
 *
 * @param {Array<string>} slugs
 * @param {Object} [contextOverrides]
 * @returns {Promise<Set<string>>}
 */
async function lookupExistingSlugs(slugs, contextOverrides = {}) {
  const context = resolveContext(contextOverrides);
  const existing = new Set();

  if (!Array.isArray(slugs) || !slugs.length) {
    return existing;
  }

  try {
    const result = await runQuery('SELECT slug FROM local_seo_pages WHERE slug = ANY($1::text[])', [slugs]);
    if (result && Array.isArray(result.rows)) {
      result.rows.forEach((row) => {
        if (row && row.slug) {
          existing.add(row.slug);
        }
      });
    }
  } catch (error) {
    console.warn('[automation] Database lookup failed, falling back to JSON file:', error.message);
  }

  if (!existing.size) {
    try {
      const file = await context.fs.readFile(context.citiesFilePath, 'utf8');
      const parsed = JSON.parse(file);
      parsed.forEach((city) => {
        if (city && slugs.includes(city.slug)) {
          existing.add(city.slug);
        }
      });
    } catch (error) {
      console.warn('[automation] Failed to read cities.json for slug lookup:', error.message);
    }
  }

  return existing;
}

/**
 * Requests generated copy from the configured LLM provider.
 *
 * @param {string} prompt
 * @param {CityAutomationContext} context
 * @returns {Promise<string|null>}
 */
async function callLlm(prompt, context) {
  if (!context.llmApiKey || context.llmProvider === 'template') {
    return null;
  }

  const fetchFn = context.fetchImpl;
  if (!fetchFn) {
    return null;
  }

  try {
    if (context.llmProvider === 'openai') {
      const response = await fetchFn('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${context.llmApiKey}`
        },
        body: JSON.stringify({
          model: context.llmModel || 'gpt-4.1-mini',
          messages: [
            {
              role: 'system',
              content:
                'Je schrijft SEO-landingspaginas voor Mister DJ. Focus op realistische cases, lokale venues en behoud de Nederlandse tone of voice.'
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`LLM provider responded with ${response.status}`);
      }

      const payload = await response.json();
      const text = payload?.choices?.[0]?.message?.content;
      return typeof text === 'string' ? text.trim() : null;
    }
  } catch (error) {
    console.warn('[automation] LLM call failed, reverting to template:', error.message);
  }

  return null;
}

/**
 * Builds templated content when the LLM cannot be used or returns invalid JSON.
 *
 * @param {TemplateContentParams} params
 * @returns {GeneratedCityContent}
 */
function buildTemplateContent({ keyword, city, searchVolume, serpFeatures = [] }) {
  const cityName = city || extractCityFromKeyword(keyword) || 'de regio';
  const heroHook = serpFeatures.includes('local pack')
    ? 'met meetbare impact in Google Local Pack'
    : 'met premium entertainment op maat';

  return {
    intro: `Mister DJ activeert ${cityName} events ${heroHook}. Met een bewezen mix van DJ + live elementen en ${searchVolume ||
      'sterke'} zoekvolume in de regio, bouwen we playlists op maat met hospitality-first crew.`,
    cases: [
      {
        title: `${cityName} bruiloft highlight`,
        result: 'Dansvloer >95% gevuld tot sluiting',
        venue: `${cityName} top venue`
      },
      {
        title: `${cityName} corporate event`,
        result: 'NPS +45, hybride host + visuals',
        venue: `${cityName} business hotspot`
      }
    ],
    venues: [`${cityName} city hall`, `${cityName} boutique hotel`, `${cityName} eventspace`],
    faqs: [
      {
        question: `Hoe stemmen jullie het programma af in ${cityName}?`,
        answer:
          'We plannen een intake met ceremoniemeester of eventmanager, bouwen een tijdlijn met buffers en brengen de venue-techniek vooraf in kaart.'
      },
      {
        question: 'Kunnen jullie live-acts toevoegen?',
        answer:
          'Ja, kies uit sax, vocalist, percussion of audiovisuele partners; alles wordt integraal geregeld vanuit Mister DJ.'
      }
    ]
  };
}

/**
 * Generates SEO landing page content for a city keyword.
 *
 * @param {KeywordEntry} entry
 * @param {Object} [contextOverrides]
 * @returns {Promise<GeneratedCityContent>}
 */
async function generateCityContent(entry, contextOverrides = {}) {
  const context = resolveContext(contextOverrides);
  const slug = buildSlugFromKeyword(entry);
  const city = entry.city || extractCityFromKeyword(entry.keyword) || 'Noord-Brabant';

  const prompt = `Genereer Nederlandse landingpage copy voor Mister DJ voor de stad ${city}. Gebruik het keyword "$${
    entry.keyword
  }" met zoekvolume ${entry.searchVolume || 'onbekend'} en SERP features ${
    Array.isArray(entry.serpFeatures) && entry.serpFeatures.length
      ? entry.serpFeatures.join(', ')
      : 'geen specifieke'
  }. Geef een intro, twee cases met meetbare resultaten, een venues-lijst en twee FAQ's.`;

  const llmResponse = await callLlm(prompt, context);

  if (llmResponse) {
    try {
      const parsed = JSON.parse(llmResponse);
      if (parsed && parsed.intro) {
        return {
          slug,
          city,
          intro: parsed.intro,
          cases: parsed.cases || [],
          venues: parsed.venues || [],
          faqs: parsed.faqs || []
        };
      }
    } catch (_error) {
      // If the model returned free text, fall back to template generation.
    }
  }

  const templated = buildTemplateContent({
    keyword: entry.keyword,
    city,
    searchVolume: entry.searchVolume,
    serpFeatures: entry.serpFeatures
  });

  return {
    slug,
    city,
    ...templated
  };
}

/**
 * Runs basic QC checks to ensure the generated copy meets editorial standards.
 *
 * @param {GeneratedCityContent} content
 * @param {Object} [contextOverrides]
 * @returns {{ passed: boolean, issues: string[] }}
 */
function qualityCheck(content, contextOverrides = {}) {
  const context = resolveContext(contextOverrides);
  const issues = [];

  if (!content.intro || content.intro.length < 120) {
    issues.push('Intro is te kort (<120 tekens).');
  }

  if (content.intro && content.intro.length > 600) {
    issues.push('Intro is te lang (>600 tekens).');
  }

  const introNormalized = content.intro ? content.intro.toLowerCase() : '';
  context.bannedClaims.forEach((claim) => {
    if (introNormalized.includes(claim)) {
      issues.push(`Intro bevat verboden claim: "${claim}".`);
    }
  });

  if (!Array.isArray(content.cases) || content.cases.length < 1) {
    issues.push('Minstens één case ontbreekt.');
  }

  if (!Array.isArray(content.faqs) || content.faqs.length < 1) {
    issues.push('Minstens één FAQ ontbreekt.');
  }

  return {
    passed: issues.length === 0,
    issues
  };
}

/**
 * Persists approved content into the `cities.json` dataset.
 *
 * @param {Array<GeneratedCityContent>} entries
 * @param {Object} [contextOverrides]
 * @returns {Promise<{ updated: number }>}
 */
async function upsertCityContent(entries, contextOverrides = {}) {
  const context = resolveContext(contextOverrides);
  if (!entries.length) {
    return { updated: 0 };
  }

  const file = await context.fs.readFile(context.citiesFilePath, 'utf8');
  const parsed = JSON.parse(file);
  const map = new Map(parsed.map((city) => [city.slug, city]));

  entries.forEach((entry) => {
    map.set(entry.slug, {
      slug: entry.slug,
      city: entry.city,
      intro: entry.intro,
      cases: entry.cases,
      venues: entry.venues,
      faqs: entry.faqs
    });
  });

  const updated = Array.from(map.values());
  await context.fs.writeFile(context.citiesFilePath, `${JSON.stringify(updated, null, 2)}\n`, 'utf8');

  return { updated: entries.length };
}

/**
 * Appends flagged entries to the manual review queue markdown file.
 *
 * @param {Array<WorkflowResultItem>} flagged
 * @param {Object} [contextOverrides]
 * @returns {Promise<void>}
 */
async function appendReviewQueue(flagged, contextOverrides = {}) {
  const context = resolveContext(contextOverrides);
  if (!flagged.length) {
    return;
  }

  let existing = '';
  try {
    existing = await context.fs.readFile(context.reviewFilePath, 'utf8');
  } catch (_error) {
    // File will be created below
  }

  const output = [existing ? existing : REVIEW_FILE_HEADER];

  flagged.forEach((item) => {
    output.push(`## ${item.slug}\n`);
    output.push(`- Keyword: ${item.keyword}`);
    output.push(`- Issues: ${item.issues.join('; ')}`);
    output.push(`- Generated intro: ${item.content.intro}`);
    output.push('');
  });

  await context.fs.writeFile(context.reviewFilePath, output.join('\n'), 'utf8');
}

/**
 * Writes a run summary for the automation workflow.
 *
 * @param {WorkflowSummary} summary
 * @param {Object} [contextOverrides]
 * @returns {Promise<void>}
 */
async function writeReport(summary, contextOverrides = {}) {
  const context = resolveContext(contextOverrides);
  const lines = [
    '# City content automation run\n',
    `Laatste run: ${new Date().toISOString()}\n`,
    '## Samenvatting\n',
    `- Geanalyseerde keywords: ${summary.processed}\n`,
    `- Nieuwe/Geüpdatete steden: ${summary.approved.length}\n`,
    `- Naar review geplaatst: ${summary.flagged.length}\n`,
    `- Overgeslagen (bestonden al): ${summary.skipped}\n`
  ];

  if (summary.approved.length) {
    lines.push('\n### Nieuwe/Geüpdatete slugs\n');
    summary.approved.forEach((entry) => {
      lines.push(`- ${entry.slug} (keyword: ${entry.keyword}, search volume: ${entry.searchVolume || 'n.v.t.'})`);
    });
  }

  if (summary.flagged.length) {
    lines.push('\n### Review vereist\n');
    summary.flagged.forEach((entry) => {
      lines.push(`- ${entry.slug}: ${entry.issues.join('; ')}`);
    });
  }

  if (summary.generator) {
    lines.push('\n### Static build\n');
    lines.push(`- Script: ${summary.generator.script}`);
    lines.push(`- Status: ${summary.generator.success ? '✅ geslaagd' : '⚠️ mislukt'}`);
    if (summary.generator.error) {
      lines.push(`- Foutmelding: ${summary.generator.error}`);
    }
  }

  await context.fs.writeFile(context.reportFilePath, `${lines.join('\n')}\n`, 'utf8');
}

/**
 * Executes the static site generator after new content is approved.
 *
 * @param {Object} [contextOverrides]
 * @returns {Promise<{ success: boolean, skipped: boolean, script: string, error: string|null }>}
 */
async function runStaticGenerator(contextOverrides = {}) {
  const context = resolveContext(contextOverrides);
  if (!context.generatorScriptPath) {
    return { success: true, skipped: true };
  }

  return new Promise((resolve) => {
    const child = spawn('node', [context.generatorScriptPath], {
      cwd: context.repoRoot,
      stdio: 'inherit'
    });

    child.on('close', (code) => {
      resolve({
        success: code === 0,
        script: context.generatorScriptPath,
        skipped: false,
        error: code === 0 ? null : `Script exited with code ${code}`
      });
    });
    child.on('error', (error) => {
      resolve({ success: false, script: context.generatorScriptPath, skipped: false, error: error.message });
    });
  });
}

/**
 * Coordinates the full city content automation pipeline.
 *
 * @param {Object} [options]
 * @param {number} [options.limit]
 * @param {boolean} [options.dryRun]
 * @param {Object} [options.contextOverrides]
 * @returns {Promise<WorkflowSummary>}
 */
async function runWorkflow(options = {}) {
  const { limit = 5, dryRun, contextOverrides = {} } = options;
  const context = resolveContext({ ...contextOverrides });

  if (typeof dryRun === 'boolean') {
    context.dryRun = dryRun;
  }

  context.limit = limit;

  const { keywords } = await fetchKeywordSet(context);
  const filtered = filterKeywords(keywords, context).slice(0, context.limit);
  const slugs = filtered.map((entry) => entry.slug).filter(Boolean);
  const existing = await lookupExistingSlugs(slugs, context);

  const approved = [];
  const flagged = [];
  let skipped = 0;

  for (const entry of filtered) {
    if (existing.has(entry.slug)) {
      skipped += 1;
      continue;
    }

    const content = await generateCityContent(entry, context);
    const qc = qualityCheck(content, context);

    if (qc.passed) {
      approved.push({ ...entry, content });
    } else {
      flagged.push({ ...entry, content, issues: qc.issues });
    }
  }

  if (approved.length && !context.dryRun) {
    await upsertCityContent(
      approved.map((entry) => ({
        slug: entry.content.slug,
        city: entry.content.city,
        intro: entry.content.intro,
        cases: entry.content.cases,
        venues: entry.content.venues,
        faqs: entry.content.faqs
      })),
      context
    );
  }

  await appendReviewQueue(flagged, context);

  let generatorResult = null;
  if (approved.length && !context.dryRun) {
    generatorResult = await runStaticGenerator(context);
  }

  const summary = {
    processed: filtered.length,
    approved,
    flagged,
    skipped,
    generator: generatorResult
  };

  await writeReport(summary, context);
  return summary;
}

module.exports = {
  resolveContext,
  fetchKeywordSet,
  filterKeywords,
  buildSlugFromKeyword,
  generateCityContent,
  qualityCheck,
  lookupExistingSlugs,
  upsertCityContent,
  runWorkflow,
  ping
};
