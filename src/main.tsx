import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";
import { scheduleLexiconLoad } from "./lib/data/scheduleLexiconLoad";
import { PrefsProvider } from "./hooks/usePrefs.tsx";
import "./fonts.css";
import "./index.css";

scheduleLexiconLoad();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrefsProvider>
      <App />
    </PrefsProvider>
  </StrictMode>,
);
