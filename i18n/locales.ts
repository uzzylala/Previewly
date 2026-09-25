/**
 * The locale list and per-locale facts. Pure data (no next-intl or Next imports) so the
 * Studio config, the seed script and the site can all share one source of truth.
 */
export const locales = ["en", "fr", "ar"] as const;
export type Locale = (typeof locales)[number];

/** Served with a fallback to this locale whenever a page has no translation. */
export const defaultLocale: Locale = "en";

export const localeMeta: Record<Locale, { title: string; nativeName: string; dir: "ltr" | "rtl"; ogLocale: string }> = {
  en: { title: "English", nativeName: "English", dir: "ltr", ogLocale: "en_US" },
  fr: { title: "French", nativeName: "Français", dir: "ltr", ogLocale: "fr_FR" },
  ar: { title: "Arabic", nativeName: "العربية", dir: "rtl", ogLocale: "ar_AR" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
