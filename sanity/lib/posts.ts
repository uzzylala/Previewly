import "server-only";

import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { draftMode } from "next/headers";

import { defaultLocale, isLocale, localeMeta, locales, type Locale } from "@/i18n/locales";
import { absoluteUrl, postPath, unprefixedPostPath } from "@/lib/urls";

import type { POST_INDEX_QUERY_RESULT, POST_QUERY_RESULT } from "../types";
import { client } from "./client";
import { draftClient } from "./draft-client";
import { sanityFetch } from "./fetch";
import { ogImageUrl } from "./image";
import { alternateLanguages, realVersions, type DocKind } from "./pages";
import { POST_INDEX_QUERY, POST_PARAMS_QUERY, POST_QUERY, SITEMAP_POSTS_QUERY } from "./queries";
import { cacheTags } from "./tags";

export type Post = NonNullable<POST_QUERY_RESULT>;
export type PostSummary = POST_INDEX_QUERY_RESULT[number];

export const postKind: DocKind = { full: postPath, bare: unprefixedPostPath, missing: "/blog" };

export type LocalizedPost =
  | { status: "found"; post: Post; isFallback: boolean }
  | { status: "redirect"; slug: string }
  | { status: "missing" };

/**
 * One post for one locale, with the same fallback rules as pages: tagged for the
 * requested locale first (so a fallback refreshes when a real translation is published
 * at that URL) and, when it falls back, for the default-locale post too. If a
 * translation exists under a different slug, the old fallback URL redirects to it.
 */
export async function getLocalizedPost(locale: Locale, slug: string): Promise<LocalizedPost> {
  "use cache";
  cacheLife("max");
  cacheTag(cacheTags.post(locale, slug));

  const { isEnabled: isDraft } = await draftMode();
  const sanity = isDraft ? draftClient : client;

  const own = await sanity.fetch(POST_QUERY, { slug, language: locale });
  if (own) return { status: "found", post: own, isFallback: false };
  if (locale === defaultLocale) return { status: "missing" };

  cacheTag(cacheTags.post(defaultLocale, slug));
  const source = await sanity.fetch(POST_QUERY, { slug, language: defaultLocale });
  if (!source) return { status: "missing" };

  const translated = source.translations?.find((t) => t.language === locale);
  if (translated?.slug && translated.slug !== slug) return { status: "redirect", slug: translated.slug };

  return { status: "found", post: source, isFallback: true };
}

/**
 * The compact list behind a language's blog index, tag filter and search. One cached
 * entry per language, refreshed whenever any post of that language is published.
 */
export async function getPostIndex(locale: Locale): Promise<PostSummary[]> {
  "use cache";
  cacheLife("max");
  cacheTag(cacheTags.posts(locale));

  const { isEnabled: isDraft } = await draftMode();
  return (isDraft ? draftClient : client).fetch(POST_INDEX_QUERY, { language: locale });
}

/** Every real (locale, slug) post, plus each default-locale post's fallback URL elsewhere. */
export async function getPostParams() {
  const posts = (await sanityFetch({ query: POST_PARAMS_QUERY, tags: [cacheTags.pageList] })) ?? [];
  const real = posts.flatMap((p) => (p.language && isLocale(p.language) && p.slug ? [{ locale: p.language, slug: p.slug }] : []));
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

export function getSitemapPosts() {
  return sanityFetch({ query: SITEMAP_POSTS_QUERY, tags: [cacheTags.pageList] });
}

/**
 * Post metadata: title/description, robots, canonical + hreflang (real translations only,
 * none for a fallback), and per-locale Open Graph and Twitter card data.
 */
export function postMetadata(result: { post: Post; isFallback: boolean }, locale: Locale): Metadata {
  const { post, isFallback } = result;
  const own = absoluteUrl(postPath(locale, post.slug ?? ""));
  const image = ogImageUrl(post.coverImage);
  const alt = post.coverImage?.alt || post.title || undefined;

  const versions = realVersions(post);
  const otherLocales = locales.filter((l) => l !== locale && versions[l]).map((l) => localeMeta[l].ogLocale);

  const social: Metadata = {
    openGraph: {
      type: "article",
      siteName: "Previewly",
      title: post.title ?? undefined,
      description: post.excerpt ?? undefined,
      url: own,
      locale: localeMeta[locale].ogLocale,
      ...(otherLocales.length && !isFallback ? { alternateLocale: otherLocales } : {}),
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post._updatedAt,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags ?? undefined,
      ...(image ? { images: [{ url: image, width: 1200, height: 630, alt }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: post.title ?? undefined,
      description: post.excerpt ?? undefined,
      ...(image ? { images: [{ url: image, alt }] } : {}),
    },
  };

  const base: Metadata = { title: post.title ?? undefined, description: post.excerpt ?? undefined, ...social };

  // Same reasoning as pages: a fallback is noindex, with no canonical and no hreflang.
  if (isFallback) return { ...base, robots: { index: false, follow: true } };
  if (post.noindex) return { ...base, robots: { index: false, follow: false }, alternates: { canonical: own } };
  return { ...base, alternates: { canonical: own, languages: alternateLanguages(post, own, postKind) } };
}

