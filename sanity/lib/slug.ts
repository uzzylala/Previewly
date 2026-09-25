import type { SlugIsUniqueValidator } from "sanity";

import { apiVersion } from "../env";

/**
 * Slugs may be written in any script (an Arabic page gets an Arabic URL). Sanity's default
 * slugify strips everything outside ASCII, which would turn "الأسعار" into an empty string.
 */
export const slugify = (input: string): string =>
  input
    .toLowerCase()
    .normalize("NFC")
    .replace(/[^\p{L}\p{N}\p{M}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);

/** Letters, digits and combining marks in any script, joined by single hyphens. */
export const SLUG_PATTERN = /^[\p{L}\p{N}\p{M}]+(?:-[\p{L}\p{N}\p{M}]+)*$/u;


/**
 * Sanity's default uniqueness check is dataset-wide, so "home" could exist only once.
 * Each language is its own URL space (/en/home, /fr/home), so uniqueness is per language.
 */
export const isUniqueInLanguage: SlugIsUniqueValidator = async (slug, context) => {
  const { document, getClient } = context;
  if (!slug) return true;
  const id = (document?._id ?? "").replace(/^drafts\./, "");
  const count = await getClient({ apiVersion }).fetch<number>(
    `count(*[_type == "page" && slug.current == $slug && language == $language && !(_id in [$id, $draftId])])`,
    { slug, language: document?.language ?? null, id, draftId: `drafts.${id}` },
  );
  return count === 0;
};
