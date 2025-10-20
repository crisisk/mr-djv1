import React from 'react';
import { Helmet } from 'react-helmet';
import SlideLayout from '../common/SlideLayout.jsx';
import { Button } from '../ui/button.jsx';
import {
  generateServiceSchema,
  generateBreadcrumbSchema,
  generateWebPageSchema,
} from '../../utils/schemaOrg.js';

const services = [
  {
    name: 'Bruiloft DJ',
    highlight: 'Romantische openingsdans, 100% dansgarantie en persoonlijke intake.',
    pricing: {
      startingPrice: 1295,
      label: 'Bruiloft pakketten vanaf €1.295',
    },
  },
  {
    name: 'Bedrijfsfeest DJ',
    highlight: 'Corporate energie met live sax, branding en hybride opties.',
    pricing: {
      startingPrice: 1495,
      label: 'Bedrijfsfeesten vanaf €1.495',
    },
  },
  {
    name: 'Private events',
    highlight: 'Maatwerk muziek, licht en MC voor verjaardagen en jubilea.',
    pricing: {
      startingPrice: 995,
      label: 'Privéfeesten vanaf €995',
    },
  },
];

const servicePageMeta = {
  title: 'DJ Services van Mister DJ',
  description:
    'Ontdek onze bruiloft, bedrijfsfeest en privé event DJ services met persoonlijke intake, live sax-opties en 100% dansgarantie.',
  url: 'https://www.mrdj.nl/services',
};

const breadcrumbs = [
  { name: 'Home', url: 'https://www.mrdj.nl/' },
  { name: 'Services', url: servicePageMeta.url },
];

const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
const webPageSchema = generateWebPageSchema({
  title: servicePageMeta.title,
  description: servicePageMeta.description,
  url: servicePageMeta.url,
  breadcrumbs,
});

const serviceSchemas = services.map((service) => {
  const schema = generateServiceSchema({
    serviceName: `${service.name} Service`,
    description: service.highlight,
    serviceType: 'Entertainment Service',
  });

  if (schema?.offers?.priceSpecification && service.pricing) {
    schema.offers.priceSpecification.price = String(service.pricing.startingPrice);
    schema.offers.priceSpecification.description = service.pricing.label;
  }

  return schema;
});

const ServicePage = () => (
  <>
    <Helmet>
      <title>{servicePageMeta.title}</title>
      <meta name="description" content={servicePageMeta.description} />
      <link rel="canonical" href={servicePageMeta.url} />
      <script type="application/ld+json">{JSON.stringify(webPageSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      {serviceSchemas.map((schema) => (
        <script key={schema.name} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>

    <SlideLayout
      title="Template: Service Page"
      subtitle="Opbouw voor de drie hoofddiensten inclusief hero, USP’s en conversie blokken."
    >
      <div className="grid gap-spacing-xl md:grid-cols-[2fr,1fr]">
        <section className="space-y-spacing-md rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-xl shadow-lg">
          <h3 className="text-font-size-h3 font-semibold text-neutral-dark">Hero</h3>
          <p className="text-sm text-neutral-gray-600">
            Start met een hero waarin de dienstnaam, duidelijke belofte en primaire CTA centraal staan. Voeg badges toe (ervaring, reviews) voor vertrouwen.
          </p>
          <div className="space-y-spacing-sm">
            {services.map((service) => (
              <div key={service.name} className="rounded-3xl border border-neutral-gray-100 bg-neutral-light px-spacing-lg py-spacing-md shadow-sm">
                <p className="text-sm font-semibold text-neutral-dark">{service.name}</p>
                <p className="text-xs text-neutral-gray-500">{service.highlight}</p>
                <p className="text-xs font-semibold text-primary">{service.pricing.label}</p>
              </div>
            ))}
          </div>
        </section>
        <aside className="space-y-spacing-md rounded-3xl border border-primary/20 bg-primary/5 p-spacing-xl shadow-lg">
          <h3 className="text-font-size-h3 font-semibold text-neutral-dark">Call-to-action</h3>
          <p className="text-sm text-neutral-dark">
            Plaats een availability checker en toon secundaire CTA voor consult of brochure.
          </p>
          <Button size="lg" className="w-full">
            Start booking
          </Button>
        </aside>
      </div>
    </SlideLayout>
  </>
);

export default ServicePage;
