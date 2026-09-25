import { getTranslations } from "next-intl/server";

import { PageShell } from "@/components/page-shell";
import { ActionLink } from "@/components/ui/action-link";
import { locales } from "@/i18n/locales";

/**
 * The localised 404. Reached by notFound() from any page or post, and by unknown deeper
 * paths through the [...rest] catch-all, so it always renders inside the visitor's locale.
 */
export default async function NotFound() {
  const t = await getTranslations("NotFound");
  // No page to stay on, so every language links to its own homepage.
  const languages = locales.map((locale) => ({ locale, path: "/", translated: true }));

  return (
    <PageShell languages={languages}>
      <section className="mx-auto grid max-w-page items-center gap-x-12 gap-y-16 px-gutter py-section md:grid-cols-12">
        <div className="flex flex-col items-start gap-6 md:col-span-7">
          <p className="text-xs font-medium tracking-label text-proof uppercase">{t("eyebrow")}</p>
          <h1 className="max-w-[16ch] font-display text-display font-normal">
            {t.rich("title", { em: (chunks) => <em className="display-emphasis">{chunks}</em> })}
          </h1>
          <p className="max-w-measure text-lg text-ink-soft">{t("body")}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-8 gap-y-3">
            <ActionLink href="/" variant="primary">
              {t("home")}
            </ActionLink>
            <ActionLink href="/blog" variant="secondary">
              {t("blog")}
            </ActionLink>
          </div>
        </div>

        {/* A proof sheet with its number stamped in red: decorative, and the same in every
            direction (digits and marks are never mirrored). */}
        <div aria-hidden className="md:col-span-5">
          <div dir="ltr" className="crop-marks mx-6 grid aspect-[4/3] place-items-center bg-paper-deep md:mx-0">
            <span className="-rotate-6 border-2 border-mark px-6 py-2 font-display text-5xl tracking-tight text-mark md:text-6xl">
              404
            </span>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
