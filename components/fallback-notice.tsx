import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { defaultLocale, type Locale } from "@/i18n/locales";

import { ArrowIcon } from "./ui/arrow-icon";

/**
 * Shown when a page has no translation and the default-locale version is served instead.
 * It is worth its small footprint: without it a French visitor on French chrome silently
 * gets English body copy and can't tell a missing translation from a bug. It sits in the
 * visitor's own language and links to the page it is a copy of.
 */
/** `path` is the default-locale version of the current page, without its locale prefix. */
export async function FallbackNotice({ locale, path }: { locale: Locale; path: string }) {
  const t = await getTranslations("Fallback");
  const languages = await getTranslations("Languages");
  const fallback = languages(defaultLocale);

  return (
    <div role="note" className="border-b border-rule bg-paper-deep">
      <p className="mx-auto flex max-w-page flex-wrap items-center gap-x-4 gap-y-1 px-gutter py-3 text-sm text-ink-soft">
        <span>{t("notice", { language: languages(locale), fallback })}</span>
        <Link
          href={path}
          locale={defaultLocale}
          className="inline-flex items-center gap-1.5 font-medium text-proof underline decoration-1 underline-offset-4 hover:decoration-2"
        >
          {t("viewOriginal", { fallback })}
          <ArrowIcon />
        </Link>
      </p>
    </div>
  );
}
