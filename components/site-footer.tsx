import { Wordmark } from "./ui/wordmark";

export function SiteFooter() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex max-w-page flex-wrap items-baseline justify-between gap-4 px-gutter py-10 text-sm text-ink-soft">
        <Wordmark />
        <p>Draft it. Proof it. Publish it.</p>
      </div>
    </footer>
  );
}
