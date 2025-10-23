import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import QuickBookingForm from "../components/booking/QuickBookingForm";

const setEventTypeMock = vi.hoisted(() => vi.fn());
const useOptionalEventTypeMock = vi.hoisted(() => vi.fn());

const submitMock = vi.fn();
const resetMock = vi.fn();

vi.mock("../hooks/useBooking", () => ({
  __esModule: true,
  default: () => ({
    submit: submitMock,
    status: "idle",
    error: null,
    reset: resetMock,
  }),
}));

vi.mock("../context/EventTypeContext", () => ({
  __esModule: true,
  useOptionalEventType: (...args: unknown[]) => useOptionalEventTypeMock(...args),
}));

describe("QuickBookingForm", () => {
  beforeEach(() => {
    submitMock.mockReset();
    resetMock.mockReset();
    setEventTypeMock.mockReset();
    useOptionalEventTypeMock.mockReset();
    useOptionalEventTypeMock.mockImplementation(() => ({
      eventType: "",
      setEventType: setEventTypeMock,
    }));
  });

  it("submits booking data and calls onSuccess callback", async () => {
    submitMock.mockResolvedValueOnce({ success: true, message: "Dank je!" });
    const onSuccess = vi.fn();

    render(<QuickBookingForm origin="test" onSuccess={onSuccess} />);

    await userEvent.type(screen.getByLabelText(/naam/i), "John Doe");
    await userEvent.type(screen.getByLabelText(/e-mail/i), "john@example.com");
    await userEvent.type(screen.getByLabelText(/telefoonnummer/i), "+31612345678");
    await userEvent.selectOptions(screen.getByLabelText(/type evenement/i), "bruiloft");
    await userEvent.type(screen.getByLabelText(/voorkeursbericht/i), "Test event");

    const [submitButton] = screen.getAllByRole("button", { name: /verstuur aanvraag/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(submitMock).toHaveBeenCalledTimes(1);
    });

    expect(submitMock).toHaveBeenCalledWith({
      origin: "test",
      name: "John Doe",
      email: "john@example.com",
      phone: "+31612345678",
      eventType: "bruiloft",
      eventDate: undefined,
      message: "Test event",
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith({ success: true, message: "Dank je!" });
    });
  });

  it("shows validation error when required fields are missing", async () => {
    render(<QuickBookingForm origin="test" />);

    const [submitButton] = screen.getAllByRole("button", { name: /verstuur aanvraag/i });
    await userEvent.click(submitButton);

    expect(
      await screen.findByText(/Vul alle verplichte velden in om je aanvraag te versturen./i),
    ).toBeInTheDocument();
  });

  it("synchronises event type changes with the personalization context", async () => {
    render(<QuickBookingForm origin="test" />);

    const [eventTypeSelect] = screen.getAllByLabelText(/type evenement/i);
    await userEvent.selectOptions(eventTypeSelect, "bedrijfsfeest");

    await waitFor(() => {
      expect(setEventTypeMock).toHaveBeenCalledWith("bedrijfsfeest");
    });
  });

  it("falls back to local state when the personalization context is unavailable", async () => {
    useOptionalEventTypeMock.mockImplementation(() => undefined);

    render(<QuickBookingForm origin="test" />);

    expect(useOptionalEventTypeMock).toHaveBeenCalled();
    expect(useOptionalEventTypeMock.mock.results.every((result) => result.value === undefined)).toBe(
      true,
    );

    const selects = screen.getAllByLabelText(/type evenement/i);
    const eventTypeSelect = selects.at(-1)!;
    await userEvent.selectOptions(eventTypeSelect, "anders");
    await waitFor(() => {
      expect(eventTypeSelect).toHaveValue("anders");
    });
  });
});
