import type { Locale } from "../../i18n/locales";

/**
 * Cache tags, shared by the fetchers (which attach them) and the publish webhook (which
 * revalidates them). Granular on purpose: publishing the French version of a page
 * refreshes that one URL, never the English page or the rest of the site.
 */
export const cacheTags = {
  /** One page in one language: what serves /<locale>/<slug>. */
  page: (locale: Locale, slug: string) => `page:${locale}:${slug}`,
  /** One blog post in one language: what serves /<locale>/blog/<slug>. */
  post: (locale: Locale, slug: string) => `post:${locale}:${slug}`,
  /** A language's blog index (list, tags, search data): any post of that language changing. */
  posts: (locale: Locale) => `posts:${locale}`,
  /** Queries that enumerate pages: static params and the sitemap. */
  pageList: "page-list",
} as const;
