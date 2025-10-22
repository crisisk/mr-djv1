'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import Button from '../ui/Button';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import 'react-day-picker/dist/style.css';

interface AvailabilityCheckerProps {
  onSubmit?: (data: BookingData) => void;
  className?: string;
}

interface BookingData {
  date: Date;
  eventType: string;
  guestCount: number;
  location: string;
  name: string;
  email: string;
  phone: string;
}

const eventTypes = [
  { value: 'bruiloft', label: 'Bruiloft' },
  { value: 'corporate', label: 'Bedrijfsfeest' },
  { value: 'private', label: 'Privé Feest' },
  { value: 'other', label: 'Anders' },
];

export default function AvailabilityChecker({
  onSubmit,
  className = '',
}: AvailabilityCheckerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [eventType, setEventType] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !eventType || !guestCount || !name || !email) {
      return;
    }

    setIsSubmitting(true);

    const data: BookingData = {
      date: selectedDate,
      eventType,
      guestCount: parseInt(guestCount),
      location,
      name,
      email,
      phone,
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    onSubmit?.(data);
    setShowSuccess(true);
    setIsSubmitting(false);

    // Reset form after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedDate(undefined);
      setEventType('');
      setGuestCount('');
      setLocation('');
      setName('');
      setEmail('');
      setPhone('');
    }, 3000);
  };

  return (
    <motion.div
      className={`rounded-3xl border border-neutral-gray-100 bg-white p-spacing-xl shadow-lg ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-font-size-h3 font-bold text-neutral-dark mb-spacing-md">
        Controleer Beschikbaarheid
      </h3>

      {showSuccess ? (
        <motion.div
          className="py-spacing-xl text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-5xl mb-spacing-md">🎉</div>
          <h4 className="text-font-size-h3 font-bold text-neutral-dark mb-spacing-sm">
            Aanvraag Verzonden!
          </h4>
          <p className="text-gray-600">
            We nemen binnen 24 uur contact met je op.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-spacing-lg">
          {/* Date Picker */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-spacing-sm">
              <Calendar className="inline h-4 w-4 mr-1" />
              Datum van je feest
            </label>
            <div className="border border-gray-200 rounded-2xl p-spacing-md">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={nl}
                disabled={{ before: new Date() }}
                className="mx-auto"
              />
            </div>
            {selectedDate && (
              <p className="text-sm text-gray-600 mt-spacing-sm">
                Geselecteerd: {format(selectedDate, 'EEEE d MMMM yyyy', { locale: nl })}
              </p>
            )}
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-spacing-sm">
              <Clock className="inline h-4 w-4 mr-1" />
              Type evenement
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 px-spacing-md py-spacing-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            >
              <option value="">Selecteer type</option>
              {eventTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Guest Count */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-spacing-sm">
              <Users className="inline h-4 w-4 mr-1" />
              Aantal gasten
            </label>
            <input
              type="number"
              min="10"
              max="1000"
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
              placeholder="Bijv. 100"
              className="w-full rounded-2xl border border-gray-300 px-spacing-md py-spacing-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-spacing-sm">
              <MapPin className="inline h-4 w-4 mr-1" />
              Locatie (optioneel)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Bijv. Eindhoven"
              className="w-full rounded-2xl border border-gray-300 px-spacing-md py-spacing-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="border-t border-gray-200 pt-spacing-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-spacing-md">
              Jouw gegevens
            </h4>

            <div className="space-y-spacing-md">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Naam *"
                className="w-full rounded-2xl border border-gray-300 px-spacing-md py-spacing-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email *"
                className="w-full rounded-2xl border border-gray-300 px-spacing-md py-spacing-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Telefoon (optioneel)"
                className="w-full rounded-2xl border border-gray-300 px-spacing-md py-spacing-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting || !selectedDate || !eventType || !guestCount || !name || !email}
          >
            {isSubmitting ? 'Bezig met verzenden...' : 'Vraag Gratis Offerte Aan'}
          </Button>
        </form>
      )}
    </motion.div>
  );
}
