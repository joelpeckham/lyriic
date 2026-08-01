import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { scheduleLexiconLoad } from "./lib/data/scheduleLexiconLoad";
import { EditorShell } from "./components/EditorShell";
import { Toaster } from "./components/ui/sonner";
import { PrefsProvider } from "./hooks/usePrefs.tsx";
import "./fonts.css";
import "./index.css";

scheduleLexiconLoad();

const FaqPage = lazy(() =>
  import("./components/pages/FaqPage").then((m) => ({ default: m.FaqPage })),
);
const PrivacyPage = lazy(() =>
  import("./components/pages/PrivacyPage").then((m) => ({
    default: m.PrivacyPage,
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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrefsProvider>
      <BrowserRouter>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<EditorShell />} />
            <Route path="/write/:slug" element={<WriteRoute />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/tools/:slug" element={<ToolRoute />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster position="bottom-center" />
    </PrefsProvider>
  </StrictMode>,
);
