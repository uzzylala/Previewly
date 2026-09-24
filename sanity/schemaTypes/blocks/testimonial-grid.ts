import { defineArrayMember, defineField, defineType } from "sanity";

import { anchorField, eyebrowField } from "../fields";

export const testimonialGrid = defineType({
  name: "testimonialGrid",
  title: "Testimonial grid",
  type: "object",
  fields: [
    eyebrowField,
    defineField({ name: "heading", type: "string", validation: (rule) => rule.max(90) }),
    defineField({
      name: "testimonials",
      type: "array",
      validation: (rule) => rule.required().min(1).max(6),
      of: [
        defineArrayMember({
          name: "testimonial",
          type: "object",
          fields: [
            defineField({
              name: "quote",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required().max(280),
            }),
            defineField({ name: "name", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "role", description: "e.g. Head of Content, Tessellate", type: "string" }),
            defineField({
              name: "avatar",
              description: "Optional. Initials are shown when empty.",
              type: "image",
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "quote", media: "avatar" },
          },
        }),
      ],
    }),
    anchorField,
  ],
  preview: {
    select: { title: "heading", testimonials: "testimonials" },
    prepare: ({ title, testimonials }) => ({
      title: title || "Testimonials",
      subtitle: `Testimonial grid · ${testimonials?.length ?? 0} quotes`,
    }),
  },
});
