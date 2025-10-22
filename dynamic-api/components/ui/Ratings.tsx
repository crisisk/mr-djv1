'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface RatingsProps {
  platform: 'trustpilot' | 'google' | 'custom';
  score: number;
  maxScore?: number;
  reviewCount: number;
  link?: string;
  className?: string;
}

const platformConfig = {
  trustpilot: {
    name: 'Trustpilot',
    color: 'text-[#00B67A]',
    bgColor: 'bg-[#00B67A]',
  },
  google: {
    name: 'Google Reviews',
    color: 'text-[#FBBC04]',
    bgColor: 'bg-[#FBBC04]',
  },
  custom: {
    name: 'Reviews',
    color: 'text-accent-gold',
    bgColor: 'bg-accent-gold',
  },
};

export default function Ratings({
  platform,
  score,
  maxScore = 5,
  reviewCount,
  link,
  className = '',
}: RatingsProps) {
  const config = platformConfig[platform];
  const stars = Math.round(score);

  const content = (
    <div className={`inline-flex items-center gap-spacing-sm ${className}`}>
      {/* Stars */}
      <div className="flex items-center gap-1">
        {[...Array(maxScore)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <Star
              className={`h-4 w-4 ${
                i < stars ? `${config.color} fill-current` : 'text-gray-300'
              }`}
            />
          </motion.div>
        ))}
      </div>

      {/* Score */}
      <span className="text-sm font-semibold text-gray-900">
        {score.toFixed(1)}
      </span>

      {/* Review Count */}
      <span className="text-xs text-gray-600">
        ({reviewCount.toLocaleString()} reviews)
      </span>

      {/* Platform Badge */}
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${config.bgColor} text-white`}>
        {config.name}
      </span>
    </div>
  );

  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:opacity-80 transition-opacity"
        aria-label={`View ${config.name} reviews`}
      >
        {content}
      </a>
    );
  }

  return content;
}
