import Link from "next/link";
import regions from "@/content/regions.json";

type RegionCity = {
  slug: string;
  name: string;
};

type RegionData = {
  cities: RegionCity[];
};

const regionData = regions as RegionData;

export default function RegionLinks({ max = regionData.cities.length }: { max?: number }) {
  return (
    <nav aria-label="Regio's" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {regionData.cities.slice(0, max).map((city) => (
        <Link key={city.slug} className="underline transition hover:no-underline" href={`/regio/${city.slug}`}>
          DJ {city.name}
        </Link>
      ))}
    </nav>
  );
}
