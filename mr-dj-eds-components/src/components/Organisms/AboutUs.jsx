import React from 'react';

/**
 * AboutUs Component
 * "Over Ons" section with company story and mission
 */
const AboutUs = () => {
  return (
    <section className="py-spacing-3xl bg-neutral-light" id="over-ons">
      <div className="container mx-auto px-spacing-md max-w-5xl">
        <div className="text-center mb-spacing-2xl">
          <h2 className="text-font-size-h2 font-extrabold text-neutral-dark mb-spacing-md">
            Over Mr. DJ
          </h2>
          <p className="text-font-size-h4 text-primary font-medium">
            15+ Jaar Ervaring in Het Zuiden
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-spacing-2xl items-center">
          {/* Left: Story */}
          <div className="space-y-spacing-lg">
            <h3 className="text-font-size-h3 font-bold text-neutral-dark">
              Ons Verhaal
            </h3>
            <p className="text-font-size-body text-neutral-dark leading-relaxed">
              Sinds 2010 maken wij van elk feest een onvergetelijk evenement.
              Wat begon als een passie voor muziek en entertainment is uitgegroeid
              tot één van de meest vertrouwde DJ-services in Noord-Brabant en Limburg.
            </p>
            <p className="text-font-size-body text-neutral-dark leading-relaxed">
              Onze unieke combinatie van een professionele DJ en live saxofonist
              zorgt voor een elektrische sfeer die uw gasten nooit zullen vergeten.
              Met meer dan <strong>500 succesvolle evenementen</strong> en een
              gemiddelde waardering van <strong>4.9/5</strong> zijn wij dé partner
              voor uw bruiloft, bedrijfsfeest of privé-evenement.
            </p>
            <div className="flex gap-spacing-xl pt-spacing-md">
              <div className="text-center">
                <div className="text-font-size-h1 font-extrabold text-primary">15+</div>
                <div className="text-font-size-small text-neutral-dark">Jaar Ervaring</div>
              </div>
              <div className="text-center">
                <div className="text-font-size-h1 font-extrabold text-primary">500+</div>
                <div className="text-font-size-small text-neutral-dark">Succesvolle Events</div>
              </div>
              <div className="text-center">
                <div className="text-font-size-h1 font-extrabold text-primary">4.9</div>
                <div className="text-font-size-small text-neutral-dark">Gemiddelde Score</div>
              </div>
            </div>
          </div>

          {/* Right: Mission & Values */}
          <div className="space-y-spacing-lg bg-neutral-gray-100 p-spacing-xl rounded-lg shadow-lg">
            <h3 className="text-font-size-h3 font-bold text-neutral-dark">
              Onze Missie
            </h3>
            <p className="text-font-size-body text-neutral-dark leading-relaxed">
              Wij geloven dat muziek de kracht heeft om mensen samen te brengen
              en magische momenten te creëren. Onze missie is om uw visie tot
              leven te brengen met perfecte muziek, professionele uitvoering en
              persoonlijke aandacht.
            </p>

            <div className="space-y-spacing-md mt-spacing-lg">
              <h4 className="text-font-size-h4 font-bold text-primary">
                Wat Ons Onderscheidt
              </h4>
              <ul className="space-y-spacing-sm">
                <li className="flex items-start">
                  <svg className="w-6 h-6 mr-spacing-sm text-secondary flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-font-size-body text-neutral-dark">
                    <strong>Live Saxofonist</strong> - Unieke combinatie van DJ + live muziek
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 mr-spacing-sm text-secondary flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-font-size-body text-neutral-dark">
                    <strong>Persoonlijke Aanpak</strong> - Elk evenement is uniek
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 mr-spacing-sm text-secondary flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-font-size-body text-neutral-dark">
                    <strong>100% Dansgarantie</strong> - Volle dansvloer of geld terug
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 mr-spacing-sm text-secondary flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-font-size-body text-neutral-dark">
                    <strong>Professionele Apparatuur</strong> - Topkwaliteit geluid en licht
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-spacing-2xl">
          <p className="text-font-size-h4 text-neutral-dark mb-spacing-md">
            Klaar om uw feest onvergetelijk te maken?
          </p>
          <a
            href="tel:+31408422594"
            className="inline-block bg-primary text-neutral-light px-spacing-2xl py-spacing-lg rounded-lg text-font-size-h4 font-bold hover:bg-primary-600 transition shadow-lg"
          >
            Bel +31 (0) 40 842 2594
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
