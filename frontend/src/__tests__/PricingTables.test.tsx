/// <reference types="vitest" />
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PricingTables from "../../../PricingTables.jsx";

describe("PricingTables", () => {
  it("renders event-based pricing by default", () => {
    const { asFragment } = render(<PricingTables />);

    expect(screen.getAllByText("€495")[0]).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /per event/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("toggles to monthly pricing", async () => {
    const user = userEvent.setup();
    const { asFragment } = render(<PricingTables />);

    await user.click(screen.getByRole("button", { name: /per maand/i }));

    expect(screen.getAllByText("€99")[0]).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /per maand/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("injects local highlights when a city slug is provided", () => {
    render(<PricingTables citySlug="eindhoven" />);

    const bronzeHighlight = screen.getByTestId("pricing-local-highlight-brons");
    const silverHighlight = screen.getByTestId("pricing-local-highlight-zilver");

    expect(bronzeHighlight).toHaveTextContent(/Evoluon/i);
    expect(silverHighlight).toHaveTextContent(/Eindhoven/i);
  });
});
