import { createNavigation } from "next-intl/navigation";

import { routing } from "./routing";

/** Locale-aware Link: a "/pricing" href renders as "/fr/pricing" on a French page. */
export const { Link } = createNavigation(routing);
