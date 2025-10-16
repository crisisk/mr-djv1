import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

export const template = ({ slug, city, intro, cases, venues, faqs }) => {
  const caseMarkup = cases
    .map(
      (item) => `
        <article class="case-card">
          <h3>${item.title}</h3>
          <p class="case-result">${item.result}</p>
          <p class="case-venue">Locatie: ${item.venue}</p>
        </article>
      `
    )
    .join('');

  const venueMarkup = venues.map((venue) => `<li>${venue}</li>`).join('');
  const faqMarkup = faqs
    .map(
      (faq) => `
        <article class="faq-item">
          <h3>${faq.question}</h3>
          <p>${faq.answer}</p>
        </article>
      `
    )
    .join('');

  const serviceSchema = {
    '@type': 'Service',
    '@id': `https://staging.sevensa.nl/local-seo/${slug}/#service`,
    name: `DJ ${city}`,
    serviceType: 'DJ en showproductie',
    areaServed: city,
    provider: {
      '@type': 'Organization',
      name: 'Mister DJ',
      url: 'https://staging.sevensa.nl/',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `Pakketten voor ${city}`,
      itemListElement: cases.map((item) => ({
        '@type': 'Offer',
        name: item.title,
        description: `${item.result} @ ${item.venue}`,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
      })),
    },
  };

  const faqSchema = {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://staging.sevensa.nl/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: `DJ ${city}`,
        item: `https://staging.sevensa.nl/local-seo/${slug}/`,
      },
    ],
  };

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [serviceSchema, faqSchema, breadcrumbSchema],
  };

  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DJ ${city} | Mister DJ</title>
  <meta name="description" content="Mister DJ voor events in ${city}. ${intro}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://staging.sevensa.nl/local-seo/${slug}/" />
  <link rel="alternate" href="https://staging.sevensa.nl/local-seo/${slug}/" hreflang="nl-nl" />
  <link rel="alternate" href="https://staging.sevensa.nl/local-seo/${slug}/" hreflang="x-default" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="DJ ${city} | Mister DJ" />
  <meta property="og:description" content="Mister DJ voor events in ${city}. ${intro}" />
  <meta property="og:url" content="https://staging.sevensa.nl/local-seo/${slug}/" />
  <meta property="og:image" content="https://staging.sevensa.nl/assets/images/logo.png" />
  <meta property="og:site_name" content="Mister DJ" />
  <meta property="og:locale" content="nl_NL" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="DJ ${city} | Mister DJ" />
  <meta name="twitter:description" content="Mister DJ voor events in ${city}. ${intro}" />
  <meta name="twitter:image" content="https://staging.sevensa.nl/assets/images/logo.png" />
  <meta name="twitter:site" content="@misterdj" />
  <link rel="preload" href="/assets/css/style.css" as="style" />
  <link rel="stylesheet" href="/assets/css/style.css" />
  <link rel="modulepreload" href="/assets/js/pricing.js" />
  <link rel="modulepreload" href="/assets/js/modules/analytics.js" />
  <link rel="preload" href="/assets/data/packages.json" as="fetch" type="application/json" crossorigin="anonymous" />
  <link rel="preload" href="/assets/data/testimonials.json" as="fetch" type="application/json" crossorigin="anonymous" />
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body class="pricing-page">
  <nav class="navbar">
    <div class="container">
      <div class="nav-brand">
        <img src="/assets/images/logo.webp" alt="Mister DJ" class="logo" loading="lazy" decoding="async" />
        <span class="brand-name">Mister DJ</span>
      </div>
      <a href="/" class="btn-secondary">Terug naar home</a>
    </div>
  </nav>

  <main class="pricing-content">
    <header class="pricing-hero">
      <div class="container">
        <h1>DJ ${city}</h1>
        <p>${intro}</p>
        <div class="hero-cta">
          <a href="/#contact" class="btn-primary btn-large" data-track="contact-start">Check beschikbaarheid</a>
          <a href="/pricing/" class="btn-secondary btn-large">Bekijk pakketten</a>
        </div>
      </div>
    </header>

    <section class="pricing-section">
      <div class="container">
        <div class="section-header">
          <h2>Recente cases in ${city}</h2>
          <p>Evidence-based events waar Mister DJ de dansvloer vulde.</p>
        </div>
        <div class="case-grid">
          ${caseMarkup}
        </div>
      </div>
    </section>

    <section class="media-gallery-section">
      <div class="container">
        <div class="section-header">
          <h2>Locaties waar we graag spelen</h2>
          <p>Wij kennen de logistiek, geluidslimieten en hospitality van deze venues in ${city}.</p>
        </div>
        <ul class="media-gallery-grid venue-list">
          ${venueMarkup}
        </ul>
      </div>
    </section>

    <section class="pricing-faq">
      <div class="container">
        <div class="section-header">
          <h2>Veelgestelde vragen over ${city}</h2>
          <p>Antwoorden die sales en planners direct kunnen delen met prospects.</p>
        </div>
        <div class="faq-grid">
          ${faqMarkup}
        </div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container">
      <div class="footer-bottom">
        <p>&copy; 2025 Mister DJ. Alle rechten voorbehouden.</p>
      </div>
    </div>
  </footer>
</body>
</html>`;
};

export const readCities = async (dataPath) => {
  const raw = await fs.readFile(dataPath, 'utf-8');
  return JSON.parse(raw);
};

export const generateCityPages = async ({
  dataPath = path.join(repoRoot, 'content', 'local-seo', 'cities.json'),
  outputRoot = path.join(repoRoot, 'frontend', 'public', 'local-seo'),
} = {}) => {
  const cities = await readCities(dataPath);

  await fs.mkdir(outputRoot, { recursive: true });

  await Promise.all(
    cities.map(async (city) => {
      const cityDir = path.join(outputRoot, city.slug);
      await fs.mkdir(cityDir, { recursive: true });
      const html = template(city);
      await fs.writeFile(path.join(cityDir, 'index.html'), html, 'utf-8');
    })
  );

  return { count: cities.length, cities, outputRoot };
};

const isCliExecution = () => {
  if (!process.argv[1]) return false;
  const calledFrom = path.resolve(process.argv[1]);
  const currentFile = fileURLToPath(import.meta.url);
  return calledFrom === currentFile;
};

if (isCliExecution()) {
  generateCityPages()
    .then(({ count, outputRoot }) => {
      console.log(`Generated ${count} city pages in ${outputRoot}`);
    })
    .catch((error) => {
      console.error('City page generation failed', error);
      process.exitCode = 1;
    });
}
