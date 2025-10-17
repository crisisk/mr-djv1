import React from 'react';
import SlideLayout from '../common/SlideLayout.jsx';
import { Input } from '../ui/input.jsx';
import { Textarea } from '../ui/textarea.jsx';
import { Label } from '../ui/label.jsx';
import { Button } from '../ui/button.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select.jsx';
import { Switch } from '../ui/switch.jsx';

const packageOptions = ['Silver', 'Gold', 'Platinum'];
const eventTimings = ['18:00 - 00:00', '19:00 - 01:00', '20:00 - 02:00'];

const Forms = () => (
  <SlideLayout
    title="Molecules: Form Patterns"
    subtitle="Conversie-geoptimaliseerde formulieren met inline validatie, hulptekst en follow-up opties."
  >
    <div className="grid gap-spacing-xl lg:grid-cols-2">
      <form className="space-y-spacing-lg rounded-3xl border border-neutral-gray-100 bg-neutral-light/80 p-spacing-xl shadow-lg">
        <header>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Stap 1</p>
          <h3 className="text-font-size-h3 font-bold text-neutral-dark">Offerte aanvraag</h3>
          <p className="text-sm text-neutral-gray-500">We reageren binnen 2 uur op werkdagen.</p>
        </header>
        <div className="grid gap-spacing-md md:grid-cols-2">
          <div className="space-y-spacing-xs">
            <Label htmlFor="contact-name">Naam</Label>
            <Input id="contact-name" placeholder="Lisa & Mark" />
          </div>
          <div className="space-y-spacing-xs">
            <Label htmlFor="contact-email">E-mailadres</Label>
            <Input id="contact-email" type="email" placeholder="jij@misterdj.nl" aria-invalid />
            <p className="text-xs text-destructive">Controleer het e-mailadres, dit lijkt niet te kloppen.</p>
          </div>
          <div className="space-y-spacing-xs">
            <Label htmlFor="contact-phone">Telefoonnummer</Label>
            <Input id="contact-phone" type="tel" placeholder="06 12345678" />
          </div>
          <div className="space-y-spacing-xs">
            <Label>Voorkeurs pakket</Label>
            <Select defaultValue="Gold">
              <SelectTrigger>
                <SelectValue placeholder="Selecteer pakket" />
              </SelectTrigger>
              <SelectContent>
                {packageOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-spacing-xs">
          <Label htmlFor="event-details">Event details</Label>
          <Textarea id="event-details" placeholder="Vertel ons alles over jullie feest, muziekvoorkeuren en verrassingen." rows={4} />
          <p className="text-xs text-neutral-gray-500">We gebruiken deze info om de perfecte DJ match te maken.</p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-spacing-md">
          <div className="flex items-center gap-spacing-sm">
            <Switch id="follow-up" defaultChecked />
            <Label htmlFor="follow-up" className="text-sm text-neutral-dark">
              Stuur mij updates via WhatsApp
            </Label>
          </div>
          <Button size="lg">Verstuur aanvraag</Button>
        </div>
      </form>

      <form className="space-y-spacing-lg rounded-3xl border border-primary/20 bg-primary/5 p-spacing-xl shadow-xl">
        <header>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Stap 2</p>
          <h3 className="text-font-size-h3 font-bold text-neutral-dark">Intake & planning</h3>
          <p className="text-sm text-neutral-dark/70">
            Na acceptatie plannen we een uitgebreide intake om muziekstijl, momentopbouw en highlights te bepalen.
          </p>
        </header>
        <div className="grid gap-spacing-md md:grid-cols-2">
          <div className="space-y-spacing-xs">
            <Label htmlFor="venue">Locatie</Label>
            <Input id="venue" placeholder="Kasteel Maurick" />
          </div>
          <div className="space-y-spacing-xs">
            <Label htmlFor="guests">Aantal gasten</Label>
            <Input id="guests" type="number" placeholder="150" />
          </div>
          <div className="space-y-spacing-xs">
            <Label htmlFor="timing">Tijdslot</Label>
            <Select defaultValue="19:00 - 01:00">
              <SelectTrigger>
                <SelectValue placeholder="Kies tijdslot" />
              </SelectTrigger>
              <SelectContent>
                {eventTimings.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-spacing-xs">
            <Label htmlFor="first-dance">Eerste dans</Label>
            <Input id="first-dance" placeholder="John Legend – All of Me" />
          </div>
        </div>
        <div className="space-y-spacing-xs">
          <Label htmlFor="must-play">Must-play lijst</Label>
          <Textarea id="must-play" placeholder="Vul maximaal 10 nummers in die niet mogen ontbreken." rows={4} />
        </div>
        <div className="space-y-spacing-xs">
          <Label htmlFor="do-not-play">Do-not-play lijst</Label>
          <Textarea id="do-not-play" placeholder="Bijvoorbeeld: hardcore, après-ski, foute klassiekers." rows={3} />
        </div>
        <div className="flex items-center justify-between gap-spacing-md">
          <p className="text-sm text-neutral-dark/70">Opslaan in portal voor later</p>
          <Button variant="outline" size="lg">
            Sla intake op
          </Button>
        </div>
      </form>
    </div>
  </SlideLayout>
);

export default Forms;
