"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { Link } from "@/i18n/navigation";
import { Wordmark } from "@/components/ui/wordmark";

/**
 * Runtime error boundary for every localised route. It replaces the page but not the
 * layout, so the locale, fonts, direction and draft bar are all still in place; it is
 * translated through the same message files as the rest of the site.
 */
export default function LocaleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("Error");

  useEffect(() => {
    console.error("[error boundary]", error);
  }, [error]);

  return (
    <>
      <header className="border-b border-rule">
        <div className="mx-auto flex min-h-16 max-w-page items-center px-gutter">
          <Link href="/" className="rounded-xs">
            <Wordmark />
          </Link>
        </div>
      </header>
      <main id="content" tabIndex={-1} className="flex-1 focus:outline-none">
        <section role="alert" className="mx-auto flex max-w-page flex-col items-start gap-6 px-gutter py-section">
          <p className="text-xs font-medium tracking-label text-mark uppercase">{t("eyebrow")}</p>
          <h1 className="max-w-[16ch] font-display text-display font-normal">
            {t.rich("title", { em: (chunks) => <em className="display-emphasis">{chunks}</em> })}
          </h1>
          <p className="max-w-measure text-lg text-ink-soft">{t("body")}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-8 gap-y-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center rounded-xs bg-ink px-5 py-3 text-base font-medium text-paper transition-[background-color,transform] duration-200 ease-out-quint hover:bg-proof active:scale-[0.98] motion-reduce:transition-none"
            >
              {t("retry")}
            </button>
            <Link
              href="/"
              className="inline-flex items-center py-3 text-base font-medium text-ink underline decoration-1 underline-offset-[6px] hover:text-proof hover:decoration-2"
            >
              {t("home")}
            </Link>
          </div>
          {error.digest && <p className="text-sm text-ink-soft">{t("reference", { digest: error.digest })}</p>}
        </section>
      </main>
    </>
  );
}
