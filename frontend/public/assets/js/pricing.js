import { initAnalytics } from './modules/analytics.js';

const analytics = initAnalytics();

const encoder = typeof TextEncoder !== 'undefined' ? new TextEncoder() : null;

const encodePdf = (value) => {
  if (encoder) {
    return encoder.encode(value);
  }

  const buffer = new Uint8Array(value.length);
  for (let index = 0; index < value.length; index += 1) {
    buffer[index] = value.charCodeAt(index);
  }
  return buffer;
};

const brochureState = {
  packages: [],
  initialized: false,
};

const escapePdfText = (value = '') => value
  .replace(/\\/g, '\\\\')
  .replace(/\(/g, '\\(')
  .replace(/\)/g, '\\)');

const buildBrochureStream = (packages) => {
  const commands = ['BT', '/F1 24 Tf', '50 800 Td', '(Mister DJ pakketten & prijzen) Tj'];

  commands.push('/F1 12 Tf', '0 -26 Td', `(Gegenereerd op ${escapePdfText(new Date().toLocaleDateString('nl-NL'))}) Tj`);
  commands.push('/F1 16 Tf', '0 -32 Td', '(Pakkettenoverzicht) Tj', '/F1 12 Tf');

  packages.forEach((pkg, index) => {
    commands.push('0 -28 Td', `(${escapePdfText(pkg.name)} - ${escapePdfText(formatCurrency(pkg.price))}) Tj`);
    if (pkg.description) {
      commands.push('0 -16 Td', `(${escapePdfText(pkg.description)}) Tj`);
    }
    if (Array.isArray(pkg.features)) {
      pkg.features.forEach((feature) => {
        commands.push('0 -14 Td', `(• ${escapePdfText(feature)}) Tj`);
      });
    }
    if (Array.isArray(pkg.upsells) && pkg.upsells.length) {
      commands.push('0 -18 Td', '(Aanbevolen uitbreidingen:) Tj');
      pkg.upsells.forEach((addon) => {
        commands.push('0 -14 Td', `(  - ${escapePdfText(addon.name)} (${escapePdfText(formatCurrency(addon.price))})) Tj`);
      });
    }
    if (index !== packages.length - 1) {
      commands.push('0 -24 Td', '( ) Tj');
    }
  });

  commands.push('0 -32 Td', '(Neem contact op via info@mr-dj.nl voor maatwerk.) Tj', 'ET');

  return `${commands.join('\n')}\n`;
};

const toByteLength = (value) => encodePdf(value).length;

const generateBrochurePdf = (packages) => {
  const stream = buildBrochureStream(packages);
  const streamLength = toByteLength(stream);

  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 5 0 R /Resources << /Font << /F1 4 0 R >> >> >>\nendobj\n',
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    `5 0 obj\n<< /Length ${streamLength} >>\nstream\n${stream}endstream\nendobj\n`,
  ];

  const header = '%PDF-1.4\n';
  let offset = toByteLength(header);
  const xref = ['0000000000 65535 f \n'];

  objects.forEach((object, index) => {
    const objectOffset = String(offset).padStart(10, '0');
    xref[index + 1] = `${objectOffset} 00000 n \n`;
    offset += toByteLength(object);
  });

  const xrefOffset = offset;
  const xrefBody = `xref\n0 ${xref.length}\n${xref.join('')}`;
  const trailer = `trailer\n<< /Size ${xref.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  const pdfString = `${header}${objects.join('')}${xrefBody}${trailer}`;
  return encodePdf(pdfString);
};

const ensureBrochureDownload = () => {
  if (brochureState.initialized) return;
  const trigger = document.querySelector('[data-action="download-brochure"]');
  if (!trigger) return;

  brochureState.initialized = true;
  trigger.addEventListener('click', () => {
    const packages = brochureState.packages;
    if (!packages.length) {
      console.warn('Geen pakketten beschikbaar voor brochure download.');
      return;
    }

    try {
      const pdfBytes = generateBrochurePdf(packages);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mister-dj-pricing-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      requestAnimationFrame(() => {
        URL.revokeObjectURL(url);
        link.remove();
      });
      if (analytics?.trackBrochureDownload) {
        analytics.trackBrochureDownload({
          page: 'pricing',
          package_count: packages.length,
        });
      }
    } catch (error) {
      console.error('Kon brochure niet genereren', error);
    }
  });
};

const updateBrochurePackages = (packages) => {
  if (Array.isArray(packages)) {
    brochureState.packages = packages;
  } else {
    brochureState.packages = [];
  }
  ensureBrochureDownload();
};

const CACHE_KEY = 'misterdj.pricing.packages.v1';
const CACHE_TTL_MS = 10 * 60 * 1000;

const safeStorage = (() => {
  try {
    const testKey = '__mr_dj_pricing__';
    window.sessionStorage.setItem(testKey, '1');
    window.sessionStorage.removeItem(testKey);
    return window.sessionStorage;
  } catch (error) {
    console.warn('SessionStorage niet beschikbaar voor pricing cache.', error);
    return null;
  }
})();

const readCache = () => {
  if (!safeStorage) return null;
  try {
    const raw = safeStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const payload = JSON.parse(raw);
    if (!payload?.expiresAt || payload.expiresAt < Date.now()) {
      safeStorage.removeItem(CACHE_KEY);
      return null;
    }
    return payload.value;
  } catch (error) {
    console.warn('Kon pricing cache niet lezen.', error);
    return null;
  }
};

const writeCache = (value, ttl = CACHE_TTL_MS) => {
  if (!safeStorage) return;
  try {
    safeStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        value,
        expiresAt: Date.now() + ttl,
      })
    );
  } catch (error) {
    console.warn('Kon pricing cache niet schrijven.', error);
  }
};

const fetchPackages = async () => {
  try {
    const response = await fetch('/api/packages', { headers: { Accept: 'application/json' } });
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data.packages) && data.packages.length) {
        return data.packages;
      }
    }
  } catch (error) {
    console.warn('API pakketten niet beschikbaar op pricing page.', error);
  }

  const fallbackResponse = await fetch('/assets/data/packages.json', { headers: { Accept: 'application/json' } });
  if (!fallbackResponse.ok) {
    throw new Error('Kon fallback pakketten niet laden');
  }
  return fallbackResponse.json();
};

const formatCurrency = (value) => new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
}).format(value);

const createPackageCard = (pkg) => {
  const upsells = (pkg.upsells || [])
    .map((addon) => `<li data-upsell-id="${addon.id}">${addon.name}<span>${formatCurrency(addon.price)}</span></li>`)
    .join('');

  return `
    <article class="pricing-card ${pkg.popular ? 'popular' : ''}" data-package-id="${pkg.id}" data-package-name="${pkg.name}">
      <header class="pricing-card-header">
        <h3>${pkg.name}</h3>
        <p>${pkg.description || ''}</p>
      </header>
      <div class="pricing-card-body">
        <div class="pricing-amount">${formatCurrency(pkg.price)}<span>per event</span></div>
        ${pkg.duration ? `<p class="pricing-duration">Inclusief ${pkg.duration} speeltijd</p>` : ''}
        <ul class="pricing-features">
          ${(pkg.features || []).map((feature) => `<li>✓ ${feature}</li>`).join('')}
        </ul>
        ${upsells ? `<div class="pricing-upsells"><h4>Populaire uitbreidingen</h4><ul>${upsells}</ul></div>` : ''}
      </div>
      <footer class="pricing-card-footer">
        <a href="/#contact" class="btn-primary" data-track="contact-start" data-package-id="${pkg.id}">Plan intake</a>
        <span class="package-meta">Geschikt voor: ${(pkg.eventTypes || []).join(', ') || 'alle events'}</span>
      </footer>
    </article>
  `;
};

const updateSchema = (packages) => {
  const schemaElement = document.getElementById('pricing-schema');
  if (!schemaElement) return;

  const offerCatalog = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': 'https://staging.sevensa.nl/pricing/#dj-service',
    'name': 'Mister DJ Pakketten',
    'provider': {
      '@type': 'Organization',
      'name': 'Mister DJ',
      'url': 'https://staging.sevensa.nl/'
    },
    'serviceType': 'DJ en showproductie',
    'areaServed': ['Nederland', 'België'],
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name': 'DJ pakketten en uitbreidingen',
      'itemListElement': packages.map((pkg) => ({
        '@type': 'Offer',
        'name': pkg.name,
        'price': pkg.price,
        'priceCurrency': 'EUR',
        'availability': 'https://schema.org/InStock',
        'itemOffered': {
          '@type': 'Service',
          'name': `${pkg.name} DJ pakket`,
          'areaServed': pkg.eventTypes || ['Nederland'],
          'provider': 'Mister DJ'
        },
        'eligibleCustomerType': pkg.eventTypes || ['consumer'],
        'addOn': (pkg.upsells || []).map((addon) => ({
          '@type': 'Offer',
          'name': addon.name,
          'price': addon.price,
          'priceCurrency': 'EUR'
        }))
      }))
    }
  };

  schemaElement.textContent = JSON.stringify(offerCatalog, null, 2);
};

const renderPackages = (packages) => {
  const container = document.getElementById('pricing-list');
  if (!container) return;

  container.innerHTML = packages.map(createPackageCard).join('');

  updateBrochurePackages(packages);

  container.querySelectorAll('.pricing-card').forEach((card) => {
    const detail = {
      package_id: card.dataset.packageId,
      package_name: card.dataset.packageName,
      page: 'pricing',
    };
    if (analytics) {
      const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            analytics.trackPackageView(detail);
            observerInstance.disconnect();
          }
        });
      }, { threshold: 0.5 });
      observer.observe(card);
    }
  });

  container.querySelectorAll('[data-track="contact-start"]').forEach((cta) => {
    cta.addEventListener('click', () => {
      if (analytics) {
        analytics.trackPackageCTA({
          package_id: cta.dataset.packageId,
          page: 'pricing',
        });
      }
    });
  });
};

const init = async () => {
  const cached = readCache();
  if (Array.isArray(cached) && cached.length) {
    renderPackages(cached);
    updateSchema(cached);
  }

  const packages = await fetchPackages();
  renderPackages(packages);
  updateSchema(packages);
  if (Array.isArray(packages) && packages.length) {
    writeCache(packages);
  }
};

init().catch((error) => {
  console.error('Kon pricing pagina niet initialiseren', error);
  const container = document.getElementById('pricing-list');
  if (container) {
    container.innerHTML = '<p class="loading">Kon pakketten niet laden. Neem contact op via <a href="mailto:info@mr-dj.nl">info@mr-dj.nl</a>.</p>';
  }
});
