import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlockRenderer } from "@/components/blocks/block-renderer";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PAGE_QUERY } from "@/sanity/lib/queries";

const HOME_SLUG = "home";

function getHomePage() {
  return sanityFetch({
    query: PAGE_QUERY,
    params: { slug: HOME_SLUG },
    tags: ["page", `page:${HOME_SLUG}`],
  });
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePage();
  return {
    // The root layout supplies the default title; only override the description.
    description: page?.description ?? undefined,
  };
}

export default async function HomePage() {
  const page = await getHomePage();
  if (!page) notFound();

  return <BlockRenderer blocks={page.blocks} />;
}
