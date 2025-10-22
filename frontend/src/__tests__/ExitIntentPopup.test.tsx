import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ExitIntentPopup from "../components/Generated/MKT4_1_20251016_062601";

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

describe("ExitIntentPopup", () => {
  beforeEach(() => {
    localStorage.clear();
    submitMock.mockReset();
    resetMock.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("submits booking and closes popup after success", async () => {
    submitMock.mockResolvedValueOnce({ success: true, message: "Top!" });

    vi.useFakeTimers();

    render(<ExitIntentPopup />);

    act(() => {
      const event = new MouseEvent("mouseleave", { clientY: 0, bubbles: true });
      document.dispatchEvent(event);
    });

    await waitFor(() => {
      expect(screen.getByText(/special offer/i)).toBeInTheDocument();
    });

    await userEvent.type(screen.getByLabelText(/naam/i), "Lead User");
    await userEvent.type(screen.getByLabelText(/e-mail/i), "lead@example.com");
    await userEvent.type(screen.getByLabelText(/telefoonnummer/i), "+31699999999");
    await userEvent.selectOptions(screen.getByLabelText(/type evenement/i), "feest");

    await userEvent.click(screen.getByRole("button", { name: /verstuur aanvraag/i }));

    await waitFor(() => {
      expect(screen.getByText(/top!/i)).toBeInTheDocument();
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(screen.queryByText(/special offer/i)).not.toBeInTheDocument();
    });
  });
});
