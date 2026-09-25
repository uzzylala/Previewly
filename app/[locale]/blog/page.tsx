import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { BlogBrowser } from "@/components/blog/blog-browser";
import { PageShell } from "@/components/page-shell";
import { currentLocale } from "@/i18n/current";
import { defaultLocale, locales, type Locale } from "@/i18n/locales";
import { blogQueryString, filterPosts, paginate, parseBlogQuery } from "@/lib/blog-search";
import { absoluteUrl, blogPath } from "@/lib/urls";
import { getPostIndex } from "@/sanity/lib/posts";

/**
 * Index SEO, by variant of the URL:
 *  - /blog and ?page=N: indexable, each with a self-referencing canonical (page 2 is not
 *    a duplicate of page 1; it lists different posts). N is clamped to the last real page.
 *  - ?tag=x (any page): indexable with a self-referencing canonical. A tag is a small,
 *    stable topic listing with its own set of posts, so it is a useful landing page
 *    rather than a duplicate. (The alternative, noindex, would throw that away.)
 *  - ?q=: noindex, follow. Search results are an unbounded space of thin, near-duplicate
 *    pages that nobody links to; crawlers should follow through to the posts, not index them.
 * hreflang is only declared on the bare index, the one URL that exists in every language:
 * tags are translated, so a filtered view has no equivalent to point to.
 */
export async function generateMetadata({ searchParams }: PageProps<"/[locale]/blog">): Promise<Metadata> {
  const locale = await currentLocale();
  const t = await getTranslations({ locale, namespace: "Blog" });
  const query = parseBlogQuery(await searchParams);

  const base = { title: t("title"), description: t("description") };
  if (query.q) {
    return { ...base, robots: { index: false, follow: true } };
  }

  const { page } = paginate(filterPosts(await getPostIndex(locale), { q: "", tag: query.tag }), query.page);
  const qs = blogQueryString({ q: "", tag: query.tag, page });
  const canonical = absoluteUrl(blogPath(locale)) + (qs === "?" ? "" : qs);
  const isBare = !query.tag && page === 1;

  return {
    ...base,
    alternates: {
      canonical,
      ...(isBare
        ? {
            languages: {
              ...Object.fromEntries(locales.map((l) => [l, absoluteUrl(blogPath(l))])),
              "x-default": absoluteUrl(blogPath(defaultLocale)),
            },
          }
        : {}),
    },
  };
}

export default async function BlogIndexPage({ searchParams }: PageProps<"/[locale]/blog">) {
  const locale = await currentLocale();
  const t = await getTranslations({ locale, namespace: "Blog" });
  // Every language has its own blog index, so the switcher always has a real target.
  const languages = locales.map((l) => ({ locale: l, path: "/blog", translated: true }));

  return (
    <PageShell languages={languages}>
      <section className="mx-auto max-w-page px-gutter py-section">
        <header className="mb-14 flex max-w-[52rem] flex-col gap-4 border-t border-ink pt-4">
          <p className="text-xs font-medium tracking-label text-proof uppercase">{t("eyebrow")}</p>
          <h1 className="font-display text-display">{t("title")}</h1>
          <p className="max-w-measure text-lg text-ink-soft">{t("description")}</p>
        </header>
        {/* The URL's ?q=&tag=&page= are request-time data; the post list itself is cached. */}
        <Suspense
          fallback={
            <p role="status" className="text-sm text-ink-soft">
              {t("loading")}
            </p>
          }
        >
          <BlogResults locale={locale} searchParams={searchParams} />
        </Suspense>
      </section>
    </PageShell>
  );
}

async function BlogResults({
  locale,
  searchParams,
}: {
  locale: Locale;
  searchParams: PageProps<"/[locale]/blog">["searchParams"];
}) {
  const [posts, params] = await Promise.all([getPostIndex(locale), searchParams]);
  return <BlogBrowser posts={posts} initial={parseBlogQuery(params)} />;
}
