import { Navigate, useParams } from "react-router-dom";

import { EditorShell } from "@/components/EditorShell";
import { isMeterCatalogId } from "@/lib/meters/presets";

/** `/write/:slug` — seeded editor for a catalog meter. Unknown → home. */
export function WriteRoute() {
  const { slug } = useParams<{ slug: string }>();
  if (
    !slug ||
    !isMeterCatalogId(slug) ||
    slug === "custom" ||
    slug === "none"
  ) {
    return <Navigate to="/" replace />;
  }
  return <EditorShell />;
}
