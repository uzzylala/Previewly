import { SiteLink } from "./site-link";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  /** "inverse" is for use on ink backgrounds. */
  tone?: "default" | "inverse";
};

const styles = {
  default: {
    primary: "rounded-xs bg-ink px-5 py-3 text-paper hover:bg-proof",
    secondary: "py-3 text-ink hover:text-proof",
  },
  inverse: {
    primary: "rounded-xs bg-paper px-5 py-3 text-ink hover:bg-proof hover:text-paper",
    secondary: "py-3 text-paper hover:text-paper",
  },
} as const;

const variantBase = {
  primary: "active:scale-[0.98] transition-[background-color,color,transform]",
  secondary:
    "underline decoration-1 underline-offset-[6px] hover:decoration-2 transition-[color,text-decoration-thickness]",
} as const;

export function isInternalHref(href: string) {
  return (href.startsWith("/") && !href.startsWith("//")) || href.startsWith("#");
}

/** A call-to-action link: client-side navigation for site paths, a plain anchor otherwise. */
export function ActionLink({ href, children, variant = "primary", tone = "default" }: Props) {
  const className = `inline-flex items-center text-base font-medium duration-200 ease-out-quint motion-reduce:transition-none ${variantBase[variant]} ${styles[tone][variant]}`;

  if (isInternalHref(href)) {
    return (
      <SiteLink href={href} className={className}>
        {children}
      </SiteLink>
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
