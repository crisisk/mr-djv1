import React from 'react';
import SlideLayout from '../common/SlideLayout.jsx';
import releaseNotes from '../../data/releaseNotes.json';

const typeBadgeStyles = {
  FEAT: { backgroundColor: '#00AEEF', color: '#FFFFFF' },
  FIX: { backgroundColor: '#FF4D4D', color: '#FFFFFF' },
  DOCS: { backgroundColor: '#D4AF37', color: '#1A2C4B' },
};

const statusOpacity = {
  current: 1,
  upcoming: 0.8,
  future: 0.6,
};

const sortVersions = (versions) =>
  [...versions].sort((a, b) => {
    const orderA = typeof a.order === 'number' ? a.order : Number.MAX_SAFE_INTEGER;
    const orderB = typeof b.order === 'number' ? b.order : Number.MAX_SAFE_INTEGER;
    return orderA - orderB;
  });

const formatVersionLabel = (version, note) => (note ? `${version} (${note})` : version);

const Changelog = () => {
  const versions = sortVersions(releaseNotes.versions);
  const released = versions.filter((entry) => entry.status === 'current');
  const upcoming = versions.filter((entry) => entry.status !== 'current');

  return (
    <SlideLayout
      title="Changelog"
      subtitle="Versie-overzicht en roadmap voor het Mister DJ Enterprise Design System."
    >
      <div className="grid gap-spacing-xl md:grid-cols-2">
        <section className="space-y-spacing-md">
          <h3 className="text-font-size-h3 font-semibold text-neutral-dark">Releases</h3>
          <div className="space-y-spacing-md">
            {released.map((release) => (
              <article
                key={release.version}
                className="rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-xl shadow-md"
              >
                <div className="flex items-baseline justify-between">
                  <h4 className="text-font-size-h3 font-semibold text-primary">
                    {formatVersionLabel(release.version, release.note)}
                  </h4>
                  <span className="text-xs uppercase tracking-wide text-neutral-gray-500">
                    {release.date}
                  </span>
                </div>
                <ul className="mt-spacing-sm space-y-spacing-xs text-sm text-neutral-dark">
                  {release.changes.map((change) => {
                    const badgeStyle = typeBadgeStyles[change.type] || typeBadgeStyles.DOCS;
                    return (
                      <li key={`${release.version}-${change.description}`} className="flex gap-spacing-sm">
                        <span
                          className="inline-flex items-center rounded-md px-spacing-sm py-[2px] text-[11px] font-bold uppercase tracking-wide"
                          style={badgeStyle}
                        >
                          {change.type}
                        </span>
                        <span>{change.description}</span>
                      </li>
                    );
                  })}
                </ul>
              </article>
            ))}
          </div>
        </section>
        <section className="space-y-spacing-md">
          <h3 className="text-font-size-h3 font-semibold text-neutral-dark">Roadmap</h3>
          <div className="space-y-spacing-md">
            {upcoming.map((release) => (
              <article
                key={release.version}
                className="space-y-spacing-sm rounded-3xl border border-primary/20 bg-primary/5 p-spacing-xl shadow-sm transition"
                style={{ opacity: statusOpacity[release.status] ?? 0.75 }}
              >
                <div className="flex items-baseline justify-between">
                  <h4 className="text-font-size-h4 font-semibold text-primary">
                    {formatVersionLabel(release.version, release.note)}
                  </h4>
                  <span className="text-xs uppercase tracking-wide text-primary/80">{release.date}</span>
                </div>
                <ul className="space-y-spacing-xs text-sm text-neutral-dark">
                  {release.changes.map((change) => {
                    const badgeStyle = typeBadgeStyles[change.type] || typeBadgeStyles.DOCS;
                    return (
                      <li key={`${release.version}-${change.description}`} className="flex gap-spacing-sm">
                        <span
                          className="inline-flex items-center rounded-md px-spacing-sm py-[2px] text-[11px] font-bold uppercase tracking-wide"
                          style={badgeStyle}
                        >
                          {change.type}
                        </span>
                        <span>{change.description}</span>
                      </li>
                    );
                  })}
                </ul>
              </article>
            ))}
          </div>
        </section>
      </div>
    </SlideLayout>
  );
};

export default Changelog;
