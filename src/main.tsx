import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { EditorShell } from "./components/EditorShell";
import { Toaster } from "./components/ui/sonner";
import { PrefsProvider } from "./hooks/usePrefs.tsx";
import "./fonts.css";
import "./index.css";

const FaqPage = lazy(() =>
  import("./components/pages/FaqPage").then((m) => ({ default: m.FaqPage })),
);
const PrivacyPage = lazy(() =>
  import("./components/pages/PrivacyPage").then((m) => ({
    default: m.PrivacyPage,
  })),
);
const SyllableCounterPage = lazy(() =>
  import("./components/pages/SyllableCounterPage").then((m) => ({
    default: m.SyllableCounterPage,
  })),
);
const HaikuCheckerPage = lazy(() =>
  import("./components/pages/HaikuCheckerPage").then((m) => ({
    default: m.HaikuCheckerPage,
  })),
);
const RhymeFinderPage = lazy(() =>
  import("./components/pages/RhymeFinderPage").then((m) => ({
    default: m.RhymeFinderPage,
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
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route
              path="/tools/syllable-counter"
              element={<SyllableCounterPage />}
            />
            <Route path="/tools/haiku-checker" element={<HaikuCheckerPage />} />
            <Route path="/tools/rhyme-finder" element={<RhymeFinderPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster position="bottom-center" />
    </PrefsProvider>
  </StrictMode>,
);
