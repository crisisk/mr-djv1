import React from 'react';
import SlideLayout from '../common/SlideLayout.jsx';
import { Input } from '../ui/input.jsx';
import { Textarea } from '../ui/textarea.jsx';
import { Button } from '../ui/button.jsx';
import { Label } from '../ui/label.jsx';
import { MapPin, Phone, Send, Watch } from 'lucide-react';

const contactChannels = [
  { icon: Phone, label: 'Direct bellen', value: '+31 40 123 45 67', description: 'Telefonisch bereikbaar van 09:00 - 21:00.' },
  { icon: Send, label: 'Mail', value: 'info@misterdj.nl', description: 'Reactie binnen 2 uur op werkdagen.' },
  { icon: Watch, label: 'Response tijd', value: 'Gemiddeld 12 minuten', description: 'Dedicated planningsteam volgt elke lead op.' },
];

const locations = [
  'Eindhoven — Hoofdkantoor',
  'Tilburg — Studio & showspace',
  'Breda — Service hub',
];

const ContactSections = () => (
  <SlideLayout
    title="Organisms: Contact"
    subtitle="Contact secties met formulier, locaties en snelle CTA’s voor conversies en vertrouwen."
  >
    <div className="grid gap-spacing-xl xl:grid-cols-[3fr,2fr]">
      <section className="space-y-spacing-lg rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-xl shadow-lg">
        <header className="space-y-spacing-xs">
          <h3 className="text-font-size-h3 font-bold text-neutral-dark">Plan jullie kennismaking</h3>
          <p className="text-sm text-neutral-gray-500">
            Vul de details in en ontvang binnen 2 uur een persoonlijk voorstel met beschikbaarheid en pakketadvies.
          </p>
        </header>
        <form className="grid gap-spacing-md md:grid-cols-2">
          <div className="space-y-spacing-xs">
            <Label htmlFor="contact-name">Naam</Label>
            <Input id="contact-name" placeholder="Lisa & Mark" />
          </div>
          <div className="space-y-spacing-xs">
            <Label htmlFor="contact-mail">E-mail</Label>
            <Input id="contact-mail" type="email" placeholder="jullie@misterdj.nl" />
          </div>
          <div className="space-y-spacing-xs md:col-span-2">
            <Label htmlFor="contact-message">Event details</Label>
            <Textarea id="contact-message" placeholder="Datum, locatie, aantal gasten, speciale wensen..." rows={4} />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-spacing-sm md:col-span-2">
            <p className="text-xs text-neutral-gray-500">Door te verzenden ga je akkoord met onze privacyvoorwaarden.</p>
            <Button size="lg" className="gap-spacing-xs">
              Verstuur aanvraag
            </Button>
          </div>
        </form>
      </section>

      <aside className="space-y-spacing-lg rounded-3xl border border-primary/20 bg-primary/5 p-spacing-xl shadow-xl">
        <div className="space-y-spacing-sm">
          <h4 className="text-font-size-h3 font-semibold text-neutral-dark">Contactgegevens</h4>
          <ul className="space-y-spacing-md">
            {contactChannels.map(({ icon: Icon, label, value, description }) => (
              <li key={label} className="flex items-start gap-spacing-sm">
                <div className="mt-1 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-4" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-dark">{label}</p>
                  <p className="text-sm text-primary">{value}</p>
                  <p className="text-xs text-neutral-gray-500">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-spacing-sm">
          <h4 className="text-font-size-h3 font-semibold text-neutral-dark">Locaties</h4>
          <ul className="space-y-spacing-xs text-sm text-neutral-dark">
            {locations.map((location) => (
              <li key={location} className="flex items-center gap-spacing-sm">
                <MapPin className="size-4 text-primary" aria-hidden />
                {location}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  </SlideLayout>
);

export default ContactSections;
