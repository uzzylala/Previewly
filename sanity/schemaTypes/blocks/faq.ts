import { defineArrayMember, defineField, defineType } from "sanity";

import { anchorField, eyebrowField } from "../fields";

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "object",
  fields: [
    eyebrowField,
    defineField({ name: "heading", type: "string", validation: (rule) => rule.max(90) }),
    defineField({
      name: "items",
      title: "Questions",
      type: "array",
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          name: "faqItem",
          type: "object",
          fields: [
            defineField({ name: "question", type: "string", validation: (rule) => rule.required() }),
            defineField({
              name: "answer",
              description: "Separate paragraphs with a blank line.",
              type: "text",
              rows: 4,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "question", subtitle: "answer" } },
        }),
      ],
    }),
    anchorField,
  ],
  preview: {
    select: { title: "heading", items: "items" },
    prepare: ({ title, items }) => ({
      title: title || "FAQ",
      subtitle: `FAQ · ${items?.length ?? 0} questions`,
    }),
  },
});
