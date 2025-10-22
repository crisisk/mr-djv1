'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import * as Slider from '@radix-ui/react-slider';
import Button from '../ui/Button';
import { TrendingUp, CheckCircle2 } from 'lucide-react';

interface RoiCalculatorProps {
  className?: string;
}

export default function RoiCalculator({ className = '' }: RoiCalculatorProps) {
  const [guestCount, setGuestCount] = useState(100);
  const [duration, setDuration] = useState(6);
  const [serviceLevel, setServiceLevel] = useState<'basic' | 'standard' | 'premium'>('standard');

  const calculations = useMemo(() => {
    // DIY Costs
    const equipmentRental = duration * 150; // €150/hour equipment
    const musicLicensing = 500;
    const timeValue = duration * 50; // Your time is valuable
    const diyTotal = equipmentRental + musicLicensing + timeValue;

    // Professional DJ Value
    const baseCost = {
      basic: 800,
      standard: 1200,
      premium: 1800,
    }[serviceLevel];

    const professionalCost = baseCost + (guestCount > 100 ? (guestCount - 100) * 2 : 0);

    // Benefits Value
    const guaranteedEntertainment = 500;
    const backupEquipment = 300;
    const experienceValue = 400;
    const stressFreeValue = 300;
    const professionalBenefits = guaranteedEntertainment + backupEquipment + experienceValue + stressFreeValue;

    // ROI Calculation
    const totalValue = professionalCost + professionalBenefits;
    const savings = diyTotal - professionalCost;
    const roi = ((professionalBenefits + savings) / professionalCost) * 100;

    return {
      diyTotal,
      professionalCost,
      professionalBenefits,
      totalValue,
      savings: Math.max(0, savings),
      roi: Math.max(0, roi),
    };
  }, [guestCount, duration, serviceLevel]);

  return (
    <motion.div
      className={`rounded-3xl border border-neutral-gray-100 bg-gradient-to-br from-white to-gray-50 p-spacing-xl shadow-lg ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-spacing-sm mb-spacing-lg">
        <TrendingUp className="h-6 w-6 text-primary" />
        <h3 className="text-font-size-h3 font-bold text-neutral-dark">
          ROI Calculator
        </h3>
      </div>

      <p className="text-sm text-gray-600 mb-spacing-xl">
        Ontdek de waarde van een professionele DJ voor jouw feest
      </p>

      <div className="space-y-spacing-xl">
        {/* Guest Count Slider */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-spacing-sm">
            Aantal gasten: <span className="text-primary">{guestCount}</span>
          </label>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            value={[guestCount]}
            onValueChange={([value]) => setGuestCount(value)}
            max={500}
            min={50}
            step={10}
          >
            <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
              <Slider.Range className="absolute bg-primary rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb
              className="block w-5 h-5 bg-white border-2 border-primary rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Guest count"
            />
          </Slider.Root>
        </div>

        {/* Duration Slider */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-spacing-sm">
            Duur: <span className="text-primary">{duration} uur</span>
          </label>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            value={[duration]}
            onValueChange={([value]) => setDuration(value)}
            max={12}
            min={4}
            step={1}
          >
            <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
              <Slider.Range className="absolute bg-primary rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb
              className="block w-5 h-5 bg-white border-2 border-primary rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Duration"
            />
          </Slider.Root>
        </div>

        {/* Service Level */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-spacing-sm">
            Service niveau
          </label>
          <div className="grid grid-cols-3 gap-spacing-sm">
            {(['basic', 'standard', 'premium'] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setServiceLevel(level)}
                className={`py-spacing-sm px-spacing-md rounded-2xl text-sm font-medium transition-all ${
                  serviceLevel === level
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="border-t border-gray-200 pt-spacing-lg space-y-spacing-md">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-spacing-md">
            <p className="text-xs text-red-600 font-semibold uppercase mb-1">DIY Kosten</p>
            <p className="text-2xl font-bold text-red-700">€{calculations.diyTotal.toLocaleString()}</p>
            <p className="text-xs text-red-600 mt-1">Apparatuur + Licenties + Jouw tijd</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-spacing-md">
            <p className="text-xs text-green-600 font-semibold uppercase mb-1">Professionele DJ</p>
            <p className="text-2xl font-bold text-green-700">€{calculations.professionalCost.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1">All-inclusive pakket</p>
          </div>

          {calculations.savings > 0 && (
            <div className="bg-primary/10 border border-primary/30 rounded-2xl p-spacing-md">
              <p className="text-xs text-primary font-semibold uppercase mb-1">Jouw besparing</p>
              <p className="text-2xl font-bold text-primary">€{calculations.savings.toLocaleString()}</p>
            </div>
          )}

          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-2xl p-spacing-md">
            <p className="text-xs text-primary font-semibold uppercase mb-2">Toegevoegde waarde</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                100% Dansgarantie
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Backup apparatuur
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                15+ jaar ervaring
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Stress-vrije planning
              </li>
            </ul>
            <div className="mt-spacing-md pt-spacing-md border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Return on Investment</p>
              <p className="text-3xl font-bold text-primary">{calculations.roi.toFixed(0)}%</p>
            </div>
          </div>
        </div>

        <Button size="lg" className="w-full">
          Vraag Gratis Offerte Aan
        </Button>
      </div>
    </motion.div>
  );
}
