/** The brand name: always Latin script, left to right, and never translated or mirrored. */
export function Wordmark() {
  return (
    <span dir="ltr" translate="no" lang="en" className="inline-block font-display text-2xl tracking-tight">
      Preview<em className="display-emphasis">ly</em>
    </span>
  );
}
