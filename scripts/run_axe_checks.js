#!/usr/bin/env node
const { mkdirSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');
const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;

const routes = process.env.AXE_ROUTES ? process.env.AXE_ROUTES.split(',') : ['/', '/contact', '/dashboard'];
const artifactDir = join('qa', 'artifacts', 'accessibility');

async function run() {
  mkdirSync(artifactDir, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const summary = [];

  try {
    for (const route of routes) {
      await page.goto(route, { waitUntil: 'networkidle' });
      const results = await new AxeBuilder({ page }).analyze();
      const filePath = join(artifactDir, `${route.replace(/\//g, '_') || 'root'}.json`);
      writeFileSync(filePath, JSON.stringify(results, null, 2), 'utf8');
      const violations = results.violations || [];
      const minor = violations.filter((item) => item.impact === 'minor');
      const nonMinor = violations.filter((item) => item.impact && item.impact !== 'minor');
      summary.push({ route, total: violations.length, minor: minor.length, nonMinor: nonMinor.length });
      console.log(`Route ${route} → ${violations.length} violations (${minor.length} minor, ${nonMinor.length} >= moderate)`);
      if (nonMinor.length > 0) {
        throw new Error(`Accessibility violations with impact >= moderate detected on ${route}`);
      }
    }

    const totalMinor = summary.reduce((acc, item) => acc + item.minor, 0);
    if (totalMinor > 5) {
      throw new Error(`Accessibility scan exceeded minor issue threshold: ${totalMinor} > 5`);
    }

    const summaryPath = join(artifactDir, 'summary.json');
    writeFileSync(summaryPath, JSON.stringify({ routes: summary }, null, 2), 'utf8');
    console.log('Accessibility scan complete.');
  } finally {
    await context.close();
    await browser.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
