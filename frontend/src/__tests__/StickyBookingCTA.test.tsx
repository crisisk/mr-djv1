import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import StickyBookingCTA from "../components/Generated/D3_1_20251016_060618";

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

describe("StickyBookingCTA", () => {
  beforeEach(() => {
    submitMock.mockReset();
    resetMock.mockReset();
  });

  it("shows booking form and renders success message after submit", async () => {
    submitMock.mockResolvedValueOnce({ success: true, message: "Bedankt voor je aanvraag!" });

    render(<StickyBookingCTA />);

    act(() => {
      Object.defineProperty(window, "scrollY", { value: 400, configurable: true });
      window.dispatchEvent(new Event("scroll"));
    });

    const openButton = await screen.findByRole("button", { name: /boek direct een dj/i });
    await userEvent.click(openButton);

    await userEvent.type(screen.getByLabelText(/naam/i), "Jane Doe");
    await userEvent.type(screen.getByLabelText(/e-mail/i), "jane@example.com");
    await userEvent.type(screen.getByLabelText(/telefoonnummer/i), "+31600000000");
    await userEvent.selectOptions(screen.getByLabelText(/type evenement/i), "bedrijfsfeest");

    await userEvent.click(screen.getByRole("button", { name: /verstuur aanvraag/i }));

    await waitFor(() => {
      expect(screen.getByText(/bedankt voor je aanvraag/i)).toBeInTheDocument();
    });

    expect(submitMock).toHaveBeenCalled();
  });
});
