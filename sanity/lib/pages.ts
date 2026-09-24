import "server-only";

import type { Metadata } from "next";

import type { PAGE_QUERY_RESULT } from "../types";
import { sanityFetch } from "./fetch";
import { PAGE_QUERY, PAGE_SLUGS_QUERY, SITEMAP_QUERY } from "./queries";
import { cacheTags } from "./tags";

export const HOME_SLUG = "home";

export function getPage(slug: string) {
  return sanityFetch({ query: PAGE_QUERY, params: { slug }, tags: [cacheTags.page(slug)] });
}

export function getPageSlugs() {
  return sanityFetch({ query: PAGE_SLUGS_QUERY, tags: [cacheTags.pageList] });
}

export function getSitemapPages() {
  return sanityFetch({ query: SITEMAP_QUERY, tags: [cacheTags.pageList] });
}

/** Page-level metadata shared by every CMS-driven route. */
export function pageMetadata(page: PAGE_QUERY_RESULT): Metadata {
  return {
    ...(page?.title ? { title: page.title } : {}),
    description: page?.description ?? undefined,
    ...(page?.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
