import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { EditorShell } from "./components/EditorShell";
import { Toaster } from "./components/ui/sonner";
import { PrefsProvider } from "./hooks/usePrefs.tsx";
import "./fonts.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrefsProvider>
      <EditorShell />
      <Toaster position="bottom-center" />
    </PrefsProvider>
  </StrictMode>,
);
