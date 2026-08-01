import { Suspense, lazy, type ComponentType, type LazyExoticComponent } from "react";
import { Navigate, useParams } from "react-router-dom";

import { ToolPage } from "@/components/pages/ToolPage";
import { getToolBySlug } from "@/content/tools";

type ToolComponent = LazyExoticComponent<ComponentType>;

/** slug → lazy tool interactive (keeps each tool in its own chunk). */
export const TOOL_COMPONENTS: Record<string, ToolComponent> = {
  "syllable-counter": lazy(() =>
    import("@/components/tools/SyllableCounterTool").then((m) => ({
      default: m.SyllableCounterTool,
    })),
  ),
  "haiku-checker": lazy(() =>
    import("@/components/tools/HaikuCheckerTool").then((m) => ({
      default: m.HaikuCheckerTool,
    })),
  ),
  "rhyme-finder": lazy(() =>
    import("@/components/tools/RhymeFinderTool").then((m) => ({
      default: m.RhymeFinderTool,
    })),
  ),
};

function ToolFallback() {
  return (
    <div className="mt-8 min-h-40" aria-busy="true" aria-label="Loading tool" />
  );
}

/** Single `/tools/:slug` route: SEO shell + lazy tool body. Unknown → `/`. */
export function ToolRoute() {
  const { slug } = useParams<{ slug: string }>();
  const tool = slug ? getToolBySlug(slug) : undefined;
  const ToolComponent = slug ? TOOL_COMPONENTS[slug] : undefined;

  if (!tool || !ToolComponent) {
    return <Navigate to="/" replace />;
  }

  return (
    <ToolPage tool={tool}>
      <Suspense fallback={<ToolFallback />}>
        <ToolComponent />
      </Suspense>
    </ToolPage>
  );
}
