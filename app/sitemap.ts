import type { MetadataRoute } from "next";

import { isLocale, defaultLocale, locales } from "@/i18n/locales";
import { absoluteUrl, blogPath, pagePath, postPath } from "@/lib/urls";
import { alternateLanguages, getSitemapPages, pageKind } from "@/sanity/lib/pages";
import { getSitemapPosts, postKind } from "@/sanity/lib/posts";

/**
 * Every real page and post in every locale, one entry each, each declaring its real
 * translations as hreflang alternates, plus each locale's blog index. Fallback URLs (an
 * English page served at /fr/...) are not pages in their own right and are left out.
 * Slugs are percent-encoded, so Arabic URLs are valid.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, posts] = await Promise.all([getSitemapPages(), getSitemapPosts()]);

  const pageEntries = (pages ?? []).flatMap((page) => {
    if (!page.slug || !page.language || !isLocale(page.language)) return [];
    const url = absoluteUrl(pagePath(page.language, page.slug));
    return [{ url, lastModified: page._updatedAt, alternates: { languages: alternateLanguages(page, url, pageKind) } }];
  });

  const postEntries = (posts ?? []).flatMap((post) => {
    if (!post.slug || !post.language || !isLocale(post.language)) return [];
    const url = absoluteUrl(postPath(post.language, post.slug));
    return [{ url, lastModified: post._updatedAt, alternates: { languages: alternateLanguages(post, url, postKind) } }];
  });

  // The index exists in every locale (with that locale's posts), so all three are alternates.
  const indexLanguages = {
    ...Object.fromEntries(locales.map((l) => [l, absoluteUrl(blogPath(l))])),
    "x-default": absoluteUrl(blogPath(defaultLocale)),
  };
  const indexEntries = locales.map((locale) => ({
    url: absoluteUrl(blogPath(locale)),
    lastModified: (posts ?? [])
      .filter((p) => p.language === locale)
      .map((p) => p._updatedAt)
      .sort()
      .at(-1),
    alternates: { languages: indexLanguages },
  }));

  return [...pageEntries, ...indexEntries, ...postEntries];
}
