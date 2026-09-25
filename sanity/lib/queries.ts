import { defineQuery } from "next-sanity";

/** Everything a responsive, layout-shift-free image needs: dimensions, crop and LQIP. */
const IMAGE = /* groq */ `{
  alt,
  crop,
  hotspot,
  asset->{ _id, metadata{ lqip, dimensions{ width, height } } }
}`;

/**
 * The other language versions of the page it is nested in, from its translation.metadata
 * document. `value->` is null for a translation that isn't published (in the published
 * perspective), so those are dropped: only real, live translations are ever listed.
 */
const TRANSLATIONS = /* groq */ `
  *[_type == "translation.metadata" && references(^._id)][0].translations[]{
    language,
    "slug": value->slug.current,
    "noindex": value->noindex
  }[defined(slug)]
`;

/**
 * Blocks are spread (`...`), so a block made of plain fields needs no change here: its
 * fields flow into the generated types automatically. Only blocks holding images (or
 * other references) add a projection, because references must be expanded explicitly.
 */
export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug && language == $language][0]{
    _id,
    _updatedAt,
    language,
    "slug": slug.current,
    title,
    description,
    noindex,
    "translations": ${TRANSLATIONS},
    blocks[]{
      ...,
      _type == "hero" => { image ${IMAGE} },
      _type == "testimonialGrid" => { testimonials[]{ ..., avatar ${IMAGE} } }
    }
  }
`);

/** Every (language, slug) pair, for generateStaticParams. Homepages are served at /<language>. */
export const PAGE_PARAMS_QUERY = defineQuery(`
  *[_type == "page" && defined(slug.current) && defined(language)]{
    language,
    "slug": slug.current
  }
`);

/**
 * Indexable pages only: noindex pages (like /fixtures) stay out of the sitemap. Each entry
 * carries its real translations so the sitemap can declare hreflang alternates.
 */
export const SITEMAP_QUERY = defineQuery(`
  *[_type == "page" && defined(slug.current) && defined(language) && noindex != true]{
    language,
    "slug": slug.current,
    _updatedAt,
    "translations": ${TRANSLATIONS}
  }
`);

/**
 * A blog post, with its real translations. Like pages, the post is looked up by
 * (language, slug); the cover image and body are projected for rendering.
 */
export const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug && language == $language][0]{
    _id,
    _updatedAt,
    language,
    "slug": slug.current,
    title,
    excerpt,
    author,
    publishedAt,
    tags,
    noindex,
    coverImage ${IMAGE},
    body,
    "translations": ${TRANSLATIONS}
  }
`);

/**
 * Everything the blog index, tag filter and search need for one language, newest first.
 * Deliberately compact (no body): the whole list is small enough to filter in the browser.
 */
export const POST_INDEX_QUERY = defineQuery(`
  *[_type == "post" && language == $language && defined(slug.current) && noindex != true]
    | order(publishedAt desc){
    _id,
    "slug": slug.current,
    title,
    excerpt,
    author,
    publishedAt,
    tags,
    coverImage ${IMAGE}
  }
`);

export const POST_PARAMS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current) && defined(language)]{
    language,
    "slug": slug.current
  }
`);

export const SITEMAP_POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current) && defined(language) && noindex != true]{
    language,
    "slug": slug.current,
    _updatedAt,
    "translations": ${TRANSLATIONS}
  }
`);

/**
 * Used by the publish webhook: every document (page or post) linked to the given one, and
 * the documents named by a translation.metadata document.
 */
export const SIBLINGS_OF_DOC_QUERY = defineQuery(`
  *[_type == "translation.metadata" && references($id)].translations[]{
    language,
    "type": value->_type,
    "slug": value->slug.current
  }
`);

export const DOCS_BY_ID_QUERY = defineQuery(`
  *[_type in ["page", "post"] && _id in $ids]{ _type, language, "slug": slug.current }
`);
