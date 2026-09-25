import type { Locale } from "@/i18n/locales";

import { siteUrl } from "./site";

export const HOME_SLUG = "home";

/**
 * Path of a page: /<locale> for a homepage, /<locale>/<slug> otherwise. The slug is
 * percent-encoded, so a non-Latin slug ("من-نحن") becomes a valid URL everywhere it is
 * used: links, redirects, canonical, hreflang and the sitemap.
 */
export function pagePath(locale: Locale, slug: string): string {
  return slug === HOME_SLUG ? `/${locale}` : `/${locale}/${encodeURIComponent(slug)}`;
}

/** The same path without its locale prefix, for locale-aware links that add the prefix. */
export function unprefixedPath(slug: string): string {
  return slug === HOME_SLUG ? "/" : `/${encodeURIComponent(slug)}`;
}

export function absoluteUrl(path: string): string {
  return `${siteUrl}${path}`;
}

/**
 * Next hands a dynamic segment over in whichever form the request used, so "%D9%85..."
 * and "من" can both arrive. Slugs never contain "%", so decoding is always safe.
 */
export function decodeSlug(param: string): string {
  if (!param.includes("%")) return param;
  try {
    return decodeURIComponent(param);
  } catch {
    return param;
  }
}

export const BLOG_SEGMENT = "blog";

/** The blog index of a locale: /<locale>/blog. */
export function blogPath(locale: Locale): string {
  return `/${locale}/${BLOG_SEGMENT}`;
}

/** A post: /<locale>/blog/<slug>, percent-encoded like pages. */
export function postPath(locale: Locale, slug: string): string {
  return `${blogPath(locale)}/${encodeURIComponent(slug)}`;
}

/** The same path without its locale prefix, for locale-aware links that add the prefix. */
export function unprefixedPostPath(slug: string): string {
  return `/${BLOG_SEGMENT}/${encodeURIComponent(slug)}`;
}
