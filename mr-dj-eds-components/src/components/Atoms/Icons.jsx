import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Building2,
  Facebook,
  Headphones,
  Instagram,
  Linkedin,
  MapPin,
  MessageCircle,
  Music2,
  PartyPopper,
  Saxophone,
  Sparkles,
  Spotify,
  Star,
  Youtube,
} from 'lucide-react';
import SlideLayout from '../common/SlideLayout.jsx';

const iconGroups = [
  {
    title: 'Services',
    description: 'Iconen voor kernservices en unieke proposities.',
    icons: [
      { label: 'Bruiloft DJ', Icon: Music2 },
      { label: 'Premium Ervaring', Icon: Sparkles },
      { label: 'Bedrijfsfeest', Icon: Building2 },
      { label: 'Private Party', Icon: PartyPopper },
      { label: 'DJ + Sax', Icon: Saxophone },
      { label: 'Silent Disco', Icon: Headphones },
    ],
  },
  {
    title: 'Conversie & Vertrouwen',
    description: 'Gebruik in formulieren, CTA’s en social proof blokken.',
    icons: [
      { label: 'Beschikbaarheid', Icon: Calendar },
      { label: 'Locatie', Icon: MapPin },
      { label: 'Contact', Icon: MessageCircle },
      { label: 'Review Score', Icon: Star },
      { label: 'Gegarandeerde kwaliteit', Icon: CheckCircle2 },
    ],
  },
  {
    title: 'Social & Media',
    description: 'Kanaalspecifieke iconen voor footers en dashboard.',
    icons: [
      { label: 'Facebook', Icon: Facebook },
      { label: 'Instagram', Icon: Instagram },
      { label: 'LinkedIn', Icon: Linkedin },
      { label: 'Spotify', Icon: Spotify },
      { label: 'YouTube', Icon: Youtube },
    ],
  },
];

const IconCard = ({ Icon, label }) => (
  <div className="flex flex-col items-center gap-spacing-sm rounded-2xl border border-neutral-gray-100 bg-neutral-light/80 p-spacing-md text-center shadow-sm">
    <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
      <Icon className="size-6" aria-hidden />
    </div>
    <p className="text-sm font-semibold text-neutral-dark">{label}</p>
  </div>
);

const Icons = () => (
  <SlideLayout
    title="Atoms: Iconography"
    subtitle="Lucide iconen gemapt op Mister DJ scenario’s voor consistente visuals over alle touchpoints."
  >
    <div className="grid gap-spacing-xl md:grid-cols-3">
      {iconGroups.map((group) => (
        <div key={group.title} className="space-y-spacing-md">
          <div>
            <h3 className="text-font-size-h3 font-bold text-primary">{group.title}</h3>
            <p className="text-sm text-neutral-gray-500">{group.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-spacing-md">
            {group.icons.map(({ label, Icon }) => (
              <IconCard key={label} Icon={Icon} label={label} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </SlideLayout>
);

export default Icons;
