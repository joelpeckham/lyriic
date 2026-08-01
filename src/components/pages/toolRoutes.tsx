import { Suspense, lazy, type ComponentType, type LazyExoticComponent } from "react";
import { Navigate, useParams } from "react-router-dom";

import { FormToolPage } from "@/components/pages/FormToolPage";
import { ToolPage } from "@/components/pages/ToolPage";
import {
  getComposedFormToolPageBySlug,
  isFormCheckerSlug,
  meterIdFromCheckerSlug,
} from "@/content/formCheckers";
import { getToolBySlug } from "@/content/tools";

type ToolComponent = LazyExoticComponent<ComponentType>;

const FormCheckerLazy = lazy(() =>
  import("@/components/tools/FormCheckerTool").then((m) => ({
    default: m.FormCheckerTool,
  })),
);

/** slug → lazy tool interactive (utility tools only; form checkers share one chunk). */
export const TOOL_COMPONENTS: Record<string, ToolComponent> = {
  "syllable-counter": lazy(() =>
    import("@/components/tools/SyllableCounterTool").then((m) => ({
      default: m.SyllableCounterTool,
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

function FormCheckerRoute({ meterId }: { meterId: string }) {
  const page = getComposedFormToolPageBySlug(`${meterId}-checker`);
  if (!page) {
    return <Navigate to="/" replace />;
  }
  return (
    <FormToolPage page={page}>
      <Suspense fallback={<ToolFallback />}>
        <FormCheckerLazy key={meterId} meterId={meterId} />
      </Suspense>
    </FormToolPage>
  );
}

/** Single `/tools/:slug` route: SEO shell + lazy tool body. Unknown → `/`. */
export function ToolRoute() {
  const { slug } = useParams<{ slug: string }>();

  if (slug && isFormCheckerSlug(slug)) {
    const meterId = meterIdFromCheckerSlug(slug);
    if (!meterId) {
      return <Navigate to="/" replace />;
    }
    return <FormCheckerRoute meterId={meterId} />;
  }

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
