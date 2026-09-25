import { defineArrayMember, defineField, defineType } from "sanity";

import { isUniqueInLanguage, slugify, SLUG_PATTERN } from "../../lib/slug";
import { blockTypes } from "../blocks";

/** Seeded test page of deliberately invalid content; see scripts/seed.mts. */
export const FIXTURES_PAGE_ID = "page-fixtures";

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  // The fixtures page is invalid on purpose, so it can never be published from the
  // Studio anyway. Read-only makes that explicit instead of a confusing disabled Publish.
  readOnly: ({ document }) => document?._id.replace(/^drafts\./, "") === FIXTURES_PAGE_ID,
  fields: [
    // Set by @sanity/document-internationalization when a translation is created. Editors
    // never change it: a document's language is what places it at /<language>/<slug>.
    defineField({ name: "language", type: "string", readOnly: true, hidden: true }),
    defineField({
      name: "title",
      description: "Used for the browser tab and search results.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      description:
        'Use "home" for the homepage. Each language has its own slug, and it can be written in that language (for example "tarifs").',
      type: "slug",
      options: { source: "title", slugify, isUnique: isUniqueInLanguage },
      validation: (rule) =>
        rule.required().custom((value) =>
          !value?.current || SLUG_PATTERN.test(value.current)
            ? true
            : "Use letters and numbers separated by single hyphens (no spaces, slashes or symbols).",
        ),
    }),
    defineField({
      name: "description",
      description: "Search engine and social preview description.",
      type: "text",
      rows: 2,
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: "editorNote",
      description: "Internal note for editors. Never shown on the site.",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "noindex",
      title: "Hide from search engines",
      description: "Adds a noindex tag and leaves the page out of the sitemap.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "blocks",
      description: "The sections of the page, top to bottom.",
      type: "array",
      of: blockTypes.map((block) => defineArrayMember({ type: block.name })),
    }),
  ],
  preview: {
    select: { title: "title", slug: "slug.current", language: "language", note: "editorNote" },
    prepare: ({ title, slug, language, note }) => ({
      title: note?.startsWith("TEST PAGE") ? `⚠ ${title} (test page)` : title,
      subtitle: [
        language ? language.toUpperCase() : "No language",
        slug ? `/${slug === "home" ? "" : slug}` : "No slug",
      ].join(" · "),
    }),
  },
});
