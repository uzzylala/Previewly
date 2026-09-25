"use client";

import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { defaultLocale, localeMeta, type Locale } from "@/i18n/locales";

export type LanguageOption = {
  locale: Locale;
  /** Locale-less path of the same page in that locale (or its fallback). */
  path: string;
  translated: boolean;
};

/**
 * Keeps the visitor on the same page in another language. Each option is a plain link, so
 * it works without JavaScript; with it, next-intl's Link also remembers the choice in the
 * NEXT_LOCALE cookie, which is what makes "/" honour it on the next visit.
 *
 * A locale where the page isn't translated still links to that locale's version of the
 * page (the fallback, shown with a notice) rather than dumping the visitor on a homepage
 * or a 404. Those options are dotted-underlined and say so in a tooltip and to screen
 * readers.
 */
export function LanguageSwitcher({ options }: { options: LanguageOption[] }) {
  const t = useTranslations("Language");
  const languages = useTranslations("Languages");
  const current = useLocale();

  return (
    <nav aria-label={t("label")}>
      <ul className="flex items-center gap-1 text-sm">
        {options.map(({ locale, path, translated }) => {
          const isCurrent = locale === current;
          const meta = localeMeta[locale];
          const untranslated = !translated && !isCurrent;
          const hint = untranslated ? t("notTranslated", { fallback: languages(defaultLocale) }) : undefined;

          return (
            <li key={locale}>
              <Link
                href={path}
                locale={locale}
                lang={locale}
                hrefLang={locale}
                aria-current={isCurrent ? "true" : undefined}
                title={hint}
                className={`inline-flex min-h-9 items-center rounded-xs px-2 transition-colors duration-200 motion-reduce:transition-none ${
                  isCurrent
                    ? "font-semibold text-ink underline decoration-1 underline-offset-[6px]"
                    : `text-ink-soft hover:text-proof ${untranslated ? "underline decoration-dotted decoration-1 underline-offset-[6px]" : ""}`
                }`}
              >
                <span aria-hidden className="sm:hidden">
                  {locale.toUpperCase()}
                </span>
                <span className="sr-only sm:not-sr-only">{meta.nativeName}</span>
                {hint && <span className="sr-only">{`(${hint})`}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
