import { defineArrayMember, defineField, defineType } from "sanity";

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
    defineField({
      name: "title",
      description: "Used for the browser tab and search results.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      description: 'Use "home" for the homepage.',
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      description: "Search engine and social preview description.",
      type: "text",
      rows: 2,
      validation: (rule) => rule.max(160),
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
    select: { title: "title", slug: "slug.current" },
    prepare: ({ title, slug }) => ({ title, subtitle: slug ? `/${slug === "home" ? "" : slug}` : "No slug" }),
  },
});
