import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { EditorShell } from "./components/EditorShell";
import { Toaster } from "./components/ui/sonner";

const FaqPage = lazy(() =>
  import("./components/pages/FaqPage").then((m) => ({ default: m.FaqPage })),
);
const PrivacyPage = lazy(() =>
  import("./components/pages/PrivacyPage").then((m) => ({
    default: m.PrivacyPage,
  })),
);
const ToolsIndexPage = lazy(() =>
  import("./components/pages/ToolsIndexPage").then((m) => ({
    default: m.ToolsIndexPage,
  })),
);
const ToolRoute = lazy(() =>
  import("./components/pages/toolRoutes").then((m) => ({
    default: m.ToolRoute,
  })),
);
const WriteRoute = lazy(() =>
  import("./components/pages/WriteRoute").then((m) => ({
    default: m.WriteRoute,
  })),
);

function RouteFallback() {
  return (
    <div
      className="min-h-dvh bg-background"
      aria-busy="true"
      aria-label="Loading"
    />
  );
}

export function App() {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<EditorShell />} />
            <Route path="/write/:slug" element={<WriteRoute />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/tools" element={<ToolsIndexPage />} />
            <Route path="/tools/:slug" element={<ToolRoute />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster position="bottom-center" />
    </>
  );
}
