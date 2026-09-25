import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

import { LanguageSwitcher, type LanguageOption } from "./language-switcher";
import { Wordmark } from "./ui/wordmark";

export async function SiteHeader({ languages }: { languages: LanguageOption[] }) {
  const site = await getTranslations("Site");
  const nav = await getTranslations("Nav");

  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex min-h-16 max-w-page items-center justify-between gap-x-6 gap-y-2 px-gutter">
        <Link href="/" aria-label={site("homeLabel")} className="rounded-xs">
          <Wordmark />
        </Link>
        <div className="flex items-center gap-x-8">
          <nav aria-label={site("primaryNav")} className="hidden items-center gap-6 text-sm md:flex">
            <Link href="/#how-it-works" className="text-ink-soft transition-colors hover:text-proof">
              {nav("howItWorks")}
            </Link>
            <Link href="/#faq" className="text-ink-soft transition-colors hover:text-proof">
              {nav("faq")}
            </Link>
          </nav>
          <LanguageSwitcher options={languages} />
        </div>
      </div>
    </header>
  );
}
