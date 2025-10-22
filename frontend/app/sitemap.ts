import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://mr-dj.sevensa.nl";
  const pages: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority?: number;
  }> = [
    { path: "/", changeFrequency: "weekly", priority: 1.0 },
    { path: "/diensten", changeFrequency: "monthly" },
    { path: "/pakketten", changeFrequency: "monthly" },
    { path: "/contact", changeFrequency: "monthly" },
  ];

  return pages.map(({ path, ...entry }) => ({
    url: path === "/" ? `${base}/` : `${base}${path}`,
    ...entry,
  }));
}
