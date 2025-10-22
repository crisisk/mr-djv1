#!/usr/bin/env node
const { mkdirSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

const routes = process.env.LIGHTHOUSE_ROUTES ? process.env.LIGHTHOUSE_ROUTES.split(',') : ['/', '/dashboard'];
const artifactDir = join('qa', 'artifacts', 'performance');

async function runAudit(urlPath) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const target = `${process.env.LIGHTHOUSE_BASE_URL || 'http://localhost:3000'}${urlPath}`;
  const options = { port: chrome.port, output: 'json', logLevel: 'info' };
  const config = null;
  try {
    const runnerResult = await lighthouse(target, options, config);
    const filePath = join(artifactDir, `${urlPath.replace(/\//g, '_') || 'root'}.json`);
    writeFileSync(filePath, runnerResult.report, 'utf8');
    await chrome.kill();
    const categories = runnerResult.lhr.categories;
    return {
      url: target,
      performance: categories.performance.score * 100,
      accessibility: categories.accessibility.score * 100,
      bestPractices: categories['best-practices'].score * 100,
      seo: categories.seo.score * 100
    };
  } catch (error) {
    await chrome.kill();
    throw error;
  }
}

async function main() {
  mkdirSync(artifactDir, { recursive: true });
  const summary = [];
  for (const route of routes) {
    console.log(`Running Lighthouse for ${route}`);
    const metrics = await runAudit(route);
    console.log(`→ Performance ${metrics.performance}`);
    if (metrics.performance < 90) {
      throw new Error(`Performance score below threshold for ${route}: ${metrics.performance}`);
    }
    summary.push(metrics);
  }
  const summaryPath = join(artifactDir, 'lighthouse-summary.json');
  writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf8');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
