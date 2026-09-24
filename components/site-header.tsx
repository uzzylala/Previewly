import Link from "next/link";

import { Wordmark } from "./ui/wordmark";

export function SiteHeader() {
  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex h-16 max-w-page items-center justify-between px-gutter">
        <Link href="/" aria-label="Previewly home" className="rounded-xs">
          <Wordmark />
        </Link>
      </div>
    </header>
  );
}
