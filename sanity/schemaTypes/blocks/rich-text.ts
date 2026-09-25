import { defineField, defineType } from "sanity";

import { anchorField, eyebrowField, richTextMember } from "../fields";

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
        richTextMember,
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
