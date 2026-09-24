import type { ReactNode } from "react";

import type { PAGE_QUERY_RESULT } from "@/sanity/types";

/** Union of every block the page query can return, generated from the Sanity schema. */
export type PageBlock = NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number];

export type BlockType = PageBlock["_type"];

/** Props for one block type, e.g. BlockProps<"faq">. */
export type BlockProps<T extends BlockType> = Extract<PageBlock, { _type: T }>;

/** Blocks are server components; they may be async. */
export type BlockComponent<P> = (props: P) => ReactNode | Promise<ReactNode>;
