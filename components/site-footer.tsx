import { getTranslations } from "next-intl/server";

import { Wordmark } from "./ui/wordmark";

const OWNER = "uzzylala";
const OWNER_URL = `https://github.com/${OWNER}`;
const REPO_URL = `${OWNER_URL}/Previewly`;
const YEAR = 2026;

const linkClass =
  "underline decoration-1 underline-offset-4 transition-colors hover:text-proof";

export async function SiteFooter() {
  const t = await getTranslations("Site");

  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex max-w-page flex-wrap items-baseline justify-between gap-4 px-gutter py-10 text-sm text-ink-soft">
        <Wordmark />
        <p>{t("tagline")}</p>
      </div>
      <div className="mx-auto flex max-w-page flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-rule px-gutter py-5 text-sm text-ink-soft">
        <p>
          © {YEAR}{" "}
          <a
            href={OWNER_URL}
            rel="noopener noreferrer"
            lang="en"
            dir="ltr"
            translate="no"
            className={linkClass}
          >
            {OWNER}
          </a>
        </p>
        <a href={REPO_URL} rel="noopener noreferrer" className={linkClass}>
          {t("sourceOnGithub")}
        </a>
      </div>
    </footer>
  );
}
