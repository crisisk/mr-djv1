const structuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Mister DJ",
  url: "https://mr-dj.sevensa.nl",
  areaServed: ["Noord-Brabant", "Limburg"],
  address: { "@type": "PostalAddress", addressCountry: "NL" },
  sameAs: [],
};

export default function StructuredData() {
  const jsonLd = JSON.stringify(structuredData).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd }}
    />
  );
}
