import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { calculators } from "@/lib/calculators/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, priority: 1 },
    ...calculators.map((c) => ({ url: `${site.url}/${c.slug}`, priority: 0.8 })),
  ];
}
