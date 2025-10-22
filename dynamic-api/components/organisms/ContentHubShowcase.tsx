'use client';

import React from 'react';
import { motion } from 'framer-motion';
import OptimizedVideo from '../atoms/OptimizedVideo';

interface Resource {
  title: string;
  type: string;
  duration: string;
  link: string;
}

interface Spotlight {
  client: string;
  metric: string;
  quote: string;
}

interface Hero {
  label: string;
  videoUrl?: string;
  poster?: string;
}

interface ContentSection {
  id: string;
  title: string;
  description: string;
  hero?: Hero;
  resources?: Resource[];
  spotlight?: Spotlight;
}

interface ContentHubShowcaseProps {
  sections?: ContentSection[];
  className?: string;
}

const defaultSections: ContentSection[] = [
  {
    id: 'weddings',
    title: 'Bruiloft Content Hub',
    description: 'Complete content suite voor bruiloft leads: van eerste touchpoint tot na-event nurture.',
    hero: {
      label: 'Hero Video',
      videoUrl: '/media/videos/hero/wedding-testimonial.mp4',
      poster: '/media/optimized/thumbnails/wedding-poster.jpg'
    },
    resources: [
      { title: 'Bruiloft Planning Guide', type: 'PDF', duration: '12 pagina\'s', link: '#' },
      { title: 'Muziekvoorkeur Checklist', type: 'Downloadable', duration: '2 min', link: '#' },
      { title: 'Video Testimonials', type: 'Video Gallery', duration: '8 videos', link: '#' }
    ],
    spotlight: {
      client: 'Lisa & Mark - Kasteel Maurick',
      metric: '250 gasten · 98% dansplaat · 9.9/10',
      quote: '"De perfecte mix tussen romantische momenten en een volle dansvloer. Iedereen heeft het er nog over!"'
    }
  }
];

/**
 * ContentHubShowcase Component
 * Displays content hubs with videos, resources, and testimonials
 */
const ContentHubShowcase: React.FC<ContentHubShowcaseProps> = ({
  sections = defaultSections,
  className = ''
}) => {
  if (!Array.isArray(sections) || sections.length === 0) {
    return null;
  }

  return (
    <section className={`bg-white py-spacing-3xl ${className}`}>
      <div className="container-pro space-y-spacing-2xl">
        <header className="space-y-spacing-sm text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-primary">Content & Automation Hub</p>
          <h2 className="text-font-size-h2 font-bold text-neutral-dark">Voed je nurture flows met bewezen content</h2>
          <p className="mx-auto max-w-3xl text-gray-600">
            Elke hub bevat video testimonials, downloadables en automation instructies die direct aansluiten op de CRM koppeling.
          </p>
        </header>

        <div className="grid gap-spacing-2xl">
          {sections.map((section, index) => (
            <motion.article
              key={section.id}
              className="grid gap-spacing-xl rounded-3xl border border-gray-200 bg-white shadow-lg md:grid-cols-[3fr,2fr]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              <div className="space-y-spacing-lg p-spacing-xl">
                <div className="space-y-spacing-xs">
                  <span className="text-xs uppercase tracking-wide text-primary">{section.hero?.label}</span>
                  <h3 className="text-font-size-h3 font-semibold text-neutral-dark">{section.title}</h3>
                  <p className="text-gray-600">{section.description}</p>
                </div>
                {section.hero?.videoUrl && (
                  <OptimizedVideo
                    src={section.hero.videoUrl}
                    poster={section.hero.poster}
                    controls={true}
                    className="w-full"
                  />
                )}
                {section.resources && section.resources.length > 0 && (
                  <div className="space-y-spacing-sm">
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-700">Resources</h4>
                    <ul className="space-y-spacing-xs text-sm">
                      {section.resources.map((resource, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-spacing-md py-spacing-sm"
                        >
                          <div>
                            <p className="font-semibold text-neutral-dark">{resource.title}</p>
                            <p className="text-xs text-gray-600">{resource.type} · {resource.duration}</p>
                          </div>
                          <a
                            href={resource.link}
                            className="text-sm font-semibold text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary transition-colors"
                          >
                            Open
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {section.spotlight && (
                <div className="flex flex-col justify-between gap-spacing-lg rounded-3xl rounded-l-none border-l border-gray-200 bg-neutral-dark p-spacing-xl text-white">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-secondary">Spotlight</p>
                    <p className="text-lg font-semibold mt-2">{section.spotlight.client}</p>
                    <p className="text-sm text-secondary mt-1">{section.spotlight.metric}</p>
                    <p className="mt-spacing-md text-sm text-white/80 italic">{section.spotlight.quote}</p>
                  </div>
                  <p className="text-xs text-white/60">
                    Klaar voor automation: synchroniseer resources met je CRM en push leads voor scoring.
                  </p>
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContentHubShowcase;
