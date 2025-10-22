import { apiFetch } from "../lib/apiClient";

export type BookingRequest = {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate?: string;
  message?: string;
  packageId?: string;
};

export type BookingResponse = {
  success: boolean;
  message?: string;
  bookingId?: string;
  status?: string;
  persisted?: boolean;
  rentGuySync?: Record<string, unknown>;
  eventType?: string | null;
  requestedPackage?: string | null;
};

export async function createBooking(payload: BookingRequest): Promise<BookingResponse> {
  return apiFetch<BookingResponse>("/bookings", {
    method: "POST",
    body: payload,
  });
}
