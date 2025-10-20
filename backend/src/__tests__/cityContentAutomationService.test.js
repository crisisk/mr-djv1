const fs = require('fs/promises');
const os = require('os');
const path = require('path');
const { buildRequiredEnv } = require('../testUtils/env');

const ORIGINAL_ENV = { ...process.env };
process.env = { ...ORIGINAL_ENV, ...buildRequiredEnv() };

const automation = require('../services/cityContentAutomationService');

function createMockFetch(payload) {
  return jest.fn(async () => ({
    ok: true,
    async json() {
      return payload;
    }
  }));
}

describe('cityContentAutomationService', () => {
  describe('filterKeywords', () => {
    it('filters keywords by region, theme and uniqueness', () => {
      const keywords = [
        { keyword: 'dj bruiloft eindhoven', region: 'Noord-Brabant', city: 'Eindhoven', searchVolume: 500 },
        { keyword: 'fotograaf eindhoven', region: 'Noord-Brabant', city: 'Eindhoven' },
        { keyword: 'dj event tilburg', region: 'noord-brabant', city: 'Tilburg' },
        { keyword: 'dj event tilburg', region: 'noord-brabant', city: 'Tilburg' }
      ];

      const filtered = automation.filterKeywords(keywords, {
        seoRegion: 'Noord-Brabant',
        themeKeywords: ['dj', 'bruiloft']
      });

      expect(filtered).toHaveLength(2);
      expect(filtered.map((item) => item.slug)).toEqual(['dj-eindhoven', 'dj-tilburg']);
    });
  });

  describe('buildSlugFromKeyword', () => {
    it('creates a slug from keyword when city is missing', () => {
      const slug = automation.buildSlugFromKeyword({ keyword: 'dj feest breda' });
      expect(slug).toBe('dj-breda');
    });
  });

  describe('generateCityContent', () => {
    it('falls back to template when no LLM is configured', async () => {
      const content = await automation.generateCityContent(
        {
          keyword: 'dj bruiloft den bosch',
          city: "'s-Hertogenbosch",
          searchVolume: 260
        },
        { llmProvider: 'template', llmApiKey: null }
      );

      expect(content.slug).toBe("dj-s-hertogenbosch");
      expect(content.intro).toContain('Mister DJ');
      expect(Array.isArray(content.cases)).toBe(true);
      expect(content.cases.length).toBeGreaterThan(0);
    });
  });

  describe('qualityCheck', () => {
    it('flags content that fails minimum requirements', () => {
      const result = automation.qualityCheck(
        {
          intro: 'Te kort',
          cases: [],
          faqs: []
        },
        { bannedClaims: ['gratis'] }
      );

      expect(result.passed).toBe(false);
      expect(result.issues).toEqual([
        'Intro is te kort (<120 tekens).',
        'Minstens één case ontbreekt.',
        'Minstens één FAQ ontbreekt.'
      ]);
    });
  });

  describe('runWorkflow', () => {
    it('generates new city content and writes reports', async () => {
      const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'automation-test-'));
      const citiesSource = await fs.readFile(path.join(__dirname, '../../../content/local-seo/cities.json'), 'utf8');
      const citiesFilePath = path.join(tmpDir, 'cities.json');
      await fs.writeFile(citiesFilePath, citiesSource, 'utf8');

      const reviewFilePath = path.join(tmpDir, 'review.md');
      const reportFilePath = path.join(tmpDir, 'report.md');
      const cityContentDirPath = path.join(tmpDir, 'cities');

      const payload = {
        keywords: [
          { keyword: 'dj feest helmond', region: 'Noord-Brabant', city: 'Helmond', searchVolume: 140 }
        ]
      };

      const summary = await automation.runWorkflow({
        limit: 5,
        dryRun: false,
        contextOverrides: {
          fetchImpl: createMockFetch(payload),
          seoApiUrl: 'https://example.com/keywords',
          citiesFilePath,
          cityContentDirPath,
          reportFilePath,
          reviewFilePath,
          generatorScriptPath: null
        }
      });

      expect(summary.processed).toBe(1);
      expect(summary.approved).toHaveLength(1);
      expect(summary.flagged).toHaveLength(0);

      const updatedCities = JSON.parse(await fs.readFile(citiesFilePath, 'utf8'));
      const helmond = updatedCities.find((city) => city.slug === 'dj-helmond');
      expect(helmond).toBeDefined();
      expect(helmond.intro).toContain('Mister DJ');

      const generatedCityFile = await fs.readFile(path.join(cityContentDirPath, 'dj-helmond.json'), 'utf8');
      const parsedCityFile = JSON.parse(generatedCityFile);
      expect(parsedCityFile.slug).toBe('dj-helmond');
      expect(parsedCityFile.city).toBe('Helmond');

      const report = await fs.readFile(reportFilePath, 'utf8');
      expect(report).toContain('City content automation run');
    });
  });
});

afterAll(() => {
  process.env = ORIGINAL_ENV;
});
