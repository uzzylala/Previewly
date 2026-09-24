import { Cta } from "./cta";
import { Faq } from "./faq";
import { Hero } from "./hero";
import { RichText } from "./rich-text";
import { TestimonialGrid } from "./testimonial-grid";
import type { BlockComponent, BlockProps, BlockType } from "./types";

/**
 * The one place a block type is mapped to its component. `satisfies` makes this
 * exhaustive against the types generated from the Sanity schema: a block type with no
 * entry, or an entry whose props don't match the generated shape, fails the build.
 */
export const blockRegistry = {
  hero: Hero,
  testimonialGrid: TestimonialGrid,
  faq: Faq,
  cta: Cta,
  richText: RichText,
} satisfies { [T in BlockType]: BlockComponent<BlockProps<T>> };

export function isRegisteredBlock(type: string): type is BlockType {
  return Object.hasOwn(blockRegistry, type);
}
