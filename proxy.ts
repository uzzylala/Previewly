import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

/**
 * Locale negotiation for URLs without a locale prefix. This is the whole of "/":
 *
 *   1. the NEXT_LOCALE cookie (set when the visitor last picked a language), else
 *   2. the best match from the Accept-Language header, else
 *   3. the default locale (English).
 *
 * The redirect is a 307 (temporary): the same URL legitimately goes to different places
 * for different visitors, so no browser or crawler should cache it as permanent.
 */
export default createMiddleware(routing);

export const config = {
  // Everything except the API, the Studio, Next internals and files with an extension
  // (sitemap.xml, robots.txt, favicon.ico, images).
  matcher: ["/((?!api|studio|_next|_vercel|.*\\..*).*)"],
};
