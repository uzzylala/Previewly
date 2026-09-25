import { defineArrayMember, defineField } from "sanity";

/** Optional in-page link target, shared by every block (e.g. /#how-it-works). */
export const anchorField = defineField({
  name: "anchor",
  title: "Anchor ID",
  description: 'Lets links jump to this section, e.g. "how-it-works" for /#how-it-works.',
  type: "string",
  validation: (rule) =>
    rule.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { name: "kebab-case" }).warning(),
});

export const eyebrowField = defineField({
  name: "eyebrow",
  description: "Short label above the heading.",
  type: "string",
  validation: (rule) => rule.max(40),
});

/**
 * The rich text editor's block: paragraph, headings, quote, lists, strong/em and links.
 * Shared by the richText block and blog posts so both render through the same components.
 */
export const richTextMember = defineArrayMember({
  type: "block",
  styles: [
    { title: "Paragraph", value: "normal" },
    { title: "Heading", value: "h2" },
    { title: "Subheading", value: "h3" },
    { title: "Quote", value: "blockquote" },
  ],
  lists: [
    { title: "Bullets", value: "bullet" },
    { title: "Numbered", value: "number" },
  ],
  marks: {
    decorators: [
      { title: "Strong", value: "strong" },
      { title: "Emphasis", value: "em" },
    ],
    annotations: [
      defineArrayMember({
        name: "link",
        type: "object",
        fields: [
          defineField({
            name: "href",
            type: "url",
            validation: (rule) =>
              rule.required().uri({ allowRelative: true, scheme: ["http", "https", "mailto"] }),
          }),
        ],
      }),
    ],
  },
});
