'use client';

import React, { useState } from 'react';
import Button from '../ui/Button';

interface FormFieldProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  error?: string;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({ label, id, type = 'text', placeholder, error, className = '' }) => (
  <div className={`space-y-spacing-xs ${className}`}>
    <label htmlFor={id} className="text-sm font-medium text-neutral-dark block">{label}</label>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      aria-invalid={!!error}
      className="w-full rounded-2xl border border-gray-300 px-spacing-md py-spacing-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
    />
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
);

const TextareaField: React.FC<FormFieldProps & { rows?: number }> = ({ label, id, placeholder, rows = 4, className = '' }) => (
  <div className={`space-y-spacing-xs ${className}`}>
    <label htmlFor={id} className="text-sm font-medium text-neutral-dark block">{label}</label>
    <textarea
      id={id}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-2xl border border-gray-300 px-spacing-md py-spacing-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
    />
  </div>
);

/**
 * Forms Component - Conversion-optimized form patterns
 */
const Forms: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className={`grid gap-spacing-xl lg:grid-cols-2 ${className}`}>
      <form className="space-y-spacing-lg rounded-3xl border border-gray-200 bg-white p-spacing-xl shadow-lg" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
        <header>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Stap 1</p>
          <h3 className="text-font-size-h3 font-bold text-neutral-dark">Offerte aanvraag</h3>
          <p className="text-sm text-gray-600">We reageren binnen 2 uur op werkdagen.</p>
        </header>
        <div className="grid gap-spacing-md md:grid-cols-2">
          <FormField label="Naam" id="contact-name" placeholder="Lisa & Mark" />
          <FormField label="E-mailadres" id="contact-email" type="email" placeholder="jij@misterdj.nl" />
          <FormField label="Telefoonnummer" id="contact-phone" type="tel" placeholder="06 12345678" />
          <div className="space-y-spacing-xs">
            <label className="text-sm font-medium text-neutral-dark block">Voorkeurs pakket</label>
            <select className="w-full rounded-2xl border border-gray-300 px-spacing-md py-spacing-sm focus:border-primary focus:ring-2 focus:ring-primary/20">
              <option>Silver</option>
              <option>Gold</option>
              <option>Platinum</option>
            </select>
          </div>
        </div>
        <TextareaField label="Event details" id="event-details" placeholder="Vertel ons alles over jullie feest, muziekvoorkeuren en verrassingen." />
        <div className="flex justify-end">
          <Button size="lg" type="submit">Verstuur aanvraag</Button>
        </div>
      </form>

      <form className="space-y-spacing-lg rounded-3xl border border-primary/20 bg-primary/5 p-spacing-xl shadow-xl">
        <header>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Stap 2</p>
          <h3 className="text-font-size-h3 font-bold text-neutral-dark">Intake & planning</h3>
          <p className="text-sm text-gray-700">Na acceptatie plannen we een uitgebreide intake.</p>
        </header>
        <div className="grid gap-spacing-md md:grid-cols-2">
          <FormField label="Locatie" id="venue" placeholder="Kasteel Maurick" />
          <FormField label="Aantal gasten" id="guests" type="number" placeholder="150" />
          <div className="space-y-spacing-xs">
            <label className="text-sm font-medium text-neutral-dark block">Tijdslot</label>
            <select className="w-full rounded-2xl border border-gray-300 px-spacing-md py-spacing-sm focus:border-primary focus:ring-2 focus:ring-primary/20">
              <option>18:00 - 00:00</option>
              <option>19:00 - 01:00</option>
              <option>20:00 - 02:00</option>
            </select>
          </div>
          <FormField label="Eerste dans" id="first-dance" placeholder="John Legend – All of Me" />
        </div>
        <TextareaField label="Must-play lijst" id="must-play" placeholder="Vul maximaal 10 nummers in die niet mogen ontbreken." />
        <div className="flex justify-end">
          <Button variant="secondary" size="lg">Sla intake op</Button>
        </div>
      </form>
    </div>
  );
};

export default Forms;
