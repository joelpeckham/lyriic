import { Navigate, useParams } from "react-router-dom";

import { PoemPage } from "@/components/pages/PoemPage";
import { getPoemPageBySlug } from "@/content/poems";

export function PoemRoute() {
  const { slug } = useParams<{ slug: string }>();
  const page = slug ? getPoemPageBySlug(slug) : undefined;
  if (!page) return <Navigate to="/poems" replace />;
  return <PoemPage page={page} />;
}
