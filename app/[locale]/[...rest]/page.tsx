import { notFound } from "next/navigation";

/** Unknown deeper paths get the localised 404 (inside the [locale] layout) instead of the bare default. */
export function generateStaticParams() {
  return [{ locale: "en", rest: ["__placeholder__", "__placeholder__"] }];
}

export default function CatchAll() {
  notFound();
}
