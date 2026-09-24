import { defineQuery } from "next-sanity";

export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    _id,
    title,
    description,
    blocks[]{
      _key,
      _type,
      _type == "hero" => {
        eyebrow,
        heading,
        emphasis,
        body,
        actions[]{ _key, label, href },
        image{
          alt,
          crop,
          hotspot,
          asset->{ _id, url, metadata{ lqip, dimensions{ width, height } } }
        }
      }
    }
  }
`);
