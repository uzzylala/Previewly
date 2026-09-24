/**
 * Cache tags, shared by the fetchers (which attach them) and the publish webhook (which
 * revalidates them). Granular on purpose: publishing one page refreshes that page and
 * the lists of pages, never every page on the site.
 */
export const cacheTags = {
  /** A single page's content. */
  page: (slug: string) => `page:${slug}`,
  /** Queries that enumerate pages: static params and the sitemap. */
  pageList: "page-list",
} as const;
