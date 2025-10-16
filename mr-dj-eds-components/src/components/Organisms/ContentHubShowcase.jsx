import React from 'react';
import { CONTENT_HUB_SECTIONS } from '../../data/contentHub.js';

const ContentHubShowcase = ({ sections = CONTENT_HUB_SECTIONS }) => {
  if (!Array.isArray(sections) || sections.length === 0) {
    return null;
  }

  return (
    <section className="bg-neutral-light py-spacing-3xl">
      <div className="container mx-auto space-y-spacing-2xl px-spacing-md">
        <header className="space-y-spacing-sm text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-primary">Content & Automation Hub</p>
          <h2 className="text-font-size-h2 font-bold text-neutral-dark">Voed je nurture flows met bewezen content</h2>
          <p className="mx-auto max-w-3xl text-neutral-dark/70">
            Elke hub bevat video testimonials, downloadables en automation instructies die direct aansluiten op de RentGuy CRM
            koppeling.
          </p>
        </header>

        <div className="grid gap-spacing-2xl">
          {sections.map((section) => (
            <article
              key={section.id}
              className="grid gap-spacing-xl rounded-3xl border border-neutral-gray-200 bg-neutral-light shadow-lg md:grid-cols-[3fr,2fr]"
            >
              <div className="space-y-spacing-lg p-spacing-xl">
                <div className="space-y-spacing-xs">
                  <span className="text-xs uppercase tracking-wide text-primary">{section.hero?.label}</span>
                  <h3 className="text-font-size-h3 font-semibold text-neutral-dark">{section.title}</h3>
                  <p className="text-neutral-dark/70">{section.description}</p>
                </div>
                {section.hero?.videoUrl && (
                  <video
                    controls
                    playsInline
                    poster={section.hero.poster}
                    className="w-full rounded-2xl border border-neutral-gray-200"
                  >
                    <source src={section.hero.videoUrl} type="video/mp4" />
                  </video>
                )}
                <div className="space-y-spacing-sm">
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-neutral-dark/80">Resources</h4>
                  <ul className="space-y-spacing-xs text-sm text-neutral-dark/80">
                    {section.resources?.map((resource) => (
                      <li
                        key={resource.title}
                        className="flex items-center justify-between rounded-xl border border-neutral-gray-100 bg-neutral-light px-spacing-md py-spacing-sm"
                      >
                        <div>
                          <p className="font-semibold text-neutral-dark">{resource.title}</p>
                          <p className="text-xs text-neutral-dark/60">{resource.type} · {resource.duration}</p>
                        </div>
                        <a
                          href={resource.link}
                          className="text-sm font-semibold text-primary underline decoration-primary/40 underline-offset-4"
                        >
                          Open
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex flex-col justify-between gap-spacing-lg rounded-3xl rounded-l-none border-l border-neutral-gray-200 bg-neutral-dark/95 p-spacing-xl text-neutral-light">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-secondary/80">Spotlight</p>
                  <p className="text-font-size-h4 font-semibold">{section.spotlight?.client}</p>
                  <p className="text-sm text-secondary">{section.spotlight?.metric}</p>
                  <p className="mt-spacing-md text-sm text-neutral-light/80">{section.spotlight?.quote}</p>
                </div>
                <p className="text-xs text-neutral-light/60">
                  Klaar voor automation: synchroniseer resources met HubSpot submit URL via het Config Dashboard en push leads naar
                  RentGuy voor scoring.
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContentHubShowcase;
