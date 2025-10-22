import React from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Switch } from '../ui/switch';
import Button from '../ui/Button';

// --- Interfaces ---

interface TextFieldState {
  id: string;
  label: string;
  placeholder: string;
  helper: string;
  state?: 'error' | 'success' | 'default';
}

// --- Data ---

const textFieldStates: TextFieldState[] = [
  {
    id: 'name',
    label: 'Naam',
    placeholder: 'Bijv. Lisa & Mark',
    helper: 'Gebruik volledige naam voor de offerte.',
    state: 'default',
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

// --- Component ---

const Inputs: React.FC = () => (
  <div className="p-spacing-xl">
    <header className="mb-spacing-xl">
      <h1 className="text-3xl font-bold text-primary">Atoms: Inputs & Controls</h1>
      <p className="text-lg text-neutral-gray-500">
        Formulierelementen met focus op toegankelijkheid, states en conversiegerichte hulpteksten.
      </p>
    </header>

    <div className="grid gap-spacing-xl xl:grid-cols-3">
      {/* Kolom 1: Tekstvelden & Validatie */}
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

            const inputClass =
              state === 'success'
                ? 'border-success focus-visible:ring-success/30'
                : state === 'error'
                ? 'border-destructive focus-visible:ring-destructive/30'
                : '';

            return (
              <div key={id} className="space-y-spacing-xs">
                <Label htmlFor={id} className="text-sm font-semibold text-neutral-dark">
                  {label}
                </Label>
                <Input
                  id={id}
                  placeholder={placeholder}
                  aria-invalid={state === 'error'}
                  className={inputClass}
                />
                <p id={`${id}-helper`} className={`text-sm ${helperColor}`}>
                  {helper}
                </p>
              </div>
            );
          })}
          <div className="space-y-spacing-xs">
            <Label htmlFor="message" className="text-sm font-semibold text-neutral-dark">
              Bericht
            </Label>
            <Textarea
              id="message"
              placeholder="Vertel ons alles over jullie event..."
              rows={4}
            />
          </div>
        </div>
      </div>

      {/* Kolom 2: Selects, Checkbox & Radio */}
      <div className="space-y-spacing-lg">
        <h3 className="text-font-size-h3 font-bold text-primary">Selects, Checkbox & Radio</h3>

        {/* Select */}
        <div className="space-y-spacing-md">
          <div className="space-y-spacing-xs">
            <Label htmlFor="event-type" className="text-sm font-semibold text-neutral-dark">
              Type evenement
            </Label>
            <Select>
              <SelectTrigger id="event-type" className="w-full">
                <SelectValue placeholder="Kies een optie" />
              </SelectTrigger>
              <SelectContent>
                {selectOptions.map((option) => (
                  <SelectItem key={option} value={option.toLowerCase().replace(/\s/g, '-')}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Checkboxes */}
          <div className="space-y-spacing-xs">
            <Label className="text-sm font-semibold text-neutral-dark">Extra opties</Label>
            <div className="space-y-spacing-sm">
              {checkboxOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox id={option} />
                  <Label htmlFor={option} className="font-normal text-neutral-dark">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Radio Group */}
          <div className="space-y-spacing-xs">
            <Label className="text-sm font-semibold text-neutral-dark">Aantal gasten</Label>
            <RadioGroup defaultValue={radioOptions[1]} className="space-y-spacing-sm">
              {radioOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`radio-${option}`} />
                  <Label htmlFor={`radio-${option}`} className="font-normal text-neutral-dark">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Kolom 3: Switches & Buttons */}
      <div className="space-y-spacing-lg">
        <h3 className="text-font-size-h3 font-bold text-primary">Switches & Acties</h3>

        {/* Switches */}
        <div className="space-y-spacing-md">
          <div className="flex items-center justify-between">
            <Label htmlFor="newsletter" className="text-sm font-semibold text-neutral-dark">
              Nieuwsbrief ontvangen
            </Label>
            <Switch id="newsletter" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="terms" className="text-sm font-semibold text-neutral-dark">
              Algemene voorwaarden
            </Label>
            <Switch id="terms" aria-required="true" />
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-spacing-md pt-spacing-sm">
          <h4 className="text-base font-semibold text-neutral-dark">Primaire Acties</h4>
          <div className="flex flex-wrap gap-spacing-sm">
            <Button variant="primary" size="lg">
              Verstuur Offerte
            </Button>
            <Button variant="secondary" size="md">
              Annuleren
            </Button>
            <Button variant="ghost" size="sm">
              Meer info
            </Button>
          </div>
        </div>

        {/* Disabled State */}
        <div className="space-y-spacing-md pt-spacing-sm">
          <h4 className="text-base font-semibold text-neutral-dark">Disabled State</h4>
          <div className="flex flex-wrap gap-spacing-sm">
            <Button variant="primary" disabled>
              Verstuur (Disabled)
            </Button>
            <Input placeholder="Disabled Input" disabled />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Inputs;