import React, { useEffect, useMemo, useState } from 'react';
import { resolveApiBase } from '../../lib/apiBase.js';
import { trackEvent } from '../../lib/analytics.js';

const DEFAULT_INPUT = {
  attendees: 150,
  conversionRate: 0.12,
  averageDealValue: 3800,
  nurtureTouchpoints: 3,
  persona: 'corporate'
};

export const PERSONA_PRESETS = {
  corporate: {
    label: 'Corporate event',
    uplift: 0.18,
    nurtureCost: 45
  },
  wedding: {
    label: 'Bruiloft',
    uplift: 0.24,
    nurtureCost: 30
  },
  nightlife: {
    label: 'Nightlife / festival',
    uplift: 0.15,
    nurtureCost: 25
  }
};

function formatCurrency(value) {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(value);
}

export function calculateOutcomes(packages, input) {
  const preset = PERSONA_PRESETS[input.persona] || PERSONA_PRESETS.corporate;
  const baseLift = input.conversionRate + preset.uplift;
  const nurtureBudget = input.nurtureTouchpoints * preset.nurtureCost;
  const influencedRevenue = input.attendees * baseLift * input.averageDealValue;

  return packages.map((pkg) => {
    const investment = Number(pkg.price || 0) + nurtureBudget;
    const roi = investment > 0 ? ((influencedRevenue - investment) / investment) * 100 : 0;
    const breakEvenLeads = investment > 0 ? Math.ceil(investment / input.averageDealValue) : 0;

    return {
      ...pkg,
      investment,
      influencedRevenue,
      roi,
      breakEvenLeads
    };
  });
}

const RoiCalculator = ({ persona }) => {
  const [input, setInput] = useState({ ...DEFAULT_INPUT, persona: persona || DEFAULT_INPUT.persona });
  const [packages, setPackages] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: null });

  useEffect(() => {
    let mounted = true;
    const apiBase = resolveApiBase();

    fetch(`${apiBase}/packages`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Kon pakketten niet laden');
        }
        return response.json();
      })
      .then((payload) => {
        if (!mounted) return;
        setPackages(Array.isArray(payload.packages) ? payload.packages : []);
        setStatus({ loading: false, error: null });
      })
      .catch((error) => {
        if (!mounted) return;
        console.error('[RoiCalculator] load failed', error);
        setStatus({ loading: false, error: 'Kon actuele pakketten niet laden. Gebruik fallback data.' });
        setPackages([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setInput((prev) => ({ ...prev, persona: persona || prev.persona }));
  }, [persona]);

  const outcomes = useMemo(() => {
    const dataSource = packages.length ? packages : [
      { id: 'bronze', name: 'Brons', price: 495 },
      { id: 'silver', name: 'Zilver', price: 795, popular: true },
      { id: 'gold', name: 'Goud', price: 1295 }
    ];

    return calculateOutcomes(dataSource, input);
  }, [input, packages]);

  const preset = PERSONA_PRESETS[input.persona] || PERSONA_PRESETS.corporate;

  const handleInputChange = (field, value) => {
    setInput((prev) => ({ ...prev, [field]: value }));
    trackEvent('roi_calculator_change', {
      field,
      value,
      persona: field === 'persona' ? value : input.persona
    });
  };

  return (
    <section className="bg-neutral-dark text-neutral-light py-spacing-3xl">
      <div className="container mx-auto px-spacing-md space-y-spacing-2xl">
        <header className="space-y-spacing-sm text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-secondary/80">ROI-calculator</p>
          <h2 className="text-font-size-h2 font-bold">Bereken de business case per pakket</h2>
          <p className="text-neutral-light/80 max-w-3xl mx-auto">
            Gebruik deze calculator tijdens salescalls of in het Config Dashboard om direct te tonen wat live entertainment
            oplevert. De formule combineert conversiestijging per persona, nurturekosten en pakketinvestering.
          </p>
        </header>

        <div className="grid gap-spacing-xl md:grid-cols-[1fr,2fr]">
          <div className="space-y-spacing-lg rounded-3xl border border-neutral-light/10 bg-neutral-light/10 p-spacing-xl">
            <h3 className="text-font-size-h4 font-semibold">Jouw aannames</h3>
            <label className="flex flex-col gap-spacing-xs text-left">
              <span className="text-sm text-neutral-light/80">Aantal aanwezigen</span>
              <input
                type="number"
                min="25"
                step="5"
                value={input.attendees}
                onChange={(event) => handleInputChange('attendees', Number(event.target.value))}
                className="rounded-lg border border-neutral-light/20 bg-neutral-dark/50 px-spacing-md py-spacing-sm"
              />
            </label>
            <label className="flex flex-col gap-spacing-xs text-left">
              <span className="text-sm text-neutral-light/80">Conversie basis (als decimal)</span>
              <input
                type="number"
                min="0.01"
                max="0.6"
                step="0.01"
                value={input.conversionRate}
                onChange={(event) => handleInputChange('conversionRate', Number(event.target.value))}
                className="rounded-lg border border-neutral-light/20 bg-neutral-dark/50 px-spacing-md py-spacing-sm"
              />
            </label>
            <label className="flex flex-col gap-spacing-xs text-left">
              <span className="text-sm text-neutral-light/80">Gemiddelde dealwaarde (€)</span>
              <input
                type="number"
                min="500"
                step="100"
                value={input.averageDealValue}
                onChange={(event) => handleInputChange('averageDealValue', Number(event.target.value))}
                className="rounded-lg border border-neutral-light/20 bg-neutral-dark/50 px-spacing-md py-spacing-sm"
              />
            </label>
            <label className="flex flex-col gap-spacing-xs text-left">
              <span className="text-sm text-neutral-light/80">Nurture touchpoints</span>
              <input
                type="number"
                min="1"
                max="8"
                step="1"
                value={input.nurtureTouchpoints}
                onChange={(event) => handleInputChange('nurtureTouchpoints', Number(event.target.value))}
                className="rounded-lg border border-neutral-light/20 bg-neutral-dark/50 px-spacing-md py-spacing-sm"
              />
            </label>
            <label className="flex flex-col gap-spacing-xs text-left">
              <span className="text-sm text-neutral-light/80">Persona focus</span>
              <select
                value={input.persona}
                onChange={(event) => handleInputChange('persona', event.target.value)}
                className="rounded-lg border border-neutral-light/20 bg-neutral-dark/50 px-spacing-md py-spacing-sm"
              >
                {Object.entries(PERSONA_PRESETS).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
              </select>
            </label>
            <p className="text-xs text-neutral-light/60">
              Persona uplift: <strong>{Math.round(preset.uplift * 100)}%</strong> extra conversie, nurturekosten ca. €
              {preset.nurtureCost} p.p. per touchpoint.
            </p>
          </div>

          <div className="space-y-spacing-lg">
            {status.loading && (
              <div className="rounded-2xl border border-neutral-light/10 bg-neutral-dark/40 p-spacing-xl text-center text-sm text-neutral-light/70">
                ROI-data wordt geladen...
              </div>
            )}
            {status.error && (
              <div className="rounded-2xl border border-semantic-error bg-semantic-error/10 p-spacing-md text-sm text-semantic-error">
                {status.error}
              </div>
            )}
            <div className="grid gap-spacing-lg md:grid-cols-3">
              {outcomes.map((pkg) => (
                <article
                  key={pkg.id}
                  className={`rounded-2xl border p-spacing-lg shadow-lg transition hover:border-secondary ${
                    pkg.popular ? 'border-secondary bg-neutral-light/10' : 'border-neutral-light/10 bg-neutral-dark/30'
                  }`}
                >
                  <header className="space-y-spacing-xs">
                    <p className="text-xs uppercase tracking-wide text-neutral-light/60">{pkg.name}</p>
                    <h3 className="text-font-size-h3 font-bold">{formatCurrency(pkg.price)}</h3>
                    {pkg.popular && (
                      <span className="inline-flex rounded-full bg-secondary/20 px-spacing-sm py-[2px] text-xs font-semibold text-secondary">
                        Meest gekozen
                      </span>
                    )}
                  </header>
                  <dl className="mt-spacing-md space-y-spacing-sm text-sm">
                    <div className="flex items-center justify-between">
                      <dt className="text-neutral-light/70">Beïnvloede omzet</dt>
                      <dd className="font-semibold">{formatCurrency(pkg.influencedRevenue)}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-neutral-light/70">Totale investering</dt>
                      <dd>{formatCurrency(pkg.investment)}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-neutral-light/70">Break-even leads</dt>
                      <dd>{pkg.breakEvenLeads}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-neutral-light/70">Verwachte ROI</dt>
                      <dd className={`font-bold ${pkg.roi >= 0 ? 'text-semantic-success' : 'text-semantic-error'}`}>
                        {pkg.roi >= 0 ? '+' : ''}
                        {pkg.roi.toFixed(1)}%
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-spacing-md text-xs text-neutral-light/60">
                    Inclusief nurturebudget van €{preset.nurtureCost} per touchpoint en persona uplift van {Math.round(preset.uplift * 100)}%.
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoiCalculator;
