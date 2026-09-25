/** Portable Text and link builders shared by the seed content files. */

export type Span = string | { text: string; marks: string[] };
export type MarkDef = { _key: string; _type: "link"; href: string };

let keySeq = 0;
export const key = (prefix: string) => `${prefix}${++keySeq}`;

export function block(
  style: "normal" | "h2" | "h3" | "blockquote",
  spans: Span[],
  opts: { listItem?: "bullet" | "number"; markDefs?: MarkDef[] } = {},
) {
  return {
    _type: "block",
    _key: key("b"),
    style,
    ...(opts.listItem ? { listItem: opts.listItem, level: 1 } : {}),
    markDefs: opts.markDefs ?? [],
    children: spans.map((span) => ({
      _type: "span",
      _key: key("s"),
      text: typeof span === "string" ? span : span.text,
      marks: typeof span === "string" ? [] : span.marks,
    })),
  };
}

export const link = (_key: string, label: string, href: string) => ({
  _type: "link" as const,
  _key,
  label,
  href,
});

