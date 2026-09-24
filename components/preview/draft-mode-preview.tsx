import { draftMode } from "next/headers";
import { Suspense } from "react";

import { PreviewBar, PreviewRefresh } from "./preview-bar";

/** Renders nothing for visitors; the bar and live refresh only exist in Draft Mode. */
export async function DraftModePreview() {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;

  return (
    // useSearchParams needs a Suspense boundary so the rest of the page can prerender.
    <Suspense>
      <PreviewBar />
      <PreviewRefresh />
    </Suspense>
  );
}
