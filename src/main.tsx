import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import { PrefsProvider } from "./hooks/usePrefs.tsx";
import { loadDict } from "./lib/syllables/dict";
import "./fonts.css";
import "./index.css";

// Load CMU after first paint so the chunk does not contend with LCP/fonts.
// Counts use heuristics until ready; PoemEditor recounts on dict revision.
const scheduleDictLoad = () => {
  void loadDict();
};
if (typeof window.requestIdleCallback === "function") {
  window.requestIdleCallback(scheduleDictLoad, { timeout: 2000 });
} else {
  window.setTimeout(scheduleDictLoad, 1);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrefsProvider>
      <App />
    </PrefsProvider>
  </StrictMode>,
);
