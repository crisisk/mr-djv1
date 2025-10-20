import React from 'react';
import IconBase from '../ui/icon-base';

/**
 * AboutUs Component
 * "Over Ons" section with company story and mission
 */
const AboutUs = () => {
  return (
    <section className="py-16 bg-white" id="over-ons">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-[#1A2C4B] mb-4">
            Over Mr. DJ
          </h2>
          <p className="text-font-size-h4 text-primary font-medium">
            15+ Jaar Ervaring in Het Zuiden
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Story */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[#1A2C4B]">
              Ons Verhaal
            </h3>
            <p className="text-base text-[#1A2C4B] leading-relaxed">
              Sinds 2010 maken wij van elk feest een onvergetelijk evenement.
              Wat begon als een passie voor muziek en entertainment is uitgegroeid
              tot één van de meest vertrouwde DJ-services in Noord-Brabant en Limburg.
            </p>
            <p className="text-base text-[#1A2C4B] leading-relaxed">
              Onze unieke combinatie van een professionele DJ en live saxofonist
              zorgt voor een elektrische sfeer die uw gasten nooit zullen vergeten.
              Met meer dan <strong>2500 geslaagde feesten</strong> verzorgd en een
              gemiddelde waardering van <strong>4.9/5</strong> zijn wij dé partner
              voor uw bruiloft, bedrijfsfeest of privé-evenement.
            </p>
            <p className="text-base text-[#1A2C4B] leading-relaxed">
              Of het nu gaat om een intieme bruiloft voor 50 gasten of een spetterende
              zakelijke gala voor 500 personen, wij zorgen altijd voor de perfecte
              muzikale ondersteuning. Onze ervaring met diverse locaties in het zuiden
              en ons uitgebreide repertoire garanderen een feest waar iedereen over
              napraat.
            </p>
            <div className="flex gap-8 pt-4">
              <div className="text-center">
                <div className="text-5xl font-extrabold text-primary">15+</div>
                <div className="text-sm text-[#1A2C4B]">Jaar Ervaring</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-extrabold text-primary">2500+</div>
                <div className="text-sm text-[#1A2C4B]">Geslaagde Feesten</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-extrabold text-primary">4.9</div>
                <div className="text-sm text-[#1A2C4B]">Gemiddelde Score</div>
              </div>
            </div>
          </div>

          {/* Right: Mission & Values */}
          <div className="space-y-6 bg-gray-100 p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-[#1A2C4B]">
              Onze Missie
            </h3>
            <p className="text-base text-[#1A2C4B] leading-relaxed">
              Wij geloven dat muziek de kracht heeft om mensen samen te brengen
              en magische momenten te creëren. Onze missie is om uw visie tot
              leven te brengen met perfecte muziek, professionele uitvoering en
              persoonlijke aandacht.
            </p>

            <div className="space-y-4 mt-6">
              <h4 className="text-font-size-h4 font-bold text-primary">
                Wat Ons Onderscheidt
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <IconBase className="h-6 w-6 mr-2 text-secondary flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </IconBase>
                  <span className="text-base text-[#1A2C4B]">
                    <strong>Live Saxofonist</strong> - Unieke combinatie van DJ + live muziek
                  </span>
                </li>
                <li className="flex items-start">
                  <IconBase className="h-6 w-6 mr-2 text-secondary flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </IconBase>
                  <span className="text-base text-[#1A2C4B]">
                    <strong>Persoonlijke Aanpak</strong> - Elk evenement is uniek
                  </span>
                </li>
                <li className="flex items-start">
                  <IconBase className="h-6 w-6 mr-2 text-secondary flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </IconBase>
                  <span className="text-base text-[#1A2C4B]">
                    <strong>100% Dansgarantie</strong> - Volle dansvloer of geld terug
                  </span>
                </li>
                <li className="flex items-start">
                  <IconBase className="h-6 w-6 mr-2 text-secondary flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </IconBase>
                  <span className="text-base text-[#1A2C4B]">
                    <strong>Professionele Apparatuur</strong> - Topkwaliteit geluid en licht
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-font-size-h4 text-[#1A2C4B] mb-4">
            Klaar om uw feest onvergetelijk te maken?
          </p>
          <a
            href="tel:+31408422594"
            className="inline-block bg-primary text-white px-12 py-6 rounded-lg text-font-size-h4 font-bold hover:bg-primary-600 transition shadow-lg"
          >
            Bel +31 (0) 40 842 2594
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
