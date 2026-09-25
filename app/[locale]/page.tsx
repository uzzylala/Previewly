import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlockRenderer } from "@/components/blocks/block-renderer";
import { getPage, HOME_SLUG, pageMetadata } from "@/sanity/lib/pages";

export async function generateMetadata(): Promise<Metadata> {
  // The root layout's default title ("Previewly") already fits the homepage.
  const metadata = pageMetadata(await getPage(HOME_SLUG));
  delete metadata.title;
  return metadata;
}

export default async function HomePage() {
  const page = await getPage(HOME_SLUG);
  if (!page) notFound();

  return <BlockRenderer blocks={page.blocks} />;
}
