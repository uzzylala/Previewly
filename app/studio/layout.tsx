// The Studio is its own app: a separate root layout keeps site fonts, CSS and chrome out of it.
export default function StudioLayout({ children }: LayoutProps<"/studio">) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
