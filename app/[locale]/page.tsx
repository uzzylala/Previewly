import type { Metadata } from "next";

import { LocalizedPage, localizedMetadata } from "@/components/localized-page";
import { currentLocale } from "@/i18n/current";
import { HOME_SLUG } from "@/lib/urls";

export async function generateMetadata(): Promise<Metadata> {
  return localizedMetadata(await currentLocale(), HOME_SLUG);
}

export default async function HomePage() {
  return <LocalizedPage locale={await currentLocale()} slug={HOME_SLUG} />;
}
