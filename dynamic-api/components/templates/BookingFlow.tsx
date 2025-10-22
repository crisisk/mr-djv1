'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import AvailabilityChecker from '../patterns/AvailabilityChecker';
import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

interface BookingFlowProps {
  onComplete?: (data: any) => void;
  className?: string;
}

const steps = [
  { id: 1, name: 'Event Details', description: 'Datum en type feest' },
  { id: 2, name: 'Service Selection', description: 'Kies je pakket' },
  { id: 3, name: 'Add-ons', description: 'Extra opties' },
  { id: 4, name: 'Contact Info', description: 'Jouw gegevens' },
  { id: 5, name: 'Review', description: 'Bevestig je boeking' },
];

const packages = [
  {
    id: 'basic',
    name: 'Basic',
    price: 800,
    features: ['4 uur DJ', 'Professionele apparatuur', 'Basis lichtshow'],
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 1200,
    features: ['6 uur DJ', 'Premium apparatuur', 'Uitgebreide lichtshow', 'Draadloze microfoon'],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 1800,
    features: [
      '8 uur DJ',
      'Premium apparatuur',
      'Complete lichtshow',
      'Live saxofonist',
      'Photo booth',
      'Rookmachine',
    ],
  },
];

const addons = [
  { id: 'saxophonist', name: 'Live Saxofonist', price: 400 },
  { id: 'lighting', name: 'Extra Verlichting', price: 200 },
  { id: 'photobooth', name: 'Photo Booth', price: 300 },
  { id: 'smoke', name: 'Rookmachine', price: 100 },
];

export default function BookingFlow({ onComplete, className = '' }: BookingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<any>({});
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleEventDetails = (data: any) => {
    setBookingData((prev: any) => ({ ...prev, ...data }));
    nextStep();
  };

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const calculateTotal = () => {
    const packageCost = packages.find((p) => p.id === selectedPackage)?.price || 0;
    const addonsCost = addons
      .filter((a) => selectedAddons.includes(a.id))
      .reduce((sum, a) => sum + a.price, 0);
    return packageCost + addonsCost;
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Progress Bar */}
      <div className="mb-spacing-2xl">
        <div className="flex justify-between items-center mb-spacing-md">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    currentStep > step.id
                      ? 'bg-green-500 text-white'
                      : currentStep === step.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <span className="text-xs text-gray-600 mt-2 text-center hidden md:block">
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-2 bg-gray-200">
                  <div
                    className={`h-full transition-all ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                    style={{ width: currentStep > step.id ? '100%' : '0%' }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 1 && (
            <AvailabilityChecker onSubmit={handleEventDetails} />
          )}

          {currentStep === 2 && (
            <div className="bg-white rounded-3xl p-spacing-xl shadow-lg">
              <h3 className="text-font-size-h3 font-bold text-neutral-dark mb-spacing-lg">
                Kies je pakket
              </h3>
              <div className="grid md:grid-cols-3 gap-spacing-md">
                {packages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`relative p-spacing-lg rounded-2xl border-2 transition-all text-left ${
                      selectedPackage === pkg.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${pkg.popular ? 'ring-2 ring-primary' : ''}`}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs px-3 py-1 rounded-full">
                        Populair
                      </span>
                    )}
                    <h4 className="font-bold text-lg text-neutral-dark mb-2">{pkg.name}</h4>
                    <p className="text-2xl font-bold text-primary mb-spacing-md">
                      €{pkg.price}
                    </p>
                    <ul className="space-y-2">
                      {pkg.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="bg-white rounded-3xl p-spacing-xl shadow-lg">
              <h3 className="text-font-size-h3 font-bold text-neutral-dark mb-spacing-lg">
                Kies extra opties
              </h3>
              <div className="space-y-spacing-sm">
                {addons.map((addon) => (
                  <button
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`w-full flex items-center justify-between p-spacing-md rounded-2xl border-2 transition-all ${
                      selectedAddons.includes(addon.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-spacing-md">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          selectedAddons.includes(addon.id)
                            ? 'border-primary bg-primary'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedAddons.includes(addon.id) && (
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <span className="font-semibold text-neutral-dark">{addon.name}</span>
                    </div>
                    <span className="font-bold text-primary">+€{addon.price}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="bg-white rounded-3xl p-spacing-xl shadow-lg">
              <h3 className="text-font-size-h3 font-bold text-neutral-dark mb-spacing-lg">
                Jouw contactgegevens
              </h3>
              <form className="space-y-spacing-md">
                <input
                  type="text"
                  placeholder="Volledige naam *"
                  className="w-full rounded-2xl border border-gray-300 px-spacing-md py-spacing-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
                <input
                  type="email"
                  placeholder="Email adres *"
                  className="w-full rounded-2xl border border-gray-300 px-spacing-md py-spacing-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
                <input
                  type="tel"
                  placeholder="Telefoonnummer *"
                  className="w-full rounded-2xl border border-gray-300 px-spacing-md py-spacing-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
                <textarea
                  placeholder="Extra opmerkingen of vragen (optioneel)"
                  rows={4}
                  className="w-full rounded-2xl border border-gray-300 px-spacing-md py-spacing-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </form>
            </div>
          )}

          {currentStep === 5 && (
            <div className="bg-white rounded-3xl p-spacing-xl shadow-lg">
              <h3 className="text-font-size-h3 font-bold text-neutral-dark mb-spacing-lg">
                Bevestig je boeking
              </h3>
              <div className="space-y-spacing-lg">
                <div className="bg-gray-50 rounded-2xl p-spacing-md">
                  <h4 className="font-semibold text-neutral-dark mb-spacing-sm">Pakket</h4>
                  <p className="text-gray-700">
                    {packages.find((p) => p.id === selectedPackage)?.name || 'Geen pakket geselecteerd'}
                  </p>
                </div>

                {selectedAddons.length > 0 && (
                  <div className="bg-gray-50 rounded-2xl p-spacing-md">
                    <h4 className="font-semibold text-neutral-dark mb-spacing-sm">Extra opties</h4>
                    <ul className="space-y-1">
                      {selectedAddons.map((addonId) => {
                        const addon = addons.find((a) => a.id === addonId);
                        return (
                          <li key={addonId} className="text-gray-700">
                            {addon?.name} - €{addon?.price}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                <div className="bg-primary/10 border border-primary/30 rounded-2xl p-spacing-md">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-neutral-dark">Totaal</span>
                    <span className="text-2xl font-bold text-primary">
                      €{calculateTotal().toLocaleString()}
                    </span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    onComplete?.({ ...bookingData, package: selectedPackage, addons: selectedAddons });
                  }}
                >
                  Bevestig Boeking
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-spacing-lg">
        <Button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Vorige
        </Button>
        {currentStep < steps.length && currentStep !== 1 && (
          <Button
            onClick={nextStep}
            disabled={currentStep === 2 && !selectedPackage}
            className="flex items-center gap-2"
          >
            Volgende
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
