import React from 'react';
import SlideLayout from '../common/SlideLayout.jsx';

const CoverPage = () => (
  <SlideLayout
    title="Mister DJ Enterprise Design System"
    subtitle="Brand guidelines, component library en launch playbook voor high-converting experiences."
    variant="brand"
    align="center"
  >
    <div className="flex flex-col items-center gap-spacing-lg">
      <div className="flex size-24 items-center justify-center rounded-full bg-primary text-4xl font-extrabold text-neutral-dark shadow-lg">
        DJ
      </div>
      <p className="text-font-size-body text-neutral-light/80 max-w-2xl">
        Eén centrale bron met tokens, componenten en documentatie zodat design, marketing en development synchroon werken.
      </p>
    </div>
  </SlideLayout>
);

export default CoverPage;
