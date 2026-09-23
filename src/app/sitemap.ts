import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { articles } from "@/data/articles";
import { calculators } from "@/lib/calculators/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, priority: 1 },
    { url: `${site.url}/house`, priority: 0.9 },
    ...calculators.map((c) => ({ url: `${site.url}/${c.slug}`, priority: 0.8 })),
    { url: `${site.url}/guide`, priority: 0.7 },
    ...articles.map((a) => ({
      url: `${site.url}/guide/${a.slug}`,
      lastModified: a.publishedAt,
      priority: 0.6,
    })),
    { url: `${site.url}/specs`, priority: 0.7 },
    { url: `${site.url}/about`, priority: 0.5 },
    { url: `${site.url}/contact`, priority: 0.4 },
    { url: `${site.url}/privacy`, priority: 0.3 },
  ];
}
