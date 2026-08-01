import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { EditorShell } from "./components/EditorShell";
import { FaqPage } from "./components/pages/FaqPage";
import { HaikuCheckerPage } from "./components/pages/HaikuCheckerPage";
import { PrivacyPage } from "./components/pages/PrivacyPage";
import { RhymeFinderPage } from "./components/pages/RhymeFinderPage";
import { SyllableCounterPage } from "./components/pages/SyllableCounterPage";
import { Toaster } from "./components/ui/sonner";
import { PrefsProvider } from "./hooks/usePrefs.tsx";
import "./fonts.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrefsProvider>
      <BrowserRouter>
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
      </BrowserRouter>
      <Toaster position="bottom-center" />
    </PrefsProvider>
  </StrictMode>,
);
