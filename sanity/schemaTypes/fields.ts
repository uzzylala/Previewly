import { defineField } from "sanity";

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
