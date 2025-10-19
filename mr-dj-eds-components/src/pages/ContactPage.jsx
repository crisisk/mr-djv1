import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '../components/Molecules/Header.jsx';
import Footer from '../components/Organisms/Footer.jsx';
import HeroSection from '../components/Organisms/HeroSection.jsx';
import ContactForm from '../components/Organisms/ContactForm.jsx';

const ContactPage = () => {
  return (
    <div className="ContactPage">
      <Helmet>
        <title>Contact | Mr. DJ | Vraag Direct Een Offerte Aan</title>
        <meta
          name="description"
          content="Neem contact op met Mr. DJ voor een vrijblijvende offerte. Telefonisch, via WhatsApp of het contactformulier. Reactie binnen 24 uur!"
        />
      </Helmet>

      <Header />

      <HeroSection
        title="Neem Contact Met Ons Op"
        subtitle="Vraag een vrijblijvende offerte aan of stel je vraag"
        ctaPrimaryText="Bel Direct"
        backgroundClass="bg-gradient-to-r from-[#00AEEF] to-[#1A2C4B]"
      />

      {/* Contact Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Phone */}
              <div className="text-center">
                <div className="bg-[#00AEEF] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">
                  📞
                </div>
                <h3 className="text-xl font-bold text-[#1A2C4B] mb-2">Telefoon</h3>
                <a href="tel:+31408422594" className="text-[#00AEEF] hover:underline text-lg">
                  +31 (0) 40 8422594
                </a>
                <p className="text-gray-600 text-sm mt-2">
                  Ma-Vr: 09:00 - 21:00<br />
                  Za-Zo: 10:00 - 18:00
                </p>
              </div>

              {/* WhatsApp */}
              <div className="text-center">
                <div className="bg-[#25D366] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">
                  💬
                </div>
                <h3 className="text-xl font-bold text-[#1A2C4B] mb-2">WhatsApp</h3>
                <a href="https://wa.me/31408422594" className="text-[#25D366] hover:underline text-lg" target="_blank" rel="noopener noreferrer">
                  +31 (0) 40 8422594
                </a>
                <p className="text-gray-600 text-sm mt-2">
                  Chat direct met ons!<br />
                  Snelle reactie
                </p>
              </div>

              {/* Email */}
              <div className="text-center">
                <div className="bg-[#1A2C4B] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">
                  ✉️
                </div>
                <h3 className="text-xl font-bold text-[#1A2C4B] mb-2">Email</h3>
                <a href="mailto:info@rentguy.nl" className="text-[#00AEEF] hover:underline text-lg">
                  info@rentguy.nl
                </a>
                <p className="text-gray-600 text-sm mt-2">
                  Reactie binnen 24 uur<br />
                  Op werkdagen
                </p>
              </div>
            </div>

            {/* Quick Facts */}
            <div className="bg-gray-50 p-8 rounded-lg text-center mb-12">
              <h3 className="text-2xl font-bold text-[#1A2C4B] mb-6">
                Wat Je Kunt Verwachten
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl mb-2">⚡</div>
                  <p className="font-bold text-[#1A2C4B]">Snelle Reactie</p>
                  <p className="text-gray-600 text-sm">Binnen 24 uur antwoord</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">💡</div>
                  <p className="font-bold text-[#1A2C4B]">Vrijblijvend</p>
                  <p className="text-gray-600 text-sm">Geen verplichtingen</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">🎯</div>
                  <p className="font-bold text-[#1A2C4B]">Op Maat</p>
                  <p className="text-gray-600 text-sm">Persoonlijk advies</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-[#1A2C4B] mb-4">
                Vraag Een Offerte Aan
              </h2>
              <p className="text-gray-700 text-lg">
                Vul het formulier in en we nemen zo snel mogelijk contact met je op om alles te bespreken.
                Meestal binnen een paar uur!
              </p>
            </div>
            <ContactForm variant="A" />
          </div>
        </div>
      </section>

      {/* Location Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#1A2C4B] mb-8 text-center">
              Werkgebied
            </h2>
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-[#1A2C4B] mb-4">📍 Regio</h3>
                  <p className="text-gray-700 mb-4">
                    Wij zijn gevestigd in Eindhoven en opereren door heel Nederland. Ons hoofdwerkgebied is
                    Noord-Brabant en Limburg.
                  </p>
                  <p className="text-gray-700">
                    <strong>Populaire steden:</strong><br />
                    Eindhoven, Tilburg, Breda, 's-Hertogenbosch, Helmond, Maastricht, Venlo, Roermond, Bergen op Zoom, Oss, Veghel
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#1A2C4B] mb-4">🚗 Reiskosten</h3>
                  <p className="text-gray-700 mb-4">
                    <strong>Tot 50km:</strong> Gratis<br />
                    <strong>51-100km:</strong> €0,45/km extra<br />
                    <strong>100km+:</strong> Offerte op maat
                  </p>
                  <p className="text-gray-700">
                    Voor locaties buiten Noord-Brabant en Limburg berekenen we reiskosten transparant.
                    Dit bespreken we altijd vooraf in de offerte.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-[#1A2C4B] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">
            Wat Klanten Zeggen
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <div className="text-[#D4AF37] text-2xl mb-3">★★★★★</div>
              <p className="italic mb-4">
                "Snelle reactie, duidelijke communicatie en een fantastisch feest! Aanrader!"
              </p>
              <p className="font-bold">- Sarah & Mike</p>
            </div>

            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <div className="text-[#D4AF37] text-2xl mb-3">★★★★★</div>
              <p className="italic mb-4">
                "Heel toegankelijk en flexibel. Dachten goed mee en maakten ons bedrijfsfeest geslaagd!"
              </p>
              <p className="font-bold">- VDL Groep</p>
            </div>

            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <div className="text-[#D4AF37] text-2xl mb-3">★★★★★</div>
              <p className="italic mb-4">
                "Professioneel, betrouwbaar en geweldige muziek. Exact wat we zochten!"
              </p>
              <p className="font-bold">- Linda & Tom</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
