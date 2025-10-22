import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import WhatsAppChat from "../components/Generated/D3_2_20251016_060656";

const trackContactChannelClickMock = vi.fn();

vi.mock("../config/contact", () => ({
  __esModule: true,
  CONTACT_PHONE_NUMBER: "+31-40-8422594",
  CONTACT_PHONE_NUMBER_WHATSAPP: "31408422594",
  CONTACT_WHATSAPP_MESSAGE: "Hi! Ik wil een DJ boeken.",
  HAS_WHATSAPP_NUMBER: true,
}));

vi.mock("../lib/analytics/events", () => ({
  __esModule: true,
  trackContactChannelClick: trackContactChannelClickMock,
}));

describe("WhatsAppChat", () => {
  beforeEach(() => {
    trackContactChannelClickMock.mockReset();
  });

  it("renders WhatsApp button and tracks click", async () => {
    render(<WhatsAppChat />);

    const button = screen.getByRole("link", { name: /whatsapp/i });
    expect(button).toHaveAttribute(
      "href",
      "https://wa.me/31408422594?text=Hi!%20Ik%20wil%20een%20DJ%20boeken.",
    );

    await userEvent.click(button);

    expect(trackContactChannelClickMock).toHaveBeenCalledWith({
      channel: "whatsapp",
      origin: "floating-action",
      phoneNumber: "+31-40-8422594",
    });
  });
});
