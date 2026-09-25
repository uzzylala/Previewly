import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";

import { LocalizedPage, localizedMetadata } from "@/components/localized-page";
import { currentLocale } from "@/i18n/current";
import { decodeSlug, HOME_SLUG, pagePath } from "@/lib/urls";
import { getPageParams } from "@/sanity/lib/pages";

export async function generateStaticParams() {
  const params = (await getPageParams()).filter((p) => p.slug !== HOME_SLUG);
  // Cache Components requires at least one param; the page 404s on the placeholder.
  return params.length ? params : [{ locale: "en", slug: "__placeholder__" }];
}

export async function generateMetadata({ params }: PageProps<"/[locale]/[slug]">): Promise<Metadata> {
  const locale = await currentLocale();
  const slug = decodeSlug((await params).slug);
  return localizedMetadata(locale, slug);
}

export default async function CmsPage({ params }: PageProps<"/[locale]/[slug]">) {
  const locale = await currentLocale();
  const slug = decodeSlug((await params).slug);
  // One canonical URL for the homepage.
  if (slug === HOME_SLUG) permanentRedirect(pagePath(locale, HOME_SLUG));

  return <LocalizedPage locale={locale} slug={slug} />;
}
