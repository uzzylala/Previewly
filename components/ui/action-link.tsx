import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
};

const styles = {
  primary:
    "rounded-xs bg-ink px-5 py-3 text-paper hover:bg-proof active:scale-[0.98] transition-[background-color,transform]",
  secondary:
    "py-3 text-ink underline decoration-1 underline-offset-[6px] hover:text-proof hover:decoration-2 transition-[color,text-decoration-thickness]",
} as const;

function isInternal(href: string) {
  return href.startsWith("/") && !href.startsWith("//");
}

/** A call-to-action link: client-side navigation for site paths, a plain anchor otherwise. */
export function ActionLink({ href, children, variant = "primary" }: Props) {
  const className = `inline-flex items-center text-base font-medium duration-200 ease-out-quint ${styles[variant]}`;

  if (isInternal(href)) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  const external = /^https?:/.test(href);
  return (
    <a
      href={href}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
