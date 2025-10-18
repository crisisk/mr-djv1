import { memo } from 'react';
import { Heart, Briefcase, PartyPopper, Music2, Headphones } from 'lucide-react';

/**
 * Image Placeholder Component
 * Displays styled placeholder images for different event types
 * with gradient backgrounds and icon overlays
 *
 * @param {string} eventType - Type of event (bruiloft, corporate, private, festival)
 * @param {string} aspectRatio - Aspect ratio (16/9, 4/3, 1/1, etc.)
 * @param {string} size - Size variant (sm, md, lg, xl)
 * @param {string} label - Optional text label
 */

const EVENT_TYPE_CONFIGS = {
  bruiloft: {
    gradient: 'from-secondary-300 via-accent-magenta-200 to-secondary-200',
    Icon: Heart,
    label: 'Bruiloft Event',
    textColor: 'text-secondary-800'
  },
  corporate: {
    gradient: 'from-primary-400 via-neutral-600 to-neutral-dark',
    Icon: Briefcase,
    label: 'Corporate Event',
    textColor: 'text-neutral-light'
  },
  private: {
    gradient: 'from-accent-orange-300 via-accent-magenta-200 to-accent-purple-300',
    Icon: PartyPopper,
    label: 'Private Feest',
    textColor: 'text-neutral-dark'
  },
  festival: {
    gradient: 'from-accent-purple-400 via-accent-magenta-400 to-primary-400',
    Icon: Music2,
    label: 'Festival / Nightlife',
    textColor: 'text-neutral-light'
  },
  default: {
    gradient: 'from-neutral-300 via-neutral-200 to-neutral-100',
    Icon: Headphones,
    label: 'Mr. DJ Event',
    textColor: 'text-neutral-dark'
  }
};

const SIZE_CONFIGS = {
  sm: 'h-32 text-2xl',
  md: 'h-48 text-4xl',
  lg: 'h-64 text-5xl',
  xl: 'h-96 text-6xl'
};

export const ImagePlaceholder = memo(function ImagePlaceholder({
  eventType = 'default',
  aspectRatio = '16/9',
  size = 'md',
  label,
  className = '',
  showIcon = true,
  showLabel = true
}) {
  const config = EVENT_TYPE_CONFIGS[eventType] || EVENT_TYPE_CONFIGS.default;
  const sizeClass = SIZE_CONFIGS[size] || SIZE_CONFIGS.md;
  const displayLabel = label || config.label;

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${sizeClass} ${className}`}
      style={{ aspectRatio }}
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-80`} />

      {/* Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v6h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 space-y-2">
        {showIcon && config.Icon && (
          <div className="opacity-90 animate-pulse">
            <config.Icon
              className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24"
              strokeWidth={1.5}
              aria-hidden
            />
          </div>
        )}
        {showLabel && (
          <div className={`text-center space-y-1 ${config.textColor}`}>
            <div className="text-sm md:text-base font-semibold uppercase tracking-wider opacity-90">
              {displayLabel}
            </div>
            <div className="text-xs opacity-75">
              Afbeelding wordt binnenkort toegevoegd
            </div>
          </div>
        )}
      </div>

      {/* Corner Badge */}
      <div className="absolute top-2 right-2 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
        <span className="text-white text-xs font-medium">Preview</span>
      </div>
    </div>
  );
});

/**
 * Gallery Placeholder - Multiple images in a grid
 */
export const GalleryPlaceholder = memo(function GalleryPlaceholder({
  eventType,
  count = 6,
  gridCols = 3,
  size = 'md',
  className = ''
}) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${gridCols} gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <ImagePlaceholder
          key={index}
          eventType={eventType}
          size={size}
          aspectRatio="4/3"
        />
      ))}
    </div>
  );
});

/**
 * Hero Placeholder - Large format for hero sections
 */
export const HeroPlaceholder = memo(function HeroPlaceholder({
  eventType,
  height = 'h-[70vh]',
  className = ''
}) {
  const config = EVENT_TYPE_CONFIGS[eventType] || EVENT_TYPE_CONFIGS.default;

  return (
    <div className={`relative overflow-hidden ${height} ${className}`}>
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient}`} />

      {/* Animated Pattern */}
      <div
        className="absolute inset-0 opacity-20 animate-pulse"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='%23000' fill-opacity='0.3' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Center Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className={`text-center space-y-4 ${config.textColor}`}>
          {config.Icon && (
            <div className="flex justify-center animate-bounce">
              <config.Icon
                className="w-32 h-32 md:w-40 md:h-40"
                strokeWidth={1.5}
                aria-hidden
              />
            </div>
          )}
          <div className="space-y-2">
            <h3 className="text-2xl md:text-4xl font-bold">
              {config.label} Hero Image
            </h3>
            <p className="text-sm md:text-base opacity-80 max-w-md mx-auto">
              Professionele event fotografie wordt binnenkort toegevoegd aan deze sectie
            </p>
          </div>
        </div>
      </div>

      {/* Info Badge */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/30 backdrop-blur-md rounded-full px-6 py-2">
        <span className="text-white text-sm font-medium">
          🎨 Design Preview • {eventType || 'default'} variant
        </span>
      </div>
    </div>
  );
});

export default ImagePlaceholder;
