import React from 'react';
import SlideLayout from '../common/SlideLayout.jsx';
import { Input } from '../ui/input.jsx';
import { Textarea } from '../ui/textarea.jsx';
import { Label } from '../ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select.jsx';
import { Checkbox } from '../ui/checkbox.jsx';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group.jsx';
import { Switch } from '../ui/switch.jsx';

const textFieldStates = [
  {
    id: 'name',
    label: 'Naam',
    placeholder: 'Bijv. Lisa & Mark',
    helper: 'Gebruik volledige naam voor de offerte.',
  },
  {
    id: 'email',
    label: 'E-mailadres',
    placeholder: 'jij@misterdj.nl',
    state: 'error',
    helper: 'Dit e-mailadres lijkt onjuist. Controleer het nogmaals.',
  },
  {
    id: 'phone',
    label: 'Telefoonnummer',
    placeholder: '+31 6 12345678',
    state: 'success',
    helper: 'Perfect! We gebruiken dit nummer voor snelle updates.',
  },
];

const selectOptions = ['Bruiloft', 'Bedrijfsfeest', 'Verjaardag', 'Corporate Event'];
const checkboxOptions = ['DJ + Sax', 'Fotobooth', 'Lichtpakket Deluxe'];
const radioOptions = ['1-75 gasten', '75-150 gasten', '150+ gasten'];

const Inputs = () => (
  <SlideLayout
    title="Atoms: Inputs & Controls"
    subtitle="Formulierelementen met focus op toegankelijkheid, states en conversiegerichte hulpteksten."
  >
    <div className="grid gap-spacing-xl xl:grid-cols-3">
      <div className="space-y-spacing-lg">
        <h3 className="text-font-size-h3 font-bold text-primary">Tekstvelden & Validatie</h3>
        <div className="space-y-spacing-md">
          {textFieldStates.map(({ id, label, placeholder, helper, state }) => {
            const helperColor =
              state === 'error'
                ? 'text-destructive'
                : state === 'success'
                ? 'text-success'
                : 'text-neutral-gray-500';

            return (
              <div key={id} className="space-y-spacing-xs">
                <Label htmlFor={id} className="text-sm font-semibold text-neutral-dark">
                  {label}
                </Label>
                <Input
                  id={id}
                  placeholder={placeholder}
                  aria-invalid={state === 'error'}
                  className={state === 'success' ? 'border-success focus-visible:ring-success/30' : ''}
                />
                <p className={`text-sm ${helperColor}`}>{helper}</p>
              </div>
            );
          })}
          <div className="space-y-spacing-xs">
            <Label htmlFor="message" className="text-sm font-semibold text-neutral-dark">
              Bericht
            </Label>
            <Textarea id="message" placeholder="Vertel ons alles over jullie event..." rows={4} />
          </div>
        </div>
      </div>

      <div className="space-y-spacing-lg">
        <h3 className="text-font-size-h3 font-bold text-primary">Selects & Datum</h3>
        <div className="space-y-spacing-md">
          <div className="space-y-spacing-xs">
            <Label className="text-sm font-semibold text-neutral-dark">Event type</Label>
            <Select defaultValue="Bruiloft">
              <SelectTrigger>
                <SelectValue placeholder="Kies type" />
              </SelectTrigger>
              <SelectContent>
                {selectOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-spacing-xs">
            <Label htmlFor="date" className="text-sm font-semibold text-neutral-dark">
              Voorkeursdatum
            </Label>
            <Input id="date" type="date" />
          </div>
          <div className="space-y-spacing-xs">
            <Label htmlFor="guests" className="text-sm font-semibold text-neutral-dark">
              Aantal gasten
            </Label>
            <Input id="guests" type="number" min="0" placeholder="Bijv. 120" />
          </div>
        </div>
      </div>

      <div className="space-y-spacing-lg">
        <h3 className="text-font-size-h3 font-bold text-primary">Opties & Toggles</h3>
        <div className="space-y-spacing-md">
          <fieldset className="space-y-spacing-sm">
            <legend className="text-sm font-semibold text-neutral-dark">Favoriete add-ons</legend>
            {checkboxOptions.map((option) => (
              <label key={option} className="flex items-center gap-spacing-sm text-sm text-neutral-dark">
                <Checkbox />
                {option}
              </label>
            ))}
          </fieldset>
          <fieldset className="space-y-spacing-sm">
            <legend className="text-sm font-semibold text-neutral-dark">Grootte van het event</legend>
            <RadioGroup defaultValue="75-150 gasten" className="space-y-spacing-sm">
              {radioOptions.map((option) => (
                <div key={option} className="flex items-center gap-spacing-sm text-sm text-neutral-dark">
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </fieldset>
          <div className="flex items-center justify-between rounded-2xl border border-neutral-gray-100 bg-neutral-light/70 p-spacing-md">
            <div>
              <p className="text-sm font-semibold text-neutral-dark">Snelle follow-up</p>
              <p className="text-sm text-neutral-gray-500">Ontvang direct een sms wanneer we beschikbaarheid bevestigen.</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>
    </div>
  </SlideLayout>
);

export default Inputs;
