import type { MetadataRoute } from "next";

import { isLocale } from "@/i18n/locales";
import { absoluteUrl, pagePath } from "@/lib/urls";
import { alternateLanguages, getSitemapPages } from "@/sanity/lib/pages";

/**
 * Every real page in every locale, one entry each, each declaring its real translations
 * as hreflang alternates. Fallback URLs (an English page served at /fr/...) are not pages
 * in their own right and are left out. Slugs are percent-encoded, so Arabic URLs are valid.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = (await getSitemapPages()) ?? [];

  return pages.flatMap((page) => {
    if (!page.slug || !page.language || !isLocale(page.language)) return [];
    const url = absoluteUrl(pagePath(page.language, page.slug));
    return [
      {
        url,
        lastModified: page._updatedAt,
        alternates: { languages: alternateLanguages(page, url) },
      },
    ];
  });
}
