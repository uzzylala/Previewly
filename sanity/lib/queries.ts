import { defineQuery } from "next-sanity";

/** Everything a responsive, layout-shift-free image needs: dimensions, crop and LQIP. */
const IMAGE = /* groq */ `{
  alt,
  crop,
  hotspot,
  asset->{ _id, metadata{ lqip, dimensions{ width, height } } }
}`;

/**
 * Blocks are spread (`...`), so a block made of plain fields needs no change here: its
 * fields flow into the generated types automatically. Only blocks holding images (or
 * other references) add a projection, because references must be expanded explicitly.
 */
export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    _id,
    title,
    description,
    blocks[]{
      ...,
      _type == "hero" => { image ${IMAGE} },
      _type == "testimonialGrid" => { testimonials[]{ ..., avatar ${IMAGE} } }
    }
  }
`);
