import { getRequestConfig } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";

import { defaultLocale, isLocale } from "./locales";

/**
 * Resolves the locale from the [locale] route segment (a Next.js root param), not from a
 * request header, so pages stay statically prerenderable.
 */
export default getRequestConfig(async () => {
  let requested: string | undefined;
  try {
    requested = await rootLocale();
  } catch {
    // Outside a [locale] route (e.g. the Studio): nothing to localise.
  }
  const locale = requested && isLocale(requested) ? requested : defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    // One fixed zone so server and client format the same instant identically.
    timeZone: "UTC",
    formats: {
      dateTime: { long: { year: "numeric", month: "long", day: "numeric" } },
    },
  };
});
