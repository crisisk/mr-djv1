import { forwardRef } from 'react';
import clsx from 'clsx';
import {
  BadgeCheck,
  Briefcase,
  CalendarDays,
  Camera,
  Car,
  Drama,
  Facebook,
  Goal,
  GraduationCap,
  Handshake,
  Headphones as LucideHeadphones,
  Lightbulb,
  Linkedin,
  MapPin,
  MessageSquareQuote,
  Mic,
  Monitor,
  Music,
  PartyPopper,
  PersonStanding,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
  Spotify,
  Star as LucideStar,
  Tent,
  Volume2,
  Youtube,
} from 'lucide-react';

const SvgIconBase = forwardRef(function SvgIconBase(
  { className, title, size = 24, children, viewBox = '0 0 24 24', ...props },
  ref,
) {
  return (
    <svg
      ref={ref}
      className={clsx('shrink-0', className)}
      width={size}
      height={size}
      viewBox={viewBox}
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
});

const createLucideIcon = (LucideComponent, displayName) => {
  const Component = forwardRef(function Component({ className, title, size = 24, ...props }, ref) {
    return (
      <LucideComponent
        ref={ref}
        className={clsx('shrink-0', className)}
        size={size}
        role={title ? 'img' : 'presentation'}
        aria-label={title}
        aria-hidden={title ? undefined : true}
        {...props}
      />
    );
  });
  Component.displayName = displayName;
  return Component;
};

export const WeddingIcon = forwardRef(function WeddingIcon(
  { className, title, size = 24, ringColor = '#D4AF37', stoneColor = '#1A2C4B', ...props },
  ref,
) {
  return (
    <SvgIconBase ref={ref} className={className} title={title} size={size} viewBox="0 0 24 24" {...props}>
      <path
        d="M12 2C8.686 2 6 4.686 6 8c0 2.85 2.06 5.21 4.8 5.84l-1.6 4.8c-.1.3.1.6.4.7h6.8c.3-.1.5-.4.4-.7l-1.6-4.8c2.74-.63 4.8-2.99 4.8-5.84 0-3.314-2.686-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zM16 18h-8l1.2-3.6c.1-.3.4-.5.7-.5h4.2c.3 0 .6.2.7.5L16 18z"
        fill={ringColor}
      />
      <path d="M14.5 10.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" fill={stoneColor} />
    </SvgIconBase>
  );
});

export const CorporateIcon = forwardRef(function CorporateIcon(
  { className, title, size = 24, buildingColor = '#00AEEF', windowColor = '#FFFFFF', accentColor = '#D4AF37', ...props },
  ref,
) {
  return (
    <SvgIconBase ref={ref} className={className} title={title} size={size} viewBox="0 0 24 24" {...props}>
      <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 20V4h12v16H6z" fill={buildingColor} />
      <path
        d="M8 6h2v2H8zM11 6h2v2h-2zM14 6h2v2h-2zM8 9h2v2H8zM11 9h2v2h-2zM14 9h2v2h-2zM8 12h2v2H8zM11 12h2v2h-2zM14 12h2v2h-2z"
        fill={windowColor}
      />
      <path d="M15 17.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" fill={accentColor} />
    </SvgIconBase>
  );
});

export const PrivatePartyIcon = forwardRef(function PrivatePartyIcon(
  { className, title, size = 24, hatColor = '#D4AF37', accentColor = '#1A2C4B', spotColor = '#00AEEF', ...props },
  ref,
) {
  return (
    <SvgIconBase ref={ref} className={className} title={title} size={size} viewBox="0 0 24 24" {...props}>
      <path d="M12 2L6 10h3v8h6v-8h3L12 2z" fill={hatColor} />
      <circle cx="17" cy="17" r="2" fill={spotColor} />
      <circle cx="7" cy="17" r="2" fill={accentColor} />
      <path d="M12 10l-1 3h2l-1-3z" fill={accentColor} />
    </SvgIconBase>
  );
});

export const SaxIcon = forwardRef(function SaxIcon(
  { className, title, size = 24, bodyColor = '#00AEEF', keyColor = '#D4AF37', ...props },
  ref,
) {
  return (
    <SvgIconBase ref={ref} className={className} title={title} size={size} viewBox="0 0 24 24" {...props}>
      <path
        d="M6 4v4c0 2.761 2.239 5 5 5h1v3a4 4 0 1 0 8 0V5h-2v11a2 2 0 1 1-4 0v-3a3 3 0 0 0-3-3h-1c-1.657 0-3-1.343-3-3V4H6z"
        fill={bodyColor}
      />
      <circle cx="16" cy="7" r="1.25" fill={keyColor} />
      <circle cx="18.5" cy="9.5" r="1.25" fill={keyColor} />
      <circle cx="21" cy="12" r="1.25" fill={keyColor} />
    </SvgIconBase>
  );
});

export const HeadphonesIcon = createLucideIcon(LucideHeadphones, 'HeadphonesIcon');
export const DjBoothIcon = createLucideIcon(SlidersHorizontal, 'DjBoothIcon');
export const FestivalIcon = createLucideIcon(Tent, 'FestivalIcon');
export const SparklesIcon = createLucideIcon(Sparkles, 'SparklesIcon');
export const StarIcon = createLucideIcon(LucideStar, 'StarIcon');
export const DancerIcon = createLucideIcon(PersonStanding, 'DancerIcon');
export const LocationIcon = createLucideIcon(MapPin, 'LocationIcon');
export const CalendarIcon = createLucideIcon(CalendarDays, 'CalendarIcon');
export const MusicIcon = createLucideIcon(Music, 'MusicIcon');
export const RefreshIcon = createLucideIcon(RefreshCw, 'RefreshIcon');
export const BadgeIcon = createLucideIcon(BadgeCheck, 'BadgeIcon');
export const MicrophoneIcon = createLucideIcon(Mic, 'MicrophoneIcon');
export const CameraIcon = createLucideIcon(Camera, 'CameraIcon');
export const TelevisionIcon = createLucideIcon(Monitor, 'TelevisionIcon');
export const PartyIcon = createLucideIcon(PartyPopper, 'PartyIcon');
export const MasksIcon = createLucideIcon(Drama, 'MasksIcon');
export const GraduationIcon = createLucideIcon(GraduationCap, 'GraduationIcon');
export const CarIcon = createLucideIcon(Car, 'CarIcon');
export const VolumeIcon = createLucideIcon(Volume2, 'VolumeIcon');
export const BriefcaseIcon = createLucideIcon(Briefcase, 'BriefcaseIcon');
export const TargetIcon = createLucideIcon(Goal, 'TargetIcon');
export const HandshakeIcon = createLucideIcon(Handshake, 'HandshakeIcon');
export const LightbulbIcon = createLucideIcon(Lightbulb, 'LightbulbIcon');
export const QuoteIcon = createLucideIcon(MessageSquareQuote, 'QuoteIcon');
export const FacebookIcon = createLucideIcon(Facebook, 'FacebookIcon');
export const LinkedinIcon = createLucideIcon(Linkedin, 'LinkedinIcon');
export const SpotifyIcon = createLucideIcon(Spotify, 'SpotifyIcon');
export const YoutubeIcon = createLucideIcon(Youtube, 'YoutubeIcon');

export const icons = {
  'icon-wedding': WeddingIcon,
  'icon-corporate': CorporateIcon,
  'icon-private-party': PrivatePartyIcon,
  'icon-sax': SaxIcon,
  'icon-headphones': HeadphonesIcon,
  'icon-dj-booth': DjBoothIcon,
  'icon-festival': FestivalIcon,
  'icon-sparkles': SparklesIcon,
  'icon-star': StarIcon,
  'icon-dancer': DancerIcon,
  'icon-location': LocationIcon,
  'icon-calendar': CalendarIcon,
  'icon-music': MusicIcon,
  'icon-refresh': RefreshIcon,
  'icon-badge': BadgeIcon,
  'icon-microphone': MicrophoneIcon,
  'icon-camera': CameraIcon,
  'icon-tv': TelevisionIcon,
  'icon-party': PartyIcon,
  'icon-masks': MasksIcon,
  'icon-graduation': GraduationIcon,
  'icon-car': CarIcon,
  'icon-volume': VolumeIcon,
  'icon-briefcase': BriefcaseIcon,
  'icon-target': TargetIcon,
  'icon-handshake': HandshakeIcon,
  'icon-lightbulb': LightbulbIcon,
  'icon-quote': QuoteIcon,
  'icon-facebook': FacebookIcon,
  'icon-linkedin': LinkedinIcon,
  'icon-spotify': SpotifyIcon,
  'icon-youtube': YoutubeIcon,
};

export const Icon = forwardRef(function Icon({ name, fallback = null, ...props }, ref) {
  const Component = icons[name];
  if (!Component) {
    return typeof fallback === 'function' ? fallback() : fallback;
  }

  return <Component ref={ref} {...props} />;
});

export default icons;
