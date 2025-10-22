/* eslint-disable react-refresh/only-export-components */
import regions from "@/content/regions.json";

type RegionCity = {
  slug: string;
  name: string;
};

type RegionData = {
  cities: RegionCity[];
};

const regionData = regions as RegionData;

export async function generateStaticParams() {
  return regionData.cities.map((city) => ({ city: city.slug }));
}

export function generateMetadata({ params }: { params: { city: string } }) {
  const city = regionData.cities.find((entry) => entry.slug === params.city);
  const title = city ? `DJ in ${city.name} — Mister DJ` : "DJ in jouw regio — Mister DJ";

  return {
    title,
    description: `Professionele DJ voor ${city?.name ?? "jouw regio"} — pakketten op maat, snelle reactie, lokaal georiënteerd.`,
    alternates: { canonical: `https://mr-dj.sevensa.nl/regio/${params.city}` },
  };
}

export default function CityPage({ params }: { params: { city: string } }) {
  const city = regionData.cities.find((entry) => entry.slug === params.city);

  if (!city) {
    return null;
  }

  const canonicalUrl = `https://mr-dj.sevensa.nl/regio/${params.city}`;
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Mister DJ",
      areaServed: city.name,
      url: canonicalUrl,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://mr-dj.sevensa.nl/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: `DJ in ${city.name}`,
          item: canonicalUrl,
        },
      ],
    },
  ];

  return (
    <main className="prose mx-auto px-4 py-10">
      <nav aria-label="Breadcrumb" className="not-prose mb-4 text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <a className="hover:text-slate-700" href="/">
              Home
            </a>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-slate-600">
            DJ in {city.name}
          </li>
        </ol>
      </nav>
      <h1>Mister DJ in {city.name}</h1>
      <p>
        Zoek je een DJ in {city.name}? Wij leveren pakketten op maat voor bruiloften en bedrijfsfeesten in {city.name} en
        omgeving.
      </p>
      <ul className="list-disc pl-5">
        <li>Snelle offerte en duidelijke prijzen</li>
        <li>Lokale betrokkenheid en persoonlijke aanpak</li>
        <li>Professionele setup, licht & geluid</li>
      </ul>
      <a className="btn btn-primary mt-6" href="/contact">
        Vraag offerte aan
      </a>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </main>
  );
}
