export default function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Mister DJ",
    url: "https://mr-dj.sevensa.nl",
    areaServed: ["Noord-Brabant", "Limburg"],
    address: { "@type": "PostalAddress", addressCountry: "NL" },
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
