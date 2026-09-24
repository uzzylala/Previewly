import type { ImageLoaderProps } from "next/image";

/**
 * Global next/image loader. Sanity's CDN already resizes and re-encodes on the fly,
 * so srcset entries map straight to CDN transform parameters instead of going through
 * the Next.js optimizer a second time.
 */
export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (!src.startsWith("https://cdn.sanity.io/")) return src;

  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  return url.toString();
}
