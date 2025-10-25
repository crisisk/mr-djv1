import { useCallback, useMemo } from "react";
import type { PricingBreakdownItem, PricingSummary } from "../lib/bookingSessionStore";
import { useBookingSession } from "../lib/bookingSessionStore";

const DATE_FORMATTER =
  typeof Intl !== "undefined"
    ? new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "long", year: "numeric" })
    : null;

function formatDate(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  try {
    return DATE_FORMATTER ? DATE_FORMATTER.format(parsed) : parsed.toISOString().split("T")[0];
  } catch (_error) {
    return parsed.toISOString().split("T")[0];
  }
}

function formatCurrencyValue(amount: number, currency?: string | null): string {
  const resolvedCurrency =
    currency && typeof currency === "string" && currency.trim().length > 0 ? currency : "EUR";

  try {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: resolvedCurrency,
    }).format(amount);
  } catch (_error) {
    return `${amount.toFixed(2)} ${resolvedCurrency}`.trim();
  }
}

function summarisePricing(pricing: PricingSummary | null): string | null {
  if (!pricing) {
    return null;
  }

  if (pricing.formattedTotal && pricing.formattedTotal.trim().length > 0) {
    return pricing.formattedTotal.trim();
  }

  if (typeof pricing.total === "number") {
    return formatCurrencyValue(
      pricing.total,
      typeof pricing.currency === "string" ? pricing.currency : undefined,
    );
  }

  return null;
}

function formatBreakdownItem(
  item: PricingBreakdownItem,
  fallbackCurrency?: string | null,
): { label: string; value: string } | null {
  const rawLabel = typeof item.label === "string" ? item.label.trim() : "";
  const label = rawLabel.length > 0 ? rawLabel : "Kostenpost";

  if (item.formattedAmount && item.formattedAmount.trim().length > 0) {
    return { label, value: item.formattedAmount.trim() };
  }

  if (typeof item.amount === "number") {
    const derivedCurrency =
      typeof (item as Record<string, unknown>).currency === "string"
        ? ((item as Record<string, unknown>).currency as string)
        : fallbackCurrency;

    return { label, value: formatCurrencyValue(item.amount, derivedCurrency) };
  }

  return null;
}

const FALLBACK_TEXT = {
  date: "Nog geen datum gekozen",
  location: "Nog geen locatie gekozen",
  eventType: "Nog geen type evenement gekozen",
  package: "Geen pakket geselecteerd",
  pricing: "Nog geen prijsindicatie",
};

const BookingSummary = () => {
  const { selections, status, error, optimistic, refresh } = useBookingSession();

  const formattedDate = useMemo(() => formatDate(selections.date), [selections.date]);

  const packageLabel = useMemo(() => {
    if (!selections.package) {
      return null;
    }

    if (typeof selections.package.name === "string" && selections.package.name.trim().length > 0) {
      return selections.package.name.trim();
    }

    if (selections.package.id !== undefined && selections.package.id !== null) {
      return String(selections.package.id);
    }

    return null;
  }, [selections.package]);

  const priceLabel = useMemo(() => summarisePricing(selections.pricing), [selections.pricing]);

  const breakdownItems = useMemo(() => {
    if (!selections.pricing?.breakdown || selections.pricing.breakdown.length === 0) {
      return [];
    }

    const fallbackCurrency =
      typeof selections.pricing.currency === "string" ? selections.pricing.currency : null;

    return selections.pricing.breakdown
      .map((item) => formatBreakdownItem(item, fallbackCurrency))
      .filter((item): item is { label: string; value: string } => Boolean(item));
  }, [selections.pricing]);

  const handleRetry = useCallback(() => {
    refresh().catch(() => undefined);
  }, [refresh]);

  const showLoadingMessage = status === "loading";
  const showOptimisticMessage = optimistic && status !== "loading";
  const showErrorMessage = status === "error" && Boolean(error);
  const isRetryDisabled = status === "loading";

  const summaryItems = [
    { label: "Datum", value: formattedDate ?? FALLBACK_TEXT.date },
    { label: "Locatie", value: selections.location ?? FALLBACK_TEXT.location },
    { label: "Type evenement", value: selections.eventType ?? FALLBACK_TEXT.eventType },
    { label: "Pakket", value: packageLabel ?? FALLBACK_TEXT.package },
    { label: "Prijsindicatie", value: priceLabel ?? FALLBACK_TEXT.pricing },
  ];

  return (
    <section className="booking-summary" aria-live="polite">
      <div className="booking-summary__header">
        <h3 className="booking-summary__title">Boekingsoverzicht</h3>
        {showOptimisticMessage && (
          <span className="booking-summary__badge" role="status">
            Wijzigingen worden opgeslagen…
          </span>
        )}
      </div>

      {showLoadingMessage && (
        <p className="booking-summary__status" role="status">
          We laden je huidige keuzes…
        </p>
      )}

      {showErrorMessage && (
        <div className="booking-summary__alert" role="alert">
          <p>We konden je keuzes niet opslaan. {error}</p>
          <button type="button" onClick={handleRetry} disabled={isRetryDisabled}>
            Probeer opnieuw
          </button>
        </div>
      )}

      <dl className="booking-summary__list">
        {summaryItems.map((item) => (
          <div className="booking-summary__item" key={item.label}>
            <dt className="booking-summary__label">{item.label}</dt>
            <dd className="booking-summary__value">{item.value}</dd>
          </div>
        ))}
      </dl>

      {breakdownItems.length > 0 && (
        <div className="booking-summary__breakdown">
          <h4>Prijsdetails</h4>
          <ul>
            {breakdownItems.map((item) => (
              <li key={`${item.label}-${item.value}`}>
                <span>{item.label}</span>
                <span>{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default BookingSummary;
