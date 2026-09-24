import { createImageUrlBuilder } from "@sanity/image-url";

import { dataset, projectId } from "../env";
import type { SanityImageCrop, SanityImageHotspot } from "../types";

const builder = createImageUrlBuilder({ projectId, dataset });

/** The image projection shape our GROQ queries return. */
export type SanityImageSource = {
  alt?: string | null;
  crop?: SanityImageCrop | null;
  hotspot?: SanityImageHotspot | null;
  asset?: {
    _id: string;
    metadata?: {
      lqip?: string | null;
      dimensions?: { width?: number | null; height?: number | null } | null;
    } | null;
  } | null;
} | null;

export type ResolvedImage = {
  /** Cropped base URL; the next/image loader appends width, quality and format. */
  src: string;
  width: number;
  height: number;
  alt: string;
  blurDataURL?: string;
};

/**
 * Turns a raw Sanity image into everything next/image needs to render without layout
 * shift: intrinsic dimensions (after the editor's crop), a URL, and the LQIP placeholder.
 * Returns null for anything incomplete (e.g. an image field whose upload never finished)
 * so callers can simply skip rendering.
 */
export function resolveImage(image: SanityImageSource | undefined): ResolvedImage | null {
  if (!image?.asset?._id) return null;
  const { asset } = image;
  const dims = asset.metadata?.dimensions;
  if (!dims?.width || !dims?.height) return null;

  const crop = image.crop;
  const cropX = 1 - (crop?.left ?? 0) - (crop?.right ?? 0);
  const cropY = 1 - (crop?.top ?? 0) - (crop?.bottom ?? 0);

  return {
    src: builder.image(image).url(),
    width: Math.round(dims.width * cropX),
    height: Math.round(dims.height * cropY),
    alt: image.alt ?? "",
    blurDataURL: asset.metadata?.lqip ?? undefined,
  };
}
