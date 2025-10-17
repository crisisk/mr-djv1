import React from 'react';
import SlideLayout from '../common/SlideLayout.jsx';
import { Button } from '../ui/button.jsx';
import { Input } from '../ui/input.jsx';
import { Label } from '../ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select.jsx';

const steps = [
  {
    title: 'Stap 1 – Datum & locatie',
    description: 'Selecteer datum, tijdslot en locatie. Beschikbaarheid wordt realtime gevalideerd via ons dashboard.',
  },
  {
    title: 'Stap 2 – Pakketkeuze',
    description: 'Kies het pakket en eventuele add-ons zoals saxofonist of fotobooth. Prijs wordt direct bijgewerkt.',
  },
  {
    title: 'Stap 3 – Bevestiging',
    description: 'Betaal aanbetaling veilig online en ontvang een onboarding checklist voor het intakegesprek.',
  },
];

const BookingFlow = () => (
  <SlideLayout
    title="Templates: Booking Flow"
    subtitle="Multi-step funnel met realtime beschikbaarheid, prijsfeedback en conversie-optimalisaties."
  >
    <div className="grid gap-spacing-xl lg:grid-cols-[2fr,1fr]">
      <section className="space-y-spacing-lg rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-xl shadow-lg">
        <div className="grid gap-spacing-md md:grid-cols-2">
          <div className="space-y-spacing-xs">
            <Label htmlFor="date">Datum</Label>
            <Input id="date" type="date" />
          </div>
          <div className="space-y-spacing-xs">
            <Label htmlFor="venue">Locatie</Label>
            <Input id="venue" placeholder="Bijv. Kasteel Maurick" />
          </div>
          <div className="space-y-spacing-xs">
            <Label htmlFor="timeslot">Tijdslot</Label>
            <Select defaultValue="19:00 - 01:00">
              <SelectTrigger>
                <SelectValue placeholder="Kies tijdslot" />
              </SelectTrigger>
              <SelectContent>
                {['18:00 - 00:00', '19:00 - 01:00', '20:00 - 02:00'].map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-spacing-xs">
            <Label htmlFor="package">Pakket</Label>
            <Select defaultValue="Gold">
              <SelectTrigger>
                <SelectValue placeholder="Kies pakket" />
              </SelectTrigger>
              <SelectContent>
                {['Silver', 'Gold', 'Platinum'].map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between rounded-3xl bg-primary/5 p-spacing-md">
          <p className="text-sm text-neutral-dark">
            Beschikbaar. Aanbetaling van <strong>€150</strong> nodig om datum te blokkeren. Event planning start direct.
          </p>
          <Button size="lg">Ga naar stap 2</Button>
        </div>
      </section>
      <aside className="space-y-spacing-md">
        {steps.map((step, index) => (
          <div key={step.title} className="rounded-3xl border border-primary/20 bg-primary/5 p-spacing-lg shadow-md">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Stap {index + 1}</p>
            <h3 className="text-sm font-semibold text-neutral-dark">{step.title}</h3>
            <p className="text-sm text-neutral-gray-600">{step.description}</p>
          </div>
        ))}
      </aside>
    </div>
  </SlideLayout>
);

export default BookingFlow;
