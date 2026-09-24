/**
 * Reduces an untrusted redirect target to a same-origin path, or "/".
 *
 * Checking for a leading "/" is not enough: "//evil.com" and "/\evil.com" are
 * protocol-relative to a browser, and URL parsing strips tabs and newlines, so
 * "/\t/evil.com" becomes "//evil.com". Resolving against our own origin and comparing
 * origins catches every such variant, whatever the encoding trick.
 */
export function safeRedirectPath(
  target: string | null | undefined,
  // Only a reference point: the result is always a bare path, never an absolute URL.
  origin = "http://localhost",
): string {
  if (!target || !target.startsWith("/")) return "/";

  let url: URL;
  try {
    url = new URL(target, origin);
  } catch {
    return "/";
  }
  if (url.origin !== origin) return "/";

  const path = `${url.pathname}${url.search}${url.hash}`;
  // Belt and braces: never hand back anything a browser could read as protocol-relative.
  return path.startsWith("//") || path.startsWith("/\\") ? "/" : path;
}
