import { useCallback, useState } from "react";

import type { BookingRequest, BookingResponse } from "../services/booking";
import { createBooking } from "../services/booking";
import type { ContactRequest } from "../services/contact";
import { submitContactLead } from "../services/contact";
import type { BookingTrackingPayload } from "../lib/analytics/events";
import { trackBookingLead } from "../lib/analytics/events";
import type { ApiClientError } from "../lib/apiClient";

type BookingStatus = "idle" | "loading" | "success" | "error";

export type BookingSubmission = BookingRequest & {
  origin: string;
  notifyContact?: boolean;
};

export type UseBookingResult = {
  submit: (payload: BookingSubmission) => Promise<BookingResponse>;
  status: BookingStatus;
  error: string | null;
  reset: () => void;
};

const deriveErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object") {
    const apiError = error as Partial<ApiClientError>;
    if (apiError.data && typeof apiError.data === "object") {
      const data = apiError.data as Record<string, unknown>;
      if (typeof data.error === "string" && data.error.trim().length > 0) {
        return data.error;
      }
      if (Array.isArray(data.details) && data.details.length > 0) {
        const first = data.details[0] as { message?: string };
        if (first?.message) {
          return first.message;
        }
      }
    }

    if (typeof apiError.message === "string" && apiError.message.trim().length > 0) {
      return apiError.message;
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return "Er ging iets mis bij het versturen van je boeking. Probeer het later opnieuw.";
};

const toContactPayload = (payload: BookingSubmission): ContactRequest => ({
  name: payload.name,
  email: payload.email,
  phone: payload.phone,
  eventType: payload.eventType,
  eventDate: payload.eventDate,
  packageId: payload.packageId,
  message: payload.message,
});

const toTrackingPayload = (
  origin: string,
  response: BookingResponse,
  request: BookingSubmission,
): BookingTrackingPayload => ({
  origin,
  bookingId: response.bookingId ?? null,
  eventType: response.eventType ?? request.eventType ?? null,
  packageId: response.requestedPackage ?? request.packageId ?? null,
  status: response.status ?? null,
});

export function useBooking(): UseBookingResult {
  const [status, setStatus] = useState<BookingStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStatus("idle");
    setErrorMessage(null);
  }, []);

  const submit = useCallback(async (payload: BookingSubmission) => {
    setStatus("loading");
    setErrorMessage(null);

    try {
      const { origin, notifyContact = true, ...request } = payload;
      const booking = await createBooking(request);

      if (notifyContact) {
        submitContactLead(toContactPayload(payload)).catch((error) => {
          console.warn("Failed to sync booking payload with contact service", error);
        });
      }

      trackBookingLead(toTrackingPayload(origin, booking, payload));

      setStatus("success");
      return booking;
    } catch (error) {
      const message = deriveErrorMessage(error);
      setErrorMessage(message);
      setStatus("error");
      throw Object.assign(new Error(message), { cause: error });
    }
  }, []);

  return {
    submit,
    status,
    error: errorMessage,
    reset,
  };
}

export default useBooking;
