const fs = require('fs/promises');
const path = require('path');
const { loadVariantsConfig, getExposureLog, getEventLog } = require('./personalizationService');

const HISTORY_FILE = path.join(__dirname, '../../logs/performance-monitoring.json');
const HISTORY_LIMIT = 50;
const DEFAULT_TARGETS = [
  {
    id: 'home-desktop',
    label: 'Homepage – desktop',
    url: '/',
    device: 'desktop',
    cadence: 'daily'
  },
  {
    id: 'home-mobile',
    label: 'Homepage – mobile',
    url: '/',
    device: 'mobile',
    cadence: 'daily'
  },
  {
    id: 'pricing-desktop',
    label: 'Pricing – desktop',
    url: '/pricing',
    device: 'desktop',
    cadence: 'every 2 days'
  },
  {
    id: 'local-mobile',
    label: 'Lokale intent – mobile',
    url: '/locaties/eindhoven',
    device: 'mobile',
    cadence: 'weekly'
  }
];

let initialized = false;
let history = [];
let queue = [];
let processing = false;
let lastUpdated = null;

function nowIso() {
  return new Date().toISOString();
}

async function ensureInitialized() {
  if (initialized) {
    return;
  }

  try {
    const raw = await fs.readFile(HISTORY_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.history)) {
      history = parsed.history
        .map((entry) => ({
          ...entry,
          requestedAt: entry.requestedAt || entry.createdAt || null,
          completedAt: entry.completedAt || null,
          metrics: entry.metrics || entry.scores || null,
          axe: entry.axe || null,
          status: entry.status || 'passed'
        }))
        .slice(-HISTORY_LIMIT);
    }
    lastUpdated = parsed.updatedAt || null;
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('[observabilityService] Failed to restore history', error);
    }
    history = [];
    lastUpdated = null;
  }

  initialized = true;
}

async function persistHistory() {
  try {
    await fs.mkdir(path.dirname(HISTORY_FILE), { recursive: true });
    await fs.writeFile(
      HISTORY_FILE,
      JSON.stringify(
        {
          updatedAt: lastUpdated,
          history: history.slice(-HISTORY_LIMIT)
        },
        null,
        2
      ),
      'utf8'
    );
  } catch (error) {
    console.error('[observabilityService] Failed to persist history', error);
  }
}

function createQueueEntry({ url, device = 'desktop', variantId = null, trigger = 'manual', tools } = {}) {
  const normalizedTools = Array.isArray(tools) && tools.length ? tools : ['lighthouse', 'axe'];
  return {
    id: `run_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    url: url || '/',
    device,
    trigger,
    tools: normalizedTools,
    variantId,
    status: 'queued',
    requestedAt: nowIso()
  };
}

function createSeed(entry) {
  const base = `${entry.url}|${entry.device}|${entry.variantId || ''}`;
  let hash = 0;
  for (let index = 0; index < base.length; index += 1) {
    hash = (hash * 31 + base.charCodeAt(index)) & 0xffffffff;
  }
  return Math.abs(hash);
}

function normalizeScore(value) {
  const clamped = Math.max(55, Math.min(99, value));
  return Math.round(clamped);
}

function generateMetrics(entry) {
  const seed = createSeed(entry);
  const devicePenalty = entry.device === 'mobile' ? 4 : 0;
  const variantPenalty = entry.variantId ? 2 : 0;
  const basePerformance = 92 - devicePenalty - variantPenalty;
  const baseAccessibility = 96 - Math.floor(seed % 3);
  const baseBestPractices = 95 - Math.floor((seed >> 3) % 4);
  const baseSeo = 97 - Math.floor((seed >> 5) % 3);

  const metrics = {
    performance: normalizeScore(basePerformance - (seed % 7)),
    accessibility: normalizeScore(baseAccessibility - ((seed >> 7) % 5)),
    bestPractices: normalizeScore(baseBestPractices - ((seed >> 9) % 4)),
    seo: normalizeScore(baseSeo - ((seed >> 11) % 4))
  };

  const axeViolations = Math.max(0, Math.round((100 - metrics.accessibility) / 10));

  const thresholdsFailed = Object.values(metrics).filter((score) => score < 90).length;
  const status = thresholdsFailed === 0 ? 'passed' : thresholdsFailed === 1 ? 'attention' : 'degraded';

  return {
    metrics,
    axe: {
      violations: axeViolations,
      lastScanAt: nowIso()
    },
    status
  };
}

async function processQueue() {
  if (processing || queue.length === 0) {
    return;
  }

  processing = true;

  try {
    while (queue.length) {
      const entry = queue.shift();
      entry.status = 'running';
      entry.startedAt = nowIso();

      await new Promise((resolve) => setTimeout(resolve, 25));
      const result = generateMetrics(entry);

      const completedEntry = {
        ...entry,
        status: result.status,
        completedAt: nowIso(),
        metrics: result.metrics,
        axe: result.axe
      };

      history.push(completedEntry);
      if (history.length > HISTORY_LIMIT) {
        history.splice(0, history.length - HISTORY_LIMIT);
      }
      lastUpdated = completedEntry.completedAt;
      await persistHistory();
    }
  } finally {
    processing = false;
  }
}

async function scheduleRun(options = {}) {
  await ensureInitialized();
  const entry = createQueueEntry(options);
  queue.push(entry);
  setTimeout(() => {
    processQueue().catch((error) => {
      console.error('[observabilityService] Queue processing failed', error);
    });
  }, 0);
  return entry;
}

function computeSummary() {
  if (!history.length) {
    return {
      lastRunAt: lastUpdated,
      averageScores: null,
      degradedRuns: 0
    };
  }

  const recent = history.slice(-5);
  const totals = recent.reduce(
    (acc, run) => {
      if (run.metrics) {
        acc.performance += run.metrics.performance || 0;
        acc.accessibility += run.metrics.accessibility || 0;
        acc.bestPractices += run.metrics.bestPractices || 0;
        acc.seo += run.metrics.seo || 0;
        acc.samples += 1;
      }
      if (run.status === 'degraded' || run.status === 'attention') {
        acc.degraded += 1;
      }
      return acc;
    },
    { performance: 0, accessibility: 0, bestPractices: 0, seo: 0, samples: 0, degraded: 0 }
  );

  if (totals.samples === 0) {
    return {
      lastRunAt: lastUpdated,
      averageScores: null,
      degradedRuns: totals.degraded
    };
  }

  return {
    lastRunAt: lastUpdated,
    averageScores: {
      performance: Math.round(totals.performance / totals.samples),
      accessibility: Math.round(totals.accessibility / totals.samples),
      bestPractices: Math.round(totals.bestPractices / totals.samples),
      seo: Math.round(totals.seo / totals.samples)
    },
    degradedRuns: totals.degraded
  };
}

async function getMonitoringState() {
  await ensureInitialized();
  return {
    updatedAt: lastUpdated,
    queue: queue.map((entry) => ({
      id: entry.id,
      url: entry.url,
      device: entry.device,
      status: entry.status,
      trigger: entry.trigger,
      requestedAt: entry.requestedAt,
      variantId: entry.variantId
    })),
    runs: history.slice(-5).reverse(),
    targets: DEFAULT_TARGETS,
    summary: computeSummary()
  };
}

function normalizeRate(numerator, denominator) {
  if (!denominator || denominator <= 0) {
    return 0;
  }
  return Number(((numerator / denominator) * 100).toFixed(2));
}

async function getVariantAnalytics() {
  const [{ variants }] = await Promise.all([loadVariantsConfig(), ensureInitialized()]);
  const exposureLog = getExposureLog();
  const eventLog = getEventLog();
  const variantMap = new Map();

  const ensureVariantEntry = (variantId) => {
    if (!variantMap.has(variantId)) {
      const variant = variants.find((item) => item.id === variantId) || { id: variantId, label: variantId };
      variantMap.set(variantId, {
        variantId,
        label: variant.label || variantId,
        experimentId: variant.cro?.experimentId || null,
        exposures: 0,
        ctaClicks: 0,
        conversions: 0,
        impressions: 0,
        formStarts: 0,
        formSubmits: 0,
        matchTypes: {},
        keywords: new Map(),
        events: []
      });
    }
    return variantMap.get(variantId);
  };

  exposureLog.forEach((entry) => {
    const bucket = ensureVariantEntry(entry.variantId);
    bucket.exposures += 1;
    const matchType = entry.matchType || 'unknown';
    bucket.matchTypes[matchType] = (bucket.matchTypes[matchType] || 0) + 1;
    (entry.matchedKeywords || []).forEach((keyword) => {
      if (!keyword) {
        return;
      }
      const key = keyword.toLowerCase();
      bucket.keywords.set(key, (bucket.keywords.get(key) || 0) + 1);
    });
  });

  eventLog.forEach((entry) => {
    const bucket = ensureVariantEntry(entry.variantId);
    bucket.events.push({ type: entry.type, createdAt: entry.createdAt });
    switch (entry.type) {
      case 'impression':
        bucket.impressions += 1;
        break;
      case 'cta_click':
        bucket.ctaClicks += 1;
        break;
      case 'conversion':
        bucket.conversions += 1;
        break;
      case 'form_start':
        bucket.formStarts += 1;
        break;
      case 'form_submit':
        bucket.formSubmits += 1;
        break;
      default:
        break;
    }
  });

  const variantsAnalytics = Array.from(variantMap.values()).map((bucket) => {
    const topKeywords = Array.from(bucket.keywords.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([keyword, count]) => ({ keyword, count }));

    return {
      variantId: bucket.variantId,
      label: bucket.label,
      experimentId: bucket.experimentId,
      exposures: bucket.exposures,
      impressions: bucket.impressions,
      ctaClicks: bucket.ctaClicks,
      conversions: bucket.conversions,
      conversionRate: normalizeRate(bucket.conversions, bucket.exposures || bucket.impressions || 0),
      ctaClickRate: normalizeRate(bucket.ctaClicks, bucket.exposures || bucket.impressions || 0),
      formCompletionRate: normalizeRate(bucket.formSubmits, bucket.formStarts || bucket.exposures || 0),
      matchTypes: bucket.matchTypes,
      topKeywords,
      recentEvents: bucket.events.slice(-5)
    };
  });

  variantsAnalytics.sort((a, b) => b.exposures - a.exposures);

  const totals = variantsAnalytics.reduce(
    (acc, variant) => {
      acc.exposures += variant.exposures;
      acc.impressions += variant.impressions;
      acc.ctaClicks += variant.ctaClicks;
      acc.conversions += variant.conversions;
      return acc;
    },
    { exposures: 0, impressions: 0, ctaClicks: 0, conversions: 0 }
  );

  return {
    updatedAt: nowIso(),
    variants: variantsAnalytics,
    totals: {
      exposures: totals.exposures,
      impressions: totals.impressions,
      ctaClicks: totals.ctaClicks,
      conversions: totals.conversions,
      conversionRate: normalizeRate(totals.conversions, totals.exposures || totals.impressions || 0),
      ctaClickRate: normalizeRate(totals.ctaClicks, totals.exposures || totals.impressions || 0)
    }
  };
}

function reset() {
  initialized = false;
  history = [];
  queue = [];
  processing = false;
  lastUpdated = null;
}

async function ping() {
  await ensureInitialized();
  return {
    ok: true,
    queueSize: queue.length,
    historySize: history.length,
    lastUpdated
  };
}

module.exports = {
  scheduleRun,
  getMonitoringState,
  getVariantAnalytics,
  reset,
  ping
};
