import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type PropsWithChildren,
} from "react";

import { useBookingSession } from "../lib/bookingSessionStore";

export type EventTypeValue = {
  eventType: string | null;
  setEventType: (value: string | null) => Promise<void>;
};

const EventTypeContext = createContext<EventTypeValue | undefined>(undefined);

const normaliseEventType = (value: string | null): string | null => {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export function EventTypeProvider({ children }: PropsWithChildren) {
  const { selections, updateSelections } = useBookingSession();

  const setEventType = useCallback(
    async (value: string | null) => {
      const normalised = normaliseEventType(value);
      await updateSelections({ eventType: normalised });
    },
    [updateSelections],
  );

  const value = useMemo<EventTypeValue>(
    () => ({
      eventType: normaliseEventType(selections.eventType),
      setEventType,
    }),
    [selections.eventType, setEventType],
  );

  return <EventTypeContext.Provider value={value}>{children}</EventTypeContext.Provider>;
}

export function useEventType() {
  const context = useContext(EventTypeContext);

  if (!context) {
    throw new Error("useEventType must be used within an EventTypeProvider");
  }

  return context;
}
