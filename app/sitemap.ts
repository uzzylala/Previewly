import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site";
import { getSitemapPages, HOME_SLUG } from "@/sanity/lib/pages";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = (await getSitemapPages()) ?? [];

  return pages.flatMap((page) =>
    page.slug
      ? [
          {
            url: page.slug === HOME_SLUG ? siteUrl : `${siteUrl}/${page.slug}`,
            lastModified: page._updatedAt,
          },
        ]
      : [],
  );
}
