'use client';

import React, { useState } from 'react';
import HeroSection from '../../components/organisms/HeroSection';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    message: '',
    newsletter: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log('Form submitted:', formData);
    alert('Bedankt voor je bericht! We nemen binnen 24 uur contact met je op.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        eyebrow="Contact"
        title="Neem Vrijblijvend Contact Op"
        subtitle="Bel, mail of vul het contactformulier in - we helpen je graag verder"
        ctaPrimaryText="Scroll naar formulier"
        ctaSecondaryText="Bel Direct"
        ctaPrimaryHref="#form"
        ctaSecondaryHref="tel:0408422594"
        backgroundClass="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
        titleColor="text-gray-900"
        subtitleColor="text-gray-700"
        badges={['24u Reactietijd', 'Vrijblijvend', 'WhatsApp OK']}
        socialProof="📞 Bereikbaar via telefoon, mail en WhatsApp"
      />

      {/* Contact Methods */}
      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kom Direct In Contact
            </h2>
            <p className="text-lg text-gray-600">
              Kies de manier die jou het beste uitkomt
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            <Card className="text-center p-spacing-lg hover:shadow-xl transition-shadow">
              <div className="text-6xl mb-4">📞</div>
              <h3 className="font-display text-xl font-semibold mb-3">Bel Ons</h3>
              <p className="text-gray-600 mb-4">Ma-Za: 10:00 - 21:00</p>
              <a
                href="tel:0408422594"
                className="text-xl font-bold text-brand-600 hover:text-brand-700"
              >
                040-8422594
              </a>
            </Card>

            <Card className="text-center p-spacing-lg hover:shadow-xl transition-shadow">
              <div className="text-6xl mb-4">📧</div>
              <h3 className="font-display text-xl font-semibold mb-3">Mail Ons</h3>
              <p className="text-gray-600 mb-4">Reactie binnen 24 uur</p>
              <a
                href="mailto:info@misterdj.nl"
                className="text-xl font-bold text-brand-600 hover:text-brand-700 break-all"
              >
                info@misterdj.nl
              </a>
            </Card>

            <Card className="text-center p-spacing-lg hover:shadow-xl transition-shadow">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="font-display text-xl font-semibold mb-3">WhatsApp</h3>
              <p className="text-gray-600 mb-4">Direct contact via app</p>
              <a
                href="https://wa.me/31620383638?text=Hallo%20Mister%20DJ%2C%20ik%20wil%20graag%20informatie%20over%20jullie%20DJ%20services"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-bold text-brand-600 hover:text-brand-700"
              >
                Start WhatsApp Chat
              </a>
              <p className="text-sm text-gray-500 mt-2">
                +31 6 20 38 36 38
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="form" className="py-spacing-3xl px-spacing-xl bg-gray-50">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Vraag Een Offerte Aan
            </h2>
            <p className="text-lg text-gray-600">
              Vul onderstaand formulier in en we nemen binnen 24 uur contact met je op
            </p>
          </div>

          <Card className="p-spacing-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Naam *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all"
                  placeholder="Jouw volledige naam"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  E-mailadres *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all"
                  placeholder="jij@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Telefoonnummer
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all"
                  placeholder="+31 6 12345678"
                />
              </div>

              {/* Event Type */}
              <div>
                <label htmlFor="eventType" className="block text-sm font-semibold text-gray-700 mb-2">
                  Type evenement *
                </label>
                <select
                  id="eventType"
                  name="eventType"
                  required
                  value={formData.eventType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all"
                >
                  <option value="">Kies een optie</option>
                  <option value="bruiloft">Bruiloft</option>
                  <option value="feest">Feest/Verjaardag</option>
                  <option value="bedrijfsfeest">Bedrijfsfeest</option>
                  <option value="jubileum">Jubileum</option>
                  <option value="drive-in">Drive-in Show</option>
                  <option value="anders">Anders</option>
                </select>
              </div>

              {/* Event Date */}
              <div>
                <label htmlFor="eventDate" className="block text-sm font-semibold text-gray-700 mb-2">
                  Datum evenement *
                </label>
                <input
                  type="date"
                  id="eventDate"
                  name="eventDate"
                  required
                  value={formData.eventDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Bericht
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all"
                  placeholder="Vertel ons meer over jouw event: locatie, aantal gasten, specifieke wensen, etc."
                ></textarea>
              </div>

              {/* Newsletter */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="newsletter"
                  name="newsletter"
                  checked={formData.newsletter}
                  onChange={handleChange}
                  className="h-4 w-4 mt-1 text-brand-600 focus:ring-brand-600 border-gray-300 rounded"
                />
                <label htmlFor="newsletter" className="ml-3 block text-sm text-gray-700">
                  Ja, ik wil de nieuwsbrief ontvangen met tips, inspiratie en aanbiedingen (optioneel)
                </label>
              </div>

              {/* Submit Button */}
              <Button type="submit" size="lg" className="w-full">
                Verstuur aanvraag
              </Button>

              {/* Response Time */}
              <div className="text-center pt-4">
                <p className="text-sm text-gray-600">
                  ⚡ We reageren binnen 24 uur op alle aanvragen
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Door dit formulier te versturen ga je akkoord met onze privacyverklaring
                </p>
              </div>
            </form>
          </Card>
        </div>
      </section>

      {/* Contact Info & Location */}
      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Bezoek Ons
            </h2>
            <p className="text-lg text-gray-600">
              Op afspraak kun je langskomen in onze studio
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Contact Details */}
            <Card className="p-spacing-xl">
              <h3 className="font-display text-2xl font-semibold mb-6">Contact Informatie</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">📍</div>
                  <div>
                    <h4 className="font-semibold mb-1">Adres</h4>
                    <p className="text-gray-600">
                      Mister DJ Entertainment<br />
                      Voorbeeldstraat 123<br />
                      5600 AB Eindhoven
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-3xl">📞</div>
                  <div>
                    <h4 className="font-semibold mb-1">Telefoon</h4>
                    <a href="tel:0408422594" className="text-brand-600 hover:text-brand-700">
                      040-8422594
                    </a>
                    <p className="text-sm text-gray-600">Ma-Za: 10:00 - 21:00</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-3xl">📧</div>
                  <div>
                    <h4 className="font-semibold mb-1">E-mail</h4>
                    <a href="mailto:info@misterdj.nl" className="text-brand-600 hover:text-brand-700">
                      info@misterdj.nl
                    </a>
                    <p className="text-sm text-gray-600">Reactie binnen 24 uur</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-3xl">💬</div>
                  <div>
                    <h4 className="font-semibold mb-1">WhatsApp</h4>
                    <a
                      href="https://wa.me/31620383638?text=Hallo%20Mister%20DJ%2C%20ik%20wil%20graag%20informatie"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 hover:text-brand-700"
                    >
                      +31 6 20 38 36 38
                    </a>
                    <p className="text-sm text-gray-600">Direct antwoord op je vragen</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Opening Hours & Notes */}
            <Card className="p-spacing-xl">
              <h3 className="font-display text-2xl font-semibold mb-6">Praktische Info</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <span className="text-2xl">🕐</span>
                    Openingstijden
                  </h4>
                  <div className="space-y-2 text-gray-700 ml-8">
                    <div className="flex justify-between">
                      <span>Maandag - Vrijdag:</span>
                      <span className="font-medium">10:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Zaterdag:</span>
                      <span className="font-medium">10:00 - 16:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Zondag:</span>
                      <span className="font-medium">Op afspraak</span>
                    </div>
                    <p className="text-sm text-gray-600 pt-2">
                      Telefonisch en via WhatsApp zijn we tot 21:00 bereikbaar
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <span className="text-2xl">📅</span>
                    Afspraak Maken
                  </h4>
                  <p className="text-gray-700 ml-8">
                    Wil je langskomen om de apparatuur te zien of persoonlijk kennis te maken?
                    Maak dan een afspraak via telefoon of WhatsApp. We reserveren graag tijd
                    voor een goed gesprek!
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <span className="text-2xl">⚡</span>
                    Snelle Respons
                  </h4>
                  <p className="text-gray-700 ml-8">
                    We streven ernaar binnen 24 uur te reageren op alle aanvragen. Maar vaak
                    hoor je al veel eerder van ons! Spoed? Bel of WhatsApp ons direct.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Response Promise */}
      <section className="py-spacing-3xl px-spacing-xl bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-spacing-xl text-center">
            <div className="text-6xl mb-6">🚀</div>
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
              Onze Service Belofte
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div>
                <div className="text-2xl font-bold text-brand-600 mb-2">24 uur</div>
                <p className="text-gray-600">Reactie op alle aanvragen</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-brand-600 mb-2">100%</div>
                <p className="text-gray-600">Vrijblijvend advies</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-brand-600 mb-2">15+ jaar</div>
                <p className="text-gray-600">Ervaring en expertise</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-spacing-3xl px-spacing-xl bg-brand-gradient text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Liever Direct Contact?
          </h2>
          <p className="text-xl mb-8 opacity-95">
            Bel of WhatsApp ons voor een persoonlijk gesprek
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-brand-600 hover:bg-gray-50"
              onClick={() => window.location.href = 'tel:0408422594'}
            >
              📞 Bel: 040-8422594
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="border-2 border-white text-white hover:bg-white/10"
              onClick={() => window.open('https://wa.me/31620383638?text=Hallo%20Mister%20DJ%2C%20ik%20wil%20graag%20direct%20contact', '_blank')}
            >
              💬 WhatsApp: +31 6 20 38 36 38
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
