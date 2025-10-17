import React from 'react';
import SlideLayout from '../common/SlideLayout.jsx';
import { Button } from '../ui/button.jsx';

const ErrorPages = () => (
  <SlideLayout
    title="Templates: Error Pages"
    subtitle="Consistente fout- en leegstaten die gebruikers begeleiden en vertrouwen behouden."
  >
    <div className="grid gap-spacing-xl md:grid-cols-2">
      <section className="space-y-spacing-md rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-xl text-center shadow-lg">
        <h3 className="text-font-size-h1 font-extrabold text-primary">404</h3>
        <p className="text-sm text-neutral-gray-600">We konden deze pagina niet vinden, maar helpen graag verder.</p>
        <div className="flex flex-wrap justify-center gap-spacing-sm">
          <Button size="lg">Terug naar home</Button>
          <Button variant="outline" size="lg">Plan een intake</Button>
        </div>
      </section>
      <section className="space-y-spacing-md rounded-3xl border border-neutral-gray-100 bg-primary/5 p-spacing-xl text-center shadow-lg">
        <h3 className="text-font-size-h1 font-extrabold text-primary">500</h3>
        <p className="text-sm text-neutral-dark/80">
          Er ging iets mis. Ons team is op de hoogte gesteld en lost dit zo snel mogelijk op.
        </p>
        <Button variant="secondary" size="lg" className="mx-auto">
          Stuur een bericht
        </Button>
      </section>
    </div>
  </SlideLayout>
);

export default ErrorPages;
