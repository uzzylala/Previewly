import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { BlockRenderer } from "@/components/blocks/block-renderer";
import { getPage, getPageSlugs, HOME_SLUG, pageMetadata } from "@/sanity/lib/pages";

export async function generateStaticParams() {
  const slugs = await getPageSlugs();
  // Cache Components requires at least one param; the page 404s on the placeholder.
  return slugs?.length ? slugs.map((slug) => ({ slug })) : [{ slug: "__placeholder__" }];
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return pageMetadata(await getPage(slug));
}

export default async function CmsPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  // One canonical URL for the homepage.
  if (slug === HOME_SLUG) permanentRedirect("/");

  const page = await getPage(slug);
  if (!page) notFound();

  return <BlockRenderer blocks={page.blocks} />;
}
