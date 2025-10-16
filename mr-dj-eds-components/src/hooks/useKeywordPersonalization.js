import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { trackEvent } from '../lib/analytics.js';

const FALLBACK_PERSONALIZATION = {
  id: 'default_master',
  hero: {
    eyebrow: 'Premium DJ collectief',
    title: 'DJ + Sax met maximale energie voor ieder event',
    subtitle:
      'Van intieme borrels tot 1000+ gasten: Mister DJ levert clubwaardige shows met live-musici, regie en 100% dansgarantie.',
    ctaPrimaryText: 'Check beschikbaarheid',
    ctaSecondaryText: 'Bekijk cases',
    badges: ['Gemiddeld 4,9/5 beoordeling', 'Landelijke dekking', 'Live sax & vocalists'],
    socialProof: '452 events uitgevoerd in 2024 met een gemiddelde klanttevredenheid van 9,6.',
    metrics: [
      { label: 'Events per jaar', value: '450+' },
      { label: 'Gem. rating', value: '9,6' },
      { label: 'Gem. responstijd', value: '<12 uur' }
    ]
  },
  features: {
    title: 'Waarom Mister DJ werkt',
    items: [
      {
        title: 'Volledige regie',
        icon: '🎧',
        description: 'Intake, draaiboek en live regie worden verzorgd door een vast projectteam.'
      },
      {
        title: 'Clubwaardige techniek',
        icon: '🎛️',
        description: 'Line-array geluid, LED walls en lichtdesign afgestemd op locatie & doelgroep.'
      },
      {
        title: 'Live beleving',
        icon: '🎷',
        description: 'Combineer DJ met sax, vocalist of percussion voor maximale interactie.'
      }
    ],
    caption: 'Basisvariant wanneer er geen specifieke zoekintentie wordt gedetecteerd.'
  },
  cro: {
    experimentId: 'global-intent-v1',
    urgency: 'Nog 4 productiedata beschikbaar in Q1 2026 – planning sluit over 6 dagen.',
    valueDrivers: [
      'Gratis eventregiecall t.w.v. €195 bij aanvraag deze week',
      'Realtime inzicht via klantdashboard (planning, draaiboek, team)',
      'Complete AV-crew met backup-equipment in prijs inbegrepen'
    ],
    guarantee: 'Niet tevreden na intake? We matchen kosteloos een partner uit het RentGuy netwerk.'
  },
  testimonials: {
    headline: 'Social Proof & Media',
    subheadline: 'Mix van bruiloften, corporate events en private parties waar Mister DJ het verschil maakte.',
    highlightCategory: 'bruiloft',
    testimonialIds: ['bruiloft-eindhoven-2025', 'corporate-eindhoven-2024', 'private-breda-2023'],
    mediaTiles: ['Aftermovie 2025', 'Awardshow visuals', 'Silent disco']
  },
  pricing: {
    headline: 'Pakketten voor elke eventvorm',
    subheadline: 'Combineer basispakketten met uitbreidingen – realtime ROI-tracking via dashboard.',
    highlightPackage: 'Zilver',
    ctaOverrides: {
      Brons: 'Plan kennismaking',
      Zilver: 'Start intakecall',
      Goud: 'Boek premium show'
    },
    guaranteeCopy: 'Elke aanvraag ontvangt binnen 24 uur een voorstel met draaiboek en AV-plan.',
    valueEmphasis: ['Landelijke crew', 'Live muzikanten optioneel', 'Integratie met RentGuy']
  },
  personas: {
    title: 'Persona-match & journeys',
    subtitle: 'Koppel elke aanvraag direct aan het juiste draaiboek en artiestenteam.',
    items: [],
    stats: []
  },
  leadCapture: {
    formHeadline: 'Laat ons checken of jullie datum vrij is',
    formCopy: 'We reageren binnen 12 uur met voorstel en planning.',
    successMessage: 'Bedankt! Het team neemt binnen 12 uur contact op.',
    defaultMessage: 'Vertel ons over jullie event, locatie en gewenste sfeer.',
    eventTypeOptions: ['Bruiloft', 'Bedrijfsfeest', 'Festival', 'Private event'],
    packageOptions: ['Brons', 'Zilver', 'Goud'],
    defaultEventType: 'Bruiloft',
    defaultPackageId: 'Zilver'
  }
};

function resolveApiBase() {
  const envBase = typeof import.meta !== 'undefined' ? import.meta?.env?.VITE_BACKEND_URL || import.meta?.env?.VITE_API_BASE_URL : null;

  if (envBase && typeof envBase === 'string') {
    return envBase.replace(/\/$/, '');
  }

  return '/api';
}

function mergePersonalization(base, variant) {
  if (!variant) {
    return base;
  }

  return {
    ...base,
    ...variant,
    hero: {
      ...base.hero,
      ...(variant.hero || {})
    },
    features: {
      ...base.features,
      ...(variant.features || {}),
      items: Array.isArray(variant.features?.items) && variant.features.items.length
        ? variant.features.items
        : base.features.items
    },
    cro: {
      ...base.cro,
      ...(variant.cro || {}),
      valueDrivers:
        Array.isArray(variant.cro?.valueDrivers) && variant.cro.valueDrivers.length
          ? variant.cro.valueDrivers
          : base.cro.valueDrivers
    },
    testimonials: {
      ...base.testimonials,
      ...(variant.testimonials || {})
    },
    pricing: {
      ...base.pricing,
      ...(variant.pricing || {}),
      valueEmphasis:
        Array.isArray(variant.pricing?.valueEmphasis) && variant.pricing.valueEmphasis.length
          ? variant.pricing.valueEmphasis
          : base.pricing.valueEmphasis,
      ctaOverrides: {
        ...(base.pricing?.ctaOverrides || {}),
        ...((variant.pricing && variant.pricing.ctaOverrides) || {})
      }
    },
    personas: {
      ...base.personas,
      ...(variant.personas || {})
    },
    leadCapture: {
      ...base.leadCapture,
      ...(variant.leadCapture || {})
    }
  };
}

export function useKeywordPersonalization() {
  const apiBase = useMemo(resolveApiBase, []);
  const [state, setState] = useState({
    personalization: FALLBACK_PERSONALIZATION,
    loading: true,
    error: null,
    meta: null
  });
  const metaRef = useRef(null);

  const sendEvent = useCallback(
    (event) => {
      if (!event || !event.variantId) {
        return Promise.resolve();
      }

      return fetch(`${apiBase}/personalization/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      }).catch(() => undefined);
    },
    [apiBase]
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      setState((prev) => ({ ...prev, loading: false }));
      return undefined;
    }

    const params = new URLSearchParams(window.location.search);
    const keyword = params.get('keyword') || params.get('utm_term') || params.get('q');
    const persona = params.get('persona') || params.get('intent');
    const landing = window.location.pathname;
    const referrer = typeof document !== 'undefined' ? document.referrer : undefined;

    const query = new URLSearchParams();
    if (keyword) query.set('keyword', keyword);
    if (params.get('keywords')) query.set('keywords', params.get('keywords'));
    if (params.get('utm_term')) query.set('utm_term', params.get('utm_term'));
    if (params.get('utm_campaign')) query.set('utm_campaign', params.get('utm_campaign'));
    if (params.get('utm_source')) query.set('utm_source', params.get('utm_source'));
    if (persona) query.set('persona', persona);
    if (params.get('intent')) query.set('intent', params.get('intent'));
    if (params.get('search')) query.set('search', params.get('search'));
    if (params.get('q')) query.set('q', params.get('q'));
    if (landing) query.set('landing', landing);
    if (referrer) query.set('referrer', referrer);

    const controller = new AbortController();

    fetch(`${apiBase}/personalization/keyword?${query.toString()}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Kon personalisatievariant niet laden');
        }
        return response.json();
      })
      .then((payload) => {
        const merged = mergePersonalization(FALLBACK_PERSONALIZATION, payload.variant);
        const meta = payload.meta || {
          variantId: merged.id,
          matchType: 'default',
          matchedKeywords: [],
          keywordInput: []
        };

        metaRef.current = meta;
        setState({ personalization: merged, loading: false, error: null, meta });

        trackEvent('personalization_variant_loaded', {
          variant_id: meta.variantId,
          match_type: meta.matchType,
          matched_keywords: (meta.matchedKeywords || []).join(','),
          automation_triggered: Boolean(meta.automationTriggered)
        });

        sendEvent({
          type: 'impression',
          variantId: meta.variantId,
          keyword: Array.isArray(meta.keywordInput) ? meta.keywordInput[0] : undefined,
          payload: { matchType: meta.matchType }
        });
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          return;
        }
        setState((prev) => ({ ...prev, loading: false, error: error.message }));
      });

    return () => controller.abort();
  }, [apiBase, sendEvent]);

  const logEvent = useCallback(
    (type, payload = {}) => {
      if (!metaRef.current?.variantId) {
        return;
      }

      const eventPayload = {
        type,
        variantId: metaRef.current.variantId,
        keyword: Array.isArray(metaRef.current.keywordInput) ? metaRef.current.keywordInput[0] : undefined,
        payload
      };

      sendEvent(eventPayload);
      trackEvent('personalization_event', {
        variant_id: metaRef.current.variantId,
        event_type: type,
        ...payload
      });
    },
    [sendEvent]
  );

  return {
    personalization: state.personalization,
    loading: state.loading,
    error: state.error,
    meta: state.meta,
    logEvent
  };
}
