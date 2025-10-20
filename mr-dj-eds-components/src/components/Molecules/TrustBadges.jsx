import React from 'react';
import { Icon } from '../../icons/index.jsx';

/**
 * TrustBadges - Display credibility indicators
 * Shows years of experience, completed events, ratings, and guarantees
 * Increases conversion by building immediate trust
 */
const TrustBadges = ({ variant = 'horizontal', className = '' }) => {
  const badges = [
    {
      icon: 'icon-private-party',
      value: '15+',
      label: 'Jaar Ervaring',
      color: 'text-primary',
      iconClass: 'text-secondary',
    },
    {
      icon: 'icon-sparkles',
      value: '2500+',
      label: 'Geslaagde Feesten',
      color: 'text-secondary',
      iconClass: 'text-secondary',
    },
    {
      icon: 'icon-star',
      value: '4.9/5',
      label: 'Google Reviews',
      color: 'text-secondary',
      iconClass: 'text-secondary',
    },
    {
      icon: 'icon-dancer',
      value: '100%',
      label: 'Dansgarantie',
      color: 'text-primary',
      iconClass: 'text-primary',
    },
  ];

  const gridClasses = variant === 'vertical'
    ? 'grid-cols-1 gap-6'
    : 'grid-cols-2 md:grid-cols-4 gap-6 md:gap-8';

  return (
    <div className={`bg-neutral-light py-spacing-xl border-t border-b border-neutral-gray-100 ${className}`}>
      <div className="container mx-auto px-spacing-md">
        <div className={`grid ${gridClasses} text-center`}>
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-spacing-md rounded-lg hover:bg-neutral-gray-100 transition-colors duration-300"
            >
              {/* Icon */}
              <div className={`text-5xl md:text-6xl mb-spacing-sm ${badge.iconClass ?? ''}`}>
                <Icon name={badge.icon} size={64} />
              </div>

              {/* Value */}
              <div className={`font-bold text-3xl md:text-4xl mb-spacing-xs ${badge.color}`}>
                {badge.value}
              </div>

              {/* Label */}
              <div className="text-sm md:text-base text-neutral-gray-500 font-medium">
                {badge.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * TrustBadgesCompact - Inline version for headers or tight spaces
 */
export const TrustBadgesCompact = () => {
  return (
    <div className="flex items-center justify-center gap-6 py-4 text-sm">
      <div className="flex items-center gap-2">
        <Icon name="icon-private-party" size={24} className="text-primary" />
        <span className="font-bold text-primary">15+ jaar</span>
      </div>
      <div className="flex items-center gap-2">
        <Icon name="icon-sparkles" size={24} className="text-secondary" />
        <span className="font-bold text-primary">2500+ feesten</span>
      </div>
      <div className="flex items-center gap-2">
        <Icon name="icon-star" size={24} className="text-secondary" />
        <span className="font-bold text-secondary">4.9/5</span>
      </div>
      <div className="flex items-center gap-2">
        <Icon name="icon-dancer" size={24} className="text-primary" />
        <span className="font-bold text-primary">100% garantie</span>
      </div>
    </div>
  );
};

export default TrustBadges;
