import "server-only";

import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { draftMode } from "next/headers";

import { defaultLocale, isLocale, locales, type Locale } from "@/i18n/locales";
import { absoluteUrl, HOME_SLUG, pagePath, unprefixedPath } from "@/lib/urls";

import type { PAGE_QUERY_RESULT } from "../types";
import { client } from "./client";
import { draftClient } from "./draft-client";
import { sanityFetch } from "./fetch";
import { PAGE_PARAMS_QUERY, PAGE_QUERY, SITEMAP_QUERY } from "./queries";
import { cacheTags } from "./tags";

export { HOME_SLUG };

export type Page = NonNullable<PAGE_QUERY_RESULT>;

export type LocalizedPage =
  /** `isFallback`: the requested locale has no version, so the default locale's is served. */
  | { status: "found"; page: Page; isFallback: boolean }
  /** The requested URL is a fallback, but a translation now exists under a different slug. */
  | { status: "redirect"; slug: string }
  | { status: "missing" };

/**
 * One page for one locale, with fallback to the default locale.
 *
 * The cache entry is tagged for the *requested* locale first, so a fallback render is
 * refreshed the moment a real translation is published at that URL. When it does fall
 * back it is also tagged for the default locale's page, so editing the source page
 * refreshes every fallback that shows it. Both reads happen in this one function, in one
 * consistent snapshot, so the tags always describe exactly what was rendered.
 *
 * In Draft Mode Next.js re-runs this on every request and never stores the result.
 */
export async function getLocalizedPage(locale: Locale, slug: string): Promise<LocalizedPage> {
  "use cache";
  cacheLife("max");
  cacheTag(cacheTags.page(locale, slug));

  const { isEnabled: isDraft } = await draftMode();
  const sanity = isDraft ? draftClient : client;

  const own = await sanity.fetch(PAGE_QUERY, { slug, language: locale });
  if (own) return { status: "found", page: own, isFallback: false };
  if (locale === defaultLocale) return { status: "missing" };

  cacheTag(cacheTags.page(defaultLocale, slug));
  const source = await sanity.fetch(PAGE_QUERY, { slug, language: defaultLocale });
  if (!source) return { status: "missing" };

  // /fr/pricing serves English until French is published as /fr/tarifs: from then on
  // the old URL should lead to the real page. Temporary, since the translation can be
  // unpublished again.
  const translated = source.translations?.find((t) => t.language === locale);
  if (translated?.slug && translated.slug !== slug) return { status: "redirect", slug: translated.slug };

  return { status: "found", page: source, isFallback: true };
}

export async function getPageParams() {
  const pages = (await sanityFetch({ query: PAGE_PARAMS_QUERY, tags: [cacheTags.pageList] })) ?? [];
  const real = pages.flatMap((p) => (p.language && isLocale(p.language) && p.slug ? [{ locale: p.language, slug: p.slug }] : []));

  // Also prebuild the fallback URL of every default-locale page in every other locale.
  const fallbacks = real
    .filter((p) => p.locale === defaultLocale)
    .flatMap((p) => locales.filter((l) => l !== defaultLocale).map((locale) => ({ locale, slug: p.slug })));

  const seen = new Set<string>();
  return [...real, ...fallbacks].filter(({ locale, slug }) => {
    const id = `${locale}/${slug}`;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

export function getSitemapPages() {
  return sanityFetch({ query: SITEMAP_QUERY, tags: [cacheTags.pageList] });
}

/** How a kind of document (page, post) maps to URLs. */
export type DocKind = {
  full: (locale: Locale, slug: string) => string;
  /** Path without the locale prefix. */
  bare: (slug: string) => string;
  /** Where the switcher sends a visitor when the document has no version to show at all. */
  missing: string;
};
export const pageKind: DocKind = { full: pagePath, bare: unprefixedPath, missing: "/" };

type Translation = { language: string | null; slug: string | null; noindex?: boolean | null };
type Versioned = Pick<Page, "language" | "slug"> & { noindex?: boolean | null; translations: Translation[] | null };
type Versions = Partial<Record<Locale, { slug: string; noindex: boolean }>>;

/** Published language versions of a page, keyed by locale. Includes the page itself. */
export function realVersions(page: Versioned): Versions {
  const versions: Versions = {};
  const add = (t: Translation) => {
    if (t.language && isLocale(t.language) && t.slug) versions[t.language] = { slug: t.slug, noindex: t.noindex === true };
  };
  for (const t of page.translations ?? []) add(t);
  // A page that was never linked to a translation set still is a version of itself.
  if (page.language && isLocale(page.language) && !versions[page.language]) {
    add({ language: page.language, slug: page.slug, noindex: page.noindex });
  }
  return versions;
}

/**
 * hreflang alternates: only real, indexable translations, so a fallback is never
 * advertised as a locale's version. x-default is the default-locale version when there
 * is one, otherwise the page itself (its only version). URLs are absolute and
 * percent-encoded, as hreflang requires.
 */
export function alternateLanguages(page: Versioned, ownUrl: string, kind: DocKind = pageKind): Record<string, string> {
  const versions = realVersions(page);
  const languages: Record<string, string> = {};
  for (const l of locales) {
    const version = versions[l];
    if (version && !version.noindex) languages[l] = absoluteUrl(kind.full(l, version.slug));
  }
  languages["x-default"] = languages[defaultLocale] ?? ownUrl;
  return languages;
}

export type LocaleLink = {
  locale: Locale;
  /** Path without the locale prefix; the switcher's locale-aware Link adds it. */
  path: string;
  /** A real, published version exists in this locale. */
  translated: boolean;
  current: boolean;
};

/**
 * Where the language switcher sends the visitor for each locale, staying on the same page:
 *
 *  - a real translation: its own URL (slugs are localised, so it may differ);
 *  - none, but the page has a default-locale source: the fallback URL, which serves the
 *    source with a "not yet translated" notice, in that locale's chrome;
 *  - a page with no default-locale source either: that locale's homepage.
 */
export function localeLinks(page: Versioned, requested: Locale, kind: DocKind = pageKind): LocaleLink[] {
  const versions = realVersions(page);
  const source = versions[defaultLocale]?.slug;

  return locales.map((locale) => {
    const real = versions[locale];
    const slug = real?.slug ?? source;
    return { locale, path: slug ? kind.bare(slug) : kind.missing, translated: Boolean(real), current: locale === requested };
  });
}

/** Page-level metadata: title, robots, canonical and hreflang, all derived from the CMS. */
export function pageMetadata(result: { page: Page; isFallback: boolean }, locale: Locale): Metadata {
  const { page, isFallback } = result;
  const slug = page.slug ?? HOME_SLUG;

  // The homepage's title is the site name, which the title template would repeat.
  const title = page.title && slug !== HOME_SLUG ? { title: page.title } : {};
  const description = { description: page.description ?? undefined };

  if (isFallback) {
    // Not a translation, so never advertised as one: no hreflang and not indexed.
    // Deliberately no canonical: noindex plus a canonical to another URL sends
    // contradictory signals (drop this page / consolidate it into that one).
    return { ...title, ...description, robots: { index: false, follow: true } };
  }

  const own = absoluteUrl(pagePath(locale, slug));
  if (page.noindex) return { ...title, ...description, robots: { index: false, follow: false }, alternates: { canonical: own } };

  return { ...title, ...description, alternates: { canonical: own, languages: alternateLanguages(page, own) } };
}
