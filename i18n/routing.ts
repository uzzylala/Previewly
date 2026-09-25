import { defineRouting } from "next-intl/routing";

import { defaultLocale, locales } from "./locales";

/**
 * Every URL carries its locale (/en, /fr, /ar), so each language version has one stable,
 * crawlable address. The root URL "/" is the only unprefixed one: the proxy sends it to
 * the visitor's locale (see proxy.ts).
 *
 * alternateLinks is off on purpose. next-intl would emit hreflang Link headers for every
 * locale of every URL, but only some pages are translated. Real hreflang tags are built
 * from the CMS in generateMetadata, so a fallback page is never advertised as a translation.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeDetection: true,
  alternateLinks: false,
  // The visitor's explicit choice (the language switcher) is remembered for a year and
  // wins over Accept-Language the next time they land on "/".
  localeCookie: { name: "NEXT_LOCALE", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" },
});
