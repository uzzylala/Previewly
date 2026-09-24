import Image from "next/image";

import { resolveImage, type SanityImageSource } from "@/sanity/lib/image";

type Props = {
  image: SanityImageSource | undefined;
  /** Required: tells the browser which srcset width to pick at each breakpoint. */
  sizes: string;
  className?: string;
  preload?: boolean;
};

/**
 * Responsive Sanity image: full srcset from the CDN, intrinsic width/height so the
 * space is reserved before load (no layout shift), and the LQIP as a blur-up placeholder.
 * Renders nothing when the image is missing or incomplete.
 */
export function SanityImage({ image, sizes, className, preload }: Props) {
  const resolved = resolveImage(image);
  if (!resolved) return null;

  return (
    <Image
      src={resolved.src}
      width={resolved.width}
      height={resolved.height}
      alt={resolved.alt}
      sizes={sizes}
      className={className}
      preload={preload}
      {...(resolved.blurDataURL
        ? { placeholder: "blur" as const, blurDataURL: resolved.blurDataURL }
        : {})}
    />
  );
}
