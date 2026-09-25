import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

import { LanguageSwitcher, type LanguageOption } from "./language-switcher";
import { Wordmark } from "./ui/wordmark";

export async function SiteHeader({ languages }: { languages: LanguageOption[] }) {
  const site = await getTranslations("Site");
  const nav = await getTranslations("Nav");

  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex min-h-16 max-w-page flex-wrap items-center justify-between gap-x-6 gap-y-1 px-gutter py-1">
        <Link href="/" aria-label={site("homeLabel")} className="rounded-xs">
          <Wordmark />
        </Link>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 sm:gap-x-8">
          <nav aria-label={site("primaryNav")} className="flex items-center gap-4 text-sm sm:gap-6">
            <Link href="/#how-it-works" className="hidden text-ink-soft transition-colors hover:text-proof md:inline">
              {nav("howItWorks")}
            </Link>
            <Link href="/#faq" className="hidden text-ink-soft transition-colors hover:text-proof md:inline">
              {nav("faq")}
            </Link>
            <Link href="/blog" className="text-ink-soft transition-colors hover:text-proof">
              {nav("blog")}
            </Link>
          </nav>
          <LanguageSwitcher options={languages} />
        </div>
      </div>
    </header>
  );
}
