import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { EditorShell } from "./components/EditorShell";
import { PrefsProvider } from "./hooks/usePrefs.tsx";
import "./fonts.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrefsProvider>
      <EditorShell />
    </PrefsProvider>
  </StrictMode>,
);
