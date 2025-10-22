import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://mr-dj.sevensa.nl";
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/diensten`, changeFrequency: "monthly" },
    { url: `${base}/pakketten`, changeFrequency: "monthly" },
    { url: `${base}/contact`, changeFrequency: "monthly" },
  ];
}
