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
  // The Studio is a separate app (its own root layout, several MB of JavaScript). A next/link
  // to it would prefetch that whole bundle as soon as the link scrolls into view, on every
  // public page, so it (and the API) get a plain anchor: a real navigation, no prefetch.
  if (NOT_LOCALIZED.test(href)) return <a href={href} {...props} />;
  if (href.startsWith("#") || ALREADY_LOCALIZED.test(href)) {
    return <NextLink href={href} {...props} />;
  }
  return <Link href={href} {...props} />;
}
