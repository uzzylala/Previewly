/**
 * A directional arrow. "forward" points onward (right in LTR, left in RTL); "back" points
 * the other way. Both flip in right-to-left layouts, because direction is relative to the
 * reading order. Non-directional marks (the logo, the FAQ plus) never flip.
 */
export function ArrowIcon({ direction = "forward", className = "" }: { direction?: "forward" | "back"; className?: string }) {
  const flip = direction === "forward" ? "rtl:-scale-x-100" : "-scale-x-100 rtl:scale-x-100";
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      className={`shrink-0 ${flip} ${className}`}
    >
      <path d="M2 8h11M9 3.5 13.5 8 9 12.5" />
    </svg>
  );
}
