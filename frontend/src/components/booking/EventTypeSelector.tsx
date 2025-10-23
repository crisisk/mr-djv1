import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { pushEvent } from "../../lib/analytics/ga4";
import { useEventType } from "../../context/EventTypeContext";
import styles from "./EventTypeSelector.module.css";

export type EventTypeOption = {
  id: string;
  label: string;
  description: string;
  emoji: string;
};

const EVENT_TYPE_ORDER = ["bruiloft", "bedrijfsfeest", "verjaardag", "festival"] as const;

const EVENT_TYPE_EMOJI: Record<(typeof EVENT_TYPE_ORDER)[number], string> = {
  bruiloft: "💍",
  bedrijfsfeest: "🏢",
  verjaardag: "🎉",
  festival: "🎪",
};

type EventTypeCopy = {
  title: string;
  subtitle: string;
  selectedBadge?: string;
  options: Record<string, { label: string; description: string }>;
};

const TRACKING_LIST_ID = "event-type-selector";

export function EventTypeSelector() {
  const { t } = useTranslation();
  const { eventType, setEventType } = useEventType();
  const [pendingSelection, setPendingSelection] = useState<string | null>(null);

  const copy = t("eventTypes", { returnObjects: true }) as EventTypeCopy;

  const options = useMemo<EventTypeOption[]>(() => {
    const translations = copy?.options ?? {};

    return EVENT_TYPE_ORDER.map((id) => ({
      id,
      emoji: EVENT_TYPE_EMOJI[id],
      label: translations[id]?.label ?? id,
      description: translations[id]?.description ?? "",
    }));
  }, [copy.options]);

  const handleSelect = async (option: EventTypeOption) => {
    setPendingSelection(option.id);

    try {
      await setEventType(option.id);
      pushEvent({
        name: "select_item",
        params: {
          item_id: option.id,
          item_list_id: TRACKING_LIST_ID,
          item_name: option.label,
        },
      });
    } catch (error) {
      if (import.meta.env.MODE !== "production") {
        console.warn("Could not save event type", error);
      }
    } finally {
      setPendingSelection(null);
    }
  };

  return (
    <section className={styles.container} aria-labelledby="event-type-selector-heading">
      <div className={styles.header}>
        <h2 id="event-type-selector-heading" className={styles.title}>
          {copy?.title ?? "Kies je evenementtype"}
        </h2>
        <p className={styles.subtitle}>
          {copy?.subtitle ?? "Personaliseer de offerte. We stemmen de muziek en follow-up af op jouw event."}
        </p>
      </div>

      <div className={styles.grid}>
        {options.map((option) => {
          const isSelected = eventType === option.id;
          const isPending = pendingSelection === option.id;

          return (
            <button
              key={option.id}
              type="button"
              className={styles.card}
              data-selected={isSelected ? "true" : "false"}
              onClick={() => handleSelect(option)}
              aria-pressed={isSelected}
              disabled={isPending}
            >
              <span aria-hidden="true" className={styles.emoji}>
                {option.emoji}
              </span>
              <span className={styles.cardLabel}>{option.label}</span>
              <span className={styles.cardDescription}>{option.description}</span>
              {isSelected && (
                <span className={styles.selectedBadge}>
                  {copy?.selectedBadge ?? "Geselecteerd"}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default EventTypeSelector;
