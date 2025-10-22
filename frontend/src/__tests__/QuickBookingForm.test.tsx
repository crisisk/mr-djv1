import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import QuickBookingForm from "../components/booking/QuickBookingForm";

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

describe("QuickBookingForm", () => {
  beforeEach(() => {
    submitMock.mockReset();
    resetMock.mockReset();
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

    await userEvent.click(screen.getByRole("button", { name: /verstuur aanvraag/i }));

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

    await userEvent.click(screen.getByRole("button", { name: /verstuur aanvraag/i }));

    expect(
      await screen.findByText(/Vul alle verplichte velden in om je aanvraag te versturen./i),
    ).toBeInTheDocument();
  });
});
