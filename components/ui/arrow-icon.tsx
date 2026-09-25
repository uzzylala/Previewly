/**
 * A directional arrow: it points "onward", so it flips to point left in right-to-left
 * layouts. (Non-directional marks, like the logo and the FAQ plus, never flip.)
 */
export function ArrowIcon({ className = "" }: { className?: string }) {
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
      className={`shrink-0 rtl:-scale-x-100 ${className}`}
    >
      <path d="M2 8h11M9 3.5 13.5 8 9 12.5" />
    </svg>
  );
}
