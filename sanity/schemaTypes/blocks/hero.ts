import { defineArrayMember, defineField, defineType } from "sanity";

import { anchorField, eyebrowField } from "../fields";

export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "object",
  fields: [
    eyebrowField,
    defineField({
      name: "heading",
      type: "string",
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: "emphasis",
      title: "Emphasised words",
      description:
        "Words from the heading to set in italic. Must match the heading text exactly; ignored otherwise.",
      type: "string",
      validation: (rule) =>
        rule.custom((value, context) => {
          const heading = (context.parent as { heading?: string } | undefined)?.heading;
          if (!value || !heading) return true;
          return heading.includes(value) ? true : "Not found in the heading, so it will be ignored.";
        }).warning(),
    }),
    defineField({
      name: "body",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(240),
    }),
    defineField({
      name: "actions",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
      description: "The first action is styled as the primary button.",
      validation: (rule) => rule.max(2),
    }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          description: "Describe the image for screen readers. Leave empty if purely decorative.",
        }),
      ],
    }),
    anchorField,
  ],
  preview: {
    select: { title: "heading", media: "image" },
    prepare: ({ title, media }) => ({ title: title || "Untitled hero", subtitle: "Hero", media }),
  },
});
