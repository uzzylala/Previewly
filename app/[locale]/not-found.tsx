import { getTranslations } from "next-intl/server";

import { PageShell } from "@/components/page-shell";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { Link } from "@/i18n/navigation";
import { locales } from "@/i18n/locales";

export default async function NotFound() {
  const t = await getTranslations("NotFound");
  // No page to stay on, so every language links to its own homepage.
  const languages = locales.map((locale) => ({ locale, path: "/", translated: true }));

  return (
    <PageShell languages={languages}>
      <section className="mx-auto flex max-w-page flex-col items-start gap-6 px-gutter py-section">
        <h1 className="font-display text-display">{t("title")}</h1>
        <p className="max-w-measure text-lg text-ink-soft">{t("body")}</p>
        <Link href="/" className="inline-flex items-center gap-2 font-medium text-proof underline underline-offset-4">
          {t("home")}
          <ArrowIcon />
        </Link>
      </section>
    </PageShell>
  );
}
