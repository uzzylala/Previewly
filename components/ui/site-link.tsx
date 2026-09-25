import NextLink from "next/link";
import type { ReactNode } from "react";

import { Link } from "@/i18n/navigation";
import { locales } from "@/i18n/locales";

const NOT_LOCALIZED = /^\/(studio|api)(?:[/?#]|$)/;
const ALREADY_LOCALIZED = new RegExp(`^/(?:${locales.join("|")})(?:[/?#]|$)`);

/**
 * A link to somewhere on this site. Editors write paths without a language ("/pricing",
 * "/#faq"), so the visitor's current locale is added here: the same CMS link works on
 * every language version of a page. In-page anchors, the Studio and paths that already
 * name a locale are left exactly as written.
 */
type Props = { href: string; className?: string; children: ReactNode };

export function SiteLink({ href, ...props }: Props) {
  if (href.startsWith("#") || NOT_LOCALIZED.test(href) || ALREADY_LOCALIZED.test(href)) {
    return <NextLink href={href} {...props} />;
  }
  return <Link href={href} {...props} />;
}
