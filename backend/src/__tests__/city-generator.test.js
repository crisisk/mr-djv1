const { execFileSync } = require('child_process');
const path = require('path');
const { pathToFileURL } = require('url');

const repoRoot = path.resolve(__dirname, '../../..');
const dataPath = path.resolve(repoRoot, 'content/local-seo/cities.json');
const generatorModuleUrl = pathToFileURL(
  path.resolve(repoRoot, 'scripts/generate-city-pages.mjs')
).href;

describe('local SEO city generator', () => {
  it('bouwt HTML met schema, CTA en pakketten', () => {
    const script = `
      import { readFileSync, mkdtempSync, rmSync } from 'fs';
      import path from 'path';
      import os from 'os';
      import { generateCityPages } from ${JSON.stringify(generatorModuleUrl)};
      const dataPath = ${JSON.stringify(dataPath)};
      const tmpRoot = mkdtempSync(path.join(os.tmpdir(), 'mr-dj-city-'));
      const result = await generateCityPages({ dataPath, outputRoot: tmpRoot });
      const sample = result.cities[0];
      const html = readFileSync(path.join(tmpRoot, sample.slug, 'index.html'), 'utf-8');
      rmSync(tmpRoot, { recursive: true, force: true });
      console.log(JSON.stringify({
        count: result.count,
        sampleSlug: sample.slug,
        html,
      }));
    `;

    const output = execFileSync('node', ['--input-type=module', '-e', script], {
      encoding: 'utf-8',
    });

    const { count, sampleSlug, html } = JSON.parse(output.trim());
    expect(count).toBeGreaterThanOrEqual(10);
    expect(sampleSlug).toBeTruthy();
    expect(html).toContain(`DJ `);
    expect(html).toContain('<script type="application/ld+json">');
    expect(html).toContain('OfferCatalog');
    expect(html).toContain('data-track="contact-start"');
    expect(html).toContain('/pricing/');
  });
});
