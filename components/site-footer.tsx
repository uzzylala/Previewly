import { getTranslations } from "next-intl/server";

import { Wordmark } from "./ui/wordmark";

export async function SiteFooter() {
  const t = await getTranslations("Site");

  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex max-w-page flex-wrap items-baseline justify-between gap-4 px-gutter py-10 text-sm text-ink-soft">
        <Wordmark />
        <p>{t("tagline")}</p>
      </div>
    </footer>
  );
}
