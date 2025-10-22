import { render } from "@testing-library/react";
import { HeroSection } from "../HeroSection";

describe("HeroSection", () => {
  it("matches the default snapshot", () => {
    const { container } = render(
      <HeroSection
        title="Ervaar de ultieme avond"
        subtitle="Van ceremoniële momenten tot de laatste dans, wij verzorgen het muzikale hoogtepunt."
        ctaPrimaryText="Controleer beschikbaarheid"
        ctaSecondaryText="Vraag een offerte aan"
      >
        <p>Inclusief licht- en geluidspakket op maat.</p>
      </HeroSection>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
