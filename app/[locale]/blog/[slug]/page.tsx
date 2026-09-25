import type { Metadata } from "next";

import { LocalizedPost, localizedPostMetadata } from "@/components/blog/localized-post";
import { currentLocale } from "@/i18n/current";
import { decodeSlug } from "@/lib/urls";
import { getPostParams } from "@/sanity/lib/posts";

export async function generateStaticParams() {
  const params = await getPostParams();
  // Cache Components requires at least one param; the page 404s on the placeholder.
  return params.length ? params : [{ locale: "en", slug: "__placeholder__" }];
}

export async function generateMetadata({ params }: PageProps<"/[locale]/blog/[slug]">): Promise<Metadata> {
  const locale = await currentLocale();
  return localizedPostMetadata(locale, decodeSlug((await params).slug));
}

export default async function PostPage({ params }: PageProps<"/[locale]/blog/[slug]">) {
  const locale = await currentLocale();
  return <LocalizedPost locale={locale} slug={decodeSlug((await params).slug)} />;
}
