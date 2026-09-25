import type { ReactNode } from "react";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import type { LanguageOption } from "./language-switcher";

/**
 * Header, content and footer for one page. It lives here rather than in the layout
 * because the language switcher must know which other languages the *page* exists in,
 * and only the page has fetched that.
 */
export async function PageShell({
  languages,
  notice,
  children,
}: {
  languages: LanguageOption[];
  notice?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader languages={languages} />
      {notice}
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
