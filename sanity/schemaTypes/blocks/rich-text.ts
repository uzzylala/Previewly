import { defineArrayMember, defineField, defineType } from "sanity";

import { anchorField, eyebrowField } from "../fields";

export const richText = defineType({
  name: "richText",
  title: "Rich text",
  type: "object",
  fields: [
    eyebrowField,
    defineField({
      name: "body",
      type: "array",
      validation: (rule) => rule.required(),
      of: [
        defineArrayMember({
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
        }),
      ],
    }),
    anchorField,
  ],
  preview: {
    select: { eyebrow: "eyebrow", body: "body" },
    prepare: ({ eyebrow, body }) => {
      const first = (body as { children?: { text?: string }[] }[] | undefined)?.[0];
      return {
        title: eyebrow || first?.children?.map((child) => child.text).join("") || "Rich text",
        subtitle: "Rich text",
      };
    },
  },
});
