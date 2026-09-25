import { defineArrayMember, defineField, defineType } from "sanity";

import { isUniqueInLanguage, slugify, SLUG_PATTERN } from "../../lib/slug";
import { richTextMember } from "../fields";

/**
 * A blog post. Localised exactly like a page: one document per language, linked by a
 * translation.metadata document, with its own localised slug, tags and cover alt text.
 */
export const post = defineType({
  name: "post",
  title: "Blog post",
  type: "document",
  fields: [
    defineField({ name: "language", type: "string", readOnly: true, hidden: true }),
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required().max(110),
    }),
    defineField({
      name: "slug",
      description: "The post's URL: /<language>/blog/<slug>. Each language has its own, in its own script.",
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
      name: "excerpt",
      description: "Shown on the blog index and in search and social previews.",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: "coverImage",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          description: "Describe the image for screen readers. Leave empty if purely decorative.",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "author",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published date",
      type: "datetime",
      options: { dateFormat: "YYYY-MM-DD", timeFormat: "HH:mm" },
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tags",
      description:
        "Short labels in this post's own language. Filtering by tag happens within a language, so translate them.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      validation: (rule) => rule.max(5).unique(),
    }),
    defineField({
      name: "body",
      type: "array",
      of: [richTextMember],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "noindex",
      title: "Hide from search engines",
      description: "Adds a noindex tag and leaves the post out of the sitemap and the blog index.",
      type: "boolean",
      initialValue: false,
    }),
  ],
  orderings: [
    { title: "Newest first", name: "publishedAtDesc", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", language: "language", date: "publishedAt", media: "coverImage" },
    prepare: ({ title, language, date, media }) => ({
      title,
      subtitle: [language ? language.toUpperCase() : "No language", date?.slice(0, 10)].filter(Boolean).join(" · "),
      media,
    }),
  },
});
