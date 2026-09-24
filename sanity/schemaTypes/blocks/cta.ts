import { defineArrayMember, defineField, defineType } from "sanity";

import { anchorField } from "../fields";

export const cta = defineType({
  name: "cta",
  title: "Call to action",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string", validation: (rule) => rule.required().max(80) }),
    defineField({ name: "body", type: "text", rows: 2, validation: (rule) => rule.max(200) }),
    defineField({
      name: "actions",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
      description: "The first action is styled as the primary button.",
      validation: (rule) => rule.required().min(1).max(2),
    }),
    anchorField,
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "Untitled call to action", subtitle: "Call to action" }),
  },
});
