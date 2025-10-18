import React, { useMemo } from 'react';
import { Button } from '../ui/button.jsx';
import HeroSection from '../Organisms/HeroSection.jsx';
import PricingTables from '../Organisms/PricingTables.jsx';
import AvailabilityChecker from '../Organisms/AvailabilityChecker.jsx';
import Testimonials from '../Organisms/Testimonials.jsx';
import PersonaMatchShowcase from '../Organisms/PersonaMatchShowcase.jsx';
import VideoHeroSection from '../Organisms/VideoHeroSection.jsx';
import RoiCalculator from '../Organisms/RoiCalculator.jsx';
import ContentHubShowcase from '../Organisms/ContentHubShowcase.jsx';
import ContactForm from '../Organisms/ContactForm.jsx';
import MediaGalleries from '../Organisms/MediaGalleries.jsx';
import StatHighlights from '../Molecules/StatHighlights.jsx';
import { useKeywordPersonalization } from '../../hooks/useKeywordPersonalization.js';
import { getWindow } from '../../lib/environment.js';

const DEFAULT_FEATURES = [
  { title: 'Live Interactie', icon: '🎤', description: 'De saxofonist beweegt zich tussen de gasten voor een onvergetelijke beleving.' },
  { title: 'Unieke Sound', icon: '🎷', description: 'Een unieke mix van elektronische beats en organische, live-gespeelde melodieën.' },
  { title: 'All-in Prijs', icon: '💰', description: 'Geen verborgen kosten. Alles is inbegrepen in de offerte.' },
];

const HERO_VARIANT_STORAGE_PREFIX = 'mr-dj-video-hero';

function pickHeroVariant(abTest = {}, meta, hasVideo) {
  if (!hasVideo) {
    return 'classic';
  }

  const variants = abTest?.variants;
  const defaultVariant = abTest?.defaultVariant || 'video';

  const browser = getWindow();
  if (!browser) {
    return defaultVariant;
  }

  const storageKey = `${HERO_VARIANT_STORAGE_PREFIX}:${abTest?.id || 'global'}:${meta?.variantId || 'global'}`;

  try {
    const stored = browser.sessionStorage?.getItem(storageKey);
    if (stored) {
      return stored;
    }
  } catch (error) {
    if (import.meta.env && import.meta.env.DEV) {
      console.warn('[DjSaxLanding] sessionStorage read failed', error);
    }
  }

  if (!variants || Object.keys(variants).length === 0) {
    return defaultVariant;
  }

  const entries = Object.entries(variants);
  const totalWeight = entries.reduce((sum, [, weight]) => sum + (Number(weight) || 0), 0);
  let roll = Math.random() * (totalWeight || entries.length);
  let chosen = defaultVariant;

  for (const [variant, weight] of entries) {
    const numericWeight = Number(weight) || (totalWeight === 0 ? 1 : 0);
    if (roll <= numericWeight) {
      chosen = variant;
      break;
    }
    roll -= numericWeight;
  }

  try {
    browser.sessionStorage?.setItem(storageKey, chosen);
  } catch (error) {
    if (import.meta.env && import.meta.env.DEV) {
      console.warn('[DjSaxLanding] sessionStorage write failed', error);
    }
  }

  return chosen;
}

function detectPersonaKey(personalization, meta) {
  const identifier =
    personalization?.personas?.activeId ||
    personalization?.persona ||
    personalization?.id ||
    meta?.city ||
    'default';

  const normalized = identifier.toString().toLowerCase();

  if (normalized.includes('corporate') || normalized.includes('business')) {
    return 'corporate';
  }

  if (normalized.includes('bruiloft') || normalized.includes('wedding')) {
    return 'wedding';
  }

  if (normalized.includes('festival') || normalized.includes('club') || normalized.includes('nightlife')) {
    return 'nightlife';
  }

  if (meta?.city) {
    return 'local';
  }

  return normalized || 'default';
}

const DjSaxFeatures = ({ title, caption, items }) => {
  const featureItems = Array.isArray(items) && items.length ? items : DEFAULT_FEATURES;

  return (
    <section className="py-spacing-3xl bg-neutral-light">
      <div className="container mx-auto px-spacing-md text-center space-y-spacing-xl">
        <div className="space-y-spacing-sm">
          <h2 className="text-font-size-h2 font-bold text-primary">{title || 'Waarom DJ + Sax?'}</h2>
          {caption && <p className="text-font-size-body text-neutral-dark/80 max-w-2xl mx-auto">{caption}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-spacing-xl">
          {featureItems.map((feature, index) => (
            <div key={`${feature.title}-${index}`} className="p-spacing-lg shadow-lg rounded-lg text-left space-y-spacing-sm">
              <span className="text-font-size-h1 block">{feature.icon}</span>
              <h3 className="text-font-size-h3 font-bold text-neutral-dark">{feature.title}</h3>
              <p className="text-font-size-body text-neutral-dark/80">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ConversionAccelerator = ({ cro, onEvent, variantId }) => {
  if (!cro) return null;

  const valueDrivers = Array.isArray(cro.valueDrivers) ? cro.valueDrivers : [];

  return (
    <section className="bg-neutral-dark text-neutral-light py-spacing-2xl">
      <div className="container mx-auto px-spacing-md">
        <div className="grid gap-spacing-xl md:grid-cols-3 text-left">
          <div className="space-y-spacing-sm">
            <h3 className="text-font-size-h4 font-semibold">Waarom nu boeken?</h3>
            <p className="text-font-size-body text-neutral-light/80">{cro.urgency}</p>
          </div>
          <div className="space-y-spacing-sm">
            <h3 className="text-font-size-h4 font-semibold">Value drivers</h3>
            <ul className="space-y-spacing-xs text-font-size-small">
              {valueDrivers.map((driver) => (
                <li key={driver} className="flex items-start gap-spacing-xs">
                  <span aria-hidden className="mt-[2px] text-secondary">•</span>
                  <span>{driver}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-spacing-sm">
            <h3 className="text-font-size-h4 font-semibold">Garantie</h3>
            <p className="text-font-size-body text-neutral-light/80">{cro.guarantee}</p>
            {cro.experimentId && (
              <span className="inline-flex text-xs uppercase tracking-wide text-neutral-light/60">
                CRO experiment: {cro.experimentId}
              </span>
            )}
            <Button
              variant="secondary"
              size="sm"
              className="mt-spacing-md"
              onClick={() => onEvent?.('cta_click', { cta: 'cro_block', variant: variantId })}
            >
              Plan strategiecall
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

const PersonalizationSummary = ({ meta }) => {
  if (!meta) return null;

  const keywords = meta.matchedKeywords?.length
    ? meta.matchedKeywords.join(', ')
    : meta.keywordInput?.join(', ') || 'n.v.t.';

  return (
    <div className="bg-primary/5 text-neutral-dark py-spacing-sm">
      <div className="container mx-auto px-spacing-md flex flex-wrap items-center justify-center gap-spacing-md text-xs md:text-sm">
        <span><strong>Variant:</strong> {meta.variantId}</span>
        <span><strong>Match type:</strong> {meta.matchType}</span>
        {meta.city && <span><strong>Locatie:</strong> {meta.city}</span>}
        <span><strong>Keywords:</strong> {keywords}</span>
        {meta.automationTriggered !== undefined && (
          <span><strong>n8n webhook:</strong> {meta.automationTriggered ? 'actief' : 'niet geactiveerd'}</span>
        )}
      </div>
    </div>
  );
};

const DjSaxLanding = () => {
  const { personalization, loading, meta, logEvent } = useKeywordPersonalization();

  const hero = personalization.hero || {};
  const features = personalization.features || {};
  const testimonialsSegment = personalization.testimonials
    ? { ...personalization.testimonials, id: personalization.id }
    : undefined;
  const pricingSegment = personalization.pricing
    ? { ...personalization.pricing, id: personalization.id }
    : undefined;
  const personas = personalization.personas || {};
  const leadCapture = personalization.leadCapture || {};
  const hasVideoHero = Boolean(hero.videoHero?.sources?.length);
  const heroVariant = useMemo(() => pickHeroVariant(hero.abTest, meta, hasVideoHero), [hero.abTest, meta, hasVideoHero]);
  const personaKey = useMemo(() => detectPersonaKey(personalization, meta), [personalization, meta]);

  const heroSection = heroVariant === 'video' && hasVideoHero ? (
    <VideoHeroSection
      eyebrow={hero.eyebrow}
      title={hero.title || 'DJ + SAXOFOON: De Ultieme Live Ervaring'}
      subtitle={hero.subtitle || 'Verhoog de energie van uw feest met de perfecte combinatie van een top-DJ en een live saxofonist.'}
      video={hero.videoHero}
      badges={hero.badges}
      metrics={hero.metrics}
      personaKey={personaKey}
      personaMicrocopy={hero.personaMicrocopy}
      ctaPrimaryText={hero.ctaPrimaryText || 'Check beschikbaarheid'}
      ctaSecondaryText={hero.ctaSecondaryText || 'Vraag prijs aan'}
      onPrimaryClick={() => logEvent('cta_click', { cta: 'hero_primary', label: hero.ctaPrimaryText })}
      onSecondaryClick={() => logEvent('cta_click', { cta: 'hero_secondary', label: hero.ctaSecondaryText })}
    >
      {loading && <p className="text-sm text-neutral-light/70">Personalisatie wordt geladen...</p>}
    </VideoHeroSection>
  ) : (
    <HeroSection
      eyebrow={hero.eyebrow}
      title={hero.title || 'DJ + SAXOFOON: De Ultieme Live Ervaring'}
      subtitle={hero.subtitle || 'Verhoog de energie van uw feest met de perfecte combinatie van een top-DJ en een live saxofonist.'}
      ctaPrimaryText={hero.ctaPrimaryText || 'Check beschikbaarheid'}
      ctaSecondaryText={hero.ctaSecondaryText || 'Vraag prijs aan'}
      badges={hero.badges}
      socialProof={hero.socialProof}
      metrics={hero.metrics}
      onPrimaryClick={() => logEvent('cta_click', { cta: 'hero_primary', label: hero.ctaPrimaryText })}
      onSecondaryClick={() => logEvent('cta_click', { cta: 'hero_secondary', label: hero.ctaSecondaryText })}
    >
      {loading && <p className="text-sm text-neutral-light/70">Personalisatie wordt geladen...</p>}
    </HeroSection>
  );

  return (
    <div className="DjSaxLanding">
      {heroSection}

      <PersonalizationSummary meta={meta} />

      <ConversionAccelerator cro={personalization.cro} variantId={personalization.id} onEvent={logEvent} />

      <DjSaxFeatures title={features.title} caption={features.caption} items={features.items} />

      {/* Statistics & Social Proof Section */}
      <section className="py-spacing-3xl bg-gradient-to-b from-neutral-light to-primary/5">
        <div className="container mx-auto px-spacing-md">
          <StatHighlights
            title="Bewezen Track Record"
            subtitle="Meer dan 15 jaar ervaring in het leveren van onvergetelijke events"
            stats={[
              {
                value: '2500+',
                label: 'Events verzorgd',
                description: 'Van intieme bruiloften tot grote corporate events met 1000+ gasten'
              },
              {
                value: '9.8/10',
                label: 'Gemiddelde score',
                description: 'Gebaseerd op 450+ reviews via ThePerfectWedding, Google & Trustpilot'
              },
              {
                value: '100%',
                label: 'Dansgarantie',
                description: 'Volle dansvloer of je geld terug - dat is ons belofte aan jou'
              }
            ]}
          />
        </div>
      </section>

      <Testimonials segment={testimonialsSegment} />

      <PersonaMatchShowcase
        title={personas.title}
        subtitle={personas.subtitle}
        personas={Array.isArray(personas.items) && personas.items.length ? personas.items : undefined}
        stats={Array.isArray(personas.stats) && personas.stats.length ? personas.stats : undefined}
      />

      <PricingTables
        segment={pricingSegment}
        onSelect={(pkg) => logEvent('cta_click', { cta: 'pricing_package', package: pkg.name })}
      />

      <RoiCalculator persona={personaKey} />

      {/* Media Gallery Section */}
      <section className="py-spacing-3xl bg-neutral-dark text-neutral-light">
        <div className="container mx-auto px-spacing-md">
          <div className="text-center mb-spacing-2xl space-y-spacing-md">
            <h2 className="text-font-size-h2 font-bold">Ons Portfolio</h2>
            <p className="text-font-size-body text-neutral-light/80 max-w-2xl mx-auto">
              Bekijk sfeerimpressies van recente events - van intieme bruiloften tot grote festivals
            </p>
          </div>
          <MediaGalleries />
        </div>
      </section>

      <ContentHubShowcase />

      {/* Contact Form Section */}
      <section id="contact" className="py-spacing-3xl bg-neutral-light">
        <div className="container mx-auto px-spacing-md">
          <div className="max-w-4xl mx-auto text-center mb-spacing-2xl">
            <h2 className="text-font-size-h2 font-bold text-primary mb-spacing-md">
              Plan je Onvergetelijke Event
            </h2>
            <p className="text-font-size-body text-neutral-dark/80">
              Vul onderstaand formulier in en ontvang binnen 24 uur een persoonlijke offerte op maat.
              Geen verplichtingen, volledig vrijblijvend.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      <AvailabilityChecker personalization={{ ...leadCapture, id: personalization.id }} onEvent={logEvent} />

      <div className="bg-primary text-neutral-light py-spacing-2xl text-center">
        <h3 className="text-font-size-h2 font-bold mb-spacing-md">Klaar voor de show?</h3>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => logEvent('cta_click', { cta: 'footer_primary' })}
        >
          Vraag Vrijblijvend een Offerte Aan
        </Button>
      </div>
    </div>
  );
};

export default DjSaxLanding;
