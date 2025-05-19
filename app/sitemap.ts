import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: process.env.NEXT_PUBLIC_URL ?? "",
      lastModified: new Date(),
      priority: 1,
      images: [new URL("/logo.png", process.env.NEXT_PUBLIC_URL).href],
    },
  ];
}
