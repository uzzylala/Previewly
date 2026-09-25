import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";

import { defaultLocale, localeMeta, type Locale } from "@/i18n/locales";
import { pagePath, unprefixedPath } from "@/lib/urls";
import { getLocalizedPage, localeLinks, pageMetadata } from "@/sanity/lib/pages";

import { BlockRenderer } from "./blocks/block-renderer";
import { FallbackNotice } from "./fallback-notice";
import { PageShell } from "./page-shell";

/** Metadata for /<locale>/<slug>; the cached page lookup is shared with the render. */
export async function localizedMetadata(locale: Locale, slug: string): Promise<Metadata> {
  const result = await getLocalizedPage(locale, slug);
  return result.status === "found" ? pageMetadata(result, locale) : {};
}

/** Renders /<locale>/<slug>: the page, its fallback, a redirect, or a 404. */
export async function LocalizedPage({ locale, slug }: { locale: Locale; slug: string }) {
  const result = await getLocalizedPage(locale, slug);
  if (result.status === "missing") notFound();
  if (result.status === "redirect") redirect(pagePath(locale, result.slug));

  const { page, isFallback } = result;
  const t = await getTranslations("Page");
  const format = await getFormatter();
  const updated = page._updatedAt ? new Date(page._updatedAt) : null;

  return (
    <PageShell
      languages={localeLinks(page, locale)}
      notice={isFallback ? <FallbackNotice locale={locale} path={unprefixedPath(page.slug ?? slug)} /> : undefined}
    >
      {/* The body of a fallback is in the default language, whatever the page around it is. */}
      <div {...(isFallback ? { lang: defaultLocale, dir: localeMeta[defaultLocale].dir } : {})}>
        <BlockRenderer blocks={page.blocks} />
      </div>
      {updated && (
        <p className="mx-auto max-w-page px-gutter pb-10 text-sm text-ink-soft">
          {t("updated", { date: format.dateTime(updated, "long") })}
        </p>
      )}
    </PageShell>
  );
}
