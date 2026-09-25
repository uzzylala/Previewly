import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { FallbackNotice } from "@/components/fallback-notice";
import { PageShell } from "@/components/page-shell";
import { defaultLocale, localeMeta, type Locale } from "@/i18n/locales";
import { postPath, unprefixedPostPath } from "@/lib/urls";
import { localeLinks } from "@/sanity/lib/pages";
import { getLocalizedPost, postKind, postMetadata } from "@/sanity/lib/posts";

import { PostView } from "./post-view";

export async function localizedPostMetadata(locale: Locale, slug: string): Promise<Metadata> {
  const result = await getLocalizedPost(locale, slug);
  return result.status === "found" ? postMetadata(result, locale) : {};
}

/** Renders /<locale>/blog/<slug>: the post, its fallback, a redirect, or a 404. */
export async function LocalizedPost({ locale, slug }: { locale: Locale; slug: string }) {
  const result = await getLocalizedPost(locale, slug);
  if (result.status === "missing") notFound();
  if (result.status === "redirect") redirect(postPath(locale, result.slug));

  const { post, isFallback } = result;

  return (
    <PageShell
      languages={localeLinks(post, locale, postKind)}
      notice={isFallback ? <FallbackNotice locale={locale} path={unprefixedPostPath(post.slug ?? slug)} /> : undefined}
    >
      {/* The body of a fallback is in the default language, whatever the page around it is. */}
      <div {...(isFallback ? { lang: defaultLocale, dir: localeMeta[defaultLocale].dir } : {})}>
        <PostView post={post} displayLocale={isFallback ? defaultLocale : locale} isFallback={isFallback} />
      </div>
    </PageShell>
  );
}
