import { notFound } from "next/navigation";
import { locale } from "next/root-params";

import { isLocale, type Locale } from "./locales";

/** The locale of the [locale] route segment, validated. Anything else is a 404. */
export async function currentLocale(): Promise<Locale> {
  const value = await locale();
  if (!value || !isLocale(value)) notFound();
  return value;
}
