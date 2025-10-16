import React from 'react';
import SlideLayout from '../common/SlideLayout.jsx';

const techStack = ['React 19 + Vite', 'Tailwind 4 (tokens via JSON)', 'Storybook 9', 'Jest + Testing Library', 'Playwright smoke tests'];
const workflow = ['Design sign-off in Figma', 'Component build & Storybook review', 'Peer review + testing', 'Release via CI/CD'];
const bestPractices = ['Gebruik design tokens voor alle styling', 'Documenteer varianten in Storybook', 'Schrijf tests voor states & edge cases', 'Monitor Core Web Vitals na livegang'];

const ImplementationGuide = () => (
  <SlideLayout
    title="Implementation Guide"
    subtitle="Stap-voor-stap handleiding voor teams die het Mister DJ EDS implementeren."
  >
    <div className="space-y-spacing-xl">
      <section className="grid gap-spacing-xl md:grid-cols-3">
        <div className="space-y-spacing-md rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-xl shadow-md">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">Tech stack</h3>
          <ul className="space-y-spacing-xs text-sm text-neutral-dark">
            {techStack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-spacing-md rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-xl shadow-md">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">Workflow</h3>
          <ol className="space-y-spacing-xs text-sm text-neutral-dark">
            {workflow.map((item, index) => (
              <li key={item} className="flex gap-spacing-sm">
                <span className="text-primary">{index + 1}.</span>
                {item}
              </li>
            ))}
          </ol>
        </div>
        <div className="space-y-spacing-md rounded-3xl border border-primary/20 bg-primary/5 p-spacing-xl shadow-md">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">Best practices</h3>
          <ul className="space-y-spacing-xs text-sm text-neutral-dark">
            {bestPractices.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
      <section className="rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-xl shadow-lg">
        <h3 className="text-font-size-h3 font-semibold text-neutral-dark">Component structuur</h3>
        <pre className="mt-spacing-md overflow-x-auto rounded-2xl bg-neutral-dark/90 p-spacing-md text-xs text-neutral-light">
{`src/
  components/
    Atoms/
    Molecules/
    Organisms/
    Templates/
  lib/design-tokens.json
  styles/
`}
        </pre>
      </section>
    </div>
  </SlideLayout>
);

export default ImplementationGuide;
