import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { BlogBrowser } from "@/components/blog/blog-browser";
import { PageShell } from "@/components/page-shell";
import { currentLocale } from "@/i18n/current";
import { defaultLocale, locales, type Locale } from "@/i18n/locales";
import { parseBlogQuery } from "@/lib/blog-search";
import { absoluteUrl, blogPath } from "@/lib/urls";
import { getPostIndex } from "@/sanity/lib/posts";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await currentLocale();
  const t = await getTranslations({ locale, namespace: "Blog" });
  return {
    title: t("title"),
    description: t("description"),
    // The index exists in every language (with that language's posts), so all of them
    // are real alternates. ?page= and ?tag= variants share this canonical.
    alternates: {
      canonical: absoluteUrl(blogPath(locale)),
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, absoluteUrl(blogPath(l))])),
        "x-default": absoluteUrl(blogPath(defaultLocale)),
      },
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
