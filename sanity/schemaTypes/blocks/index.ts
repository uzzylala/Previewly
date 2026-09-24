import { cta } from "./cta";
import { faq } from "./faq";
import { hero } from "./hero";
import { richText } from "./rich-text";
import { testimonialGrid } from "./testimonial-grid";

/**
 * Every page block type. The page schema's `blocks` array is built from this list, so a
 * new block is registered on the schema side by adding it here. Its frontend component
 * goes in components/blocks/registry.ts; TypeScript fails the build until both exist.
 */
export const blockTypes = [hero, testimonialGrid, faq, cta, richText];
