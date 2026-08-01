import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { EditorShell } from "./components/EditorShell";
import { FaqPage } from "./components/pages/FaqPage";
import { PrivacyPage } from "./components/pages/PrivacyPage";
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
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-center" />
    </PrefsProvider>
  </StrictMode>,
);
