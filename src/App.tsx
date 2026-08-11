import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

import { EditorShell } from "./components/EditorShell";
import { Grain } from "./components/Grain";
import { WriteRoute } from "./components/pages/WriteRoute";
import { RouteErrorBoundary } from "./components/RouteErrorBoundary";
import { Toaster } from "./components/ui/sonner";
import { lazyWithRetry } from "./lib/lazyWithRetry";

const RootRoute = lazyWithRetry(() =>
  import("./components/pages/RootRoute").then((m) => ({
    default: m.RootRoute,
  })),
);
const AboutPage = lazyWithRetry(() =>
  import("./components/pages/AboutPage").then((m) => ({
    default: m.AboutPage,
  })),
);
const FaqPage = lazyWithRetry(() =>
  import("./components/pages/FaqPage").then((m) => ({ default: m.FaqPage })),
);
const PrivacyPage = lazyWithRetry(() =>
  import("./components/pages/PrivacyPage").then((m) => ({
    default: m.PrivacyPage,
  })),
);
const ToolsIndexPage = lazyWithRetry(() =>
  import("./components/pages/ToolsIndexPage").then((m) => ({
    default: m.ToolsIndexPage,
  })),
);
const ToolRoute = lazyWithRetry(() =>
  import("./components/pages/toolRoutes").then((m) => ({
    default: m.ToolRoute,
  })),
);
const PoemsIndexPage = lazyWithRetry(() =>
  import("./components/pages/PoemsIndexPage").then((m) => ({
    default: m.PoemsIndexPage,
  })),
);
const PoemRoute = lazyWithRetry(() =>
  import("./components/pages/PoemRoute").then((m) => ({
    default: m.PoemRoute,
  })),
);

function RouteFallback() {
  return (
    <div
      className="flex min-h-dvh flex-1 flex-col items-center justify-center bg-background px-6 font-[family-name:var(--font-ui)] text-sm text-muted-foreground"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading"
    >
      Loading…
    </div>
  );
}

export function App() {
  return (
    <>
      <Grain />
      <BrowserRouter>
        <RouteErrorBoundary>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<RootRoute />} />
              <Route path="/write" element={<EditorShell />} />
              <Route path="/write/:slug" element={<WriteRoute />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/tools" element={<ToolsIndexPage />} />
              <Route path="/tools/:slug" element={<ToolRoute />} />
              <Route path="/poems" element={<PoemsIndexPage />} />
              <Route path="/poems/:slug" element={<PoemRoute />} />
            </Routes>
          </Suspense>
        </RouteErrorBoundary>
      </BrowserRouter>
      <Toaster position="bottom-center" />
      <Analytics />
    </>
  );
}
