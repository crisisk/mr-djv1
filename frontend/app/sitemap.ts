import type { MetadataRoute } from "next";
import regions from "@/content/regions.json";

type RegionCity = {
  slug: string;
};

type RegionData = {
  cities: RegionCity[];
};

const regionData = regions as RegionData;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://mr-dj.sevensa.nl";

  const baseEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/diensten`, changeFrequency: "monthly" },
    { url: `${base}/pakketten`, changeFrequency: "monthly" },
    { url: `${base}/contact`, changeFrequency: "monthly" },
  ];

  const regionEntries: MetadataRoute.Sitemap = regionData.cities.map((city) => ({
    url: `${base}/regio/${city.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...baseEntries, ...regionEntries];
}
