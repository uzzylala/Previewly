import type { ReactNode } from "react";

import { BlockErrorBoundary } from "./block-error-boundary";
import { blockRegistry, isRegisteredBlock } from "./registry";
import type { BlockComponent, PageBlock } from "./types";

const isDev = process.env.NODE_ENV === "development";

/** At runtime a block may be of a type this build doesn't know (newer or deleted schema). */
type UntrustedBlock = { _type: string; _key?: string; anchor?: string };

/**
 * Renders a page's blocks in order. It never needs editing when a block type is added:
 * lookup goes through the registry, and failures are contained per block in two layers.
 *
 * 1. The block component is invoked here inside try/catch, so an exception while it
 *    renders on the server (including during static prerender, where a client error
 *    boundary can't help) drops that one block instead of failing the page.
 * 2. Its output is wrapped in a client error boundary for failures in its interactive
 *    parts after hydration.
 */
export async function BlockRenderer({ blocks }: { blocks: PageBlock[] | null | undefined }) {
  if (!blocks?.length) return null;
  const rendered = await Promise.all(blocks.map((block, index) => renderBlock(block, index)));
  return <>{rendered}</>;
}

async function renderBlock(block: UntrustedBlock, index: number): Promise<ReactNode> {
  const type = block._type;
  const key = block._key ?? `block-${index}`;

  if (!isRegisteredBlock(type)) {
    if (isDev) {
      console.warn(
        `[blocks] Unknown block type "${type}" (${key}) was skipped. Register it in components/blocks/registry.ts.`,
      );
    }
    return null;
  }

  let content: ReactNode;
  try {
    // One cast: TypeScript can't correlate the registry lookup with the narrowed block.
    const Component = blockRegistry[type] as BlockComponent<PageBlock>;
    content = await Component(block as PageBlock);
  } catch (error) {
    console.error(`[blocks] "${type}" (${key}) threw while rendering and was skipped.`, error);
    return null;
  }
  if (content == null) return null;

  return (
    <BlockErrorBoundary key={key} blockType={type} blockKey={key}>
      {block.anchor ? (
        <div id={block.anchor} className="scroll-mt-6">
          {content}
        </div>
      ) : (
        content
      )}
    </BlockErrorBoundary>
  );
}
