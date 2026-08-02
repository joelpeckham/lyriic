import { Navigate } from "react-router-dom";

import { AboutPage } from "@/components/pages/AboutPage";
import { hasPersistedDraft } from "@/lib/projects/storage";

/** `/` — about landing, or `/write` once a draft has been persisted. */
export function RootRoute() {
  if (hasPersistedDraft()) {
    return <Navigate to="/write" replace />;
  }
  return <AboutPage />;
}
