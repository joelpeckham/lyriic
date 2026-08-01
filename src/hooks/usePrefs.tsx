import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  applyPrefsToDocument,
  loadPrefs,
  savePrefs,
  type AppPrefs,
  type ContrastPref,
  type ThemePref,
} from "@/lib/prefs";

type PrefsContextValue = {
  prefs: AppPrefs;
  setTheme: (theme: ThemePref) => void;
  setContrast: (contrast: ContrastPref) => void;
  markEditorHintSeen: () => void;
};

const PrefsContext = createContext<PrefsContextValue | null>(null);

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefsState] = useState<AppPrefs>(() => loadPrefs());

  function setTheme(theme: ThemePref) {
    setPrefsState((prev) => {
      const next = { ...prev, theme };
      savePrefs(next);
      return next;
    });
  }

  function setContrast(contrast: ContrastPref) {
    setPrefsState((prev) => {
      const next = { ...prev, contrast };
      savePrefs(next);
      return next;
    });
  }

  function markEditorHintSeen() {
    setPrefsState((prev) => {
      if (prev.seenEditorHint) return prev;
      const next = { ...prev, seenEditorHint: true };
      savePrefs(next);
      return next;
    });
  }

  // Single DOM apply path for prefs changes (and initial mount).
  useEffect(() => {
    applyPrefsToDocument(prefs);
  }, [prefs]);

  useEffect(() => {
    if (prefs.theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyPrefsToDocument(prefs);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [prefs]);

  return (
    <PrefsContext.Provider
      value={{ prefs, setTheme, setContrast, markEditorHintSeen }}
    >
      {children}
    </PrefsContext.Provider>
  );
}

export function usePrefs(): PrefsContextValue {
  const ctx = useContext(PrefsContext);
  if (!ctx) {
    throw new Error("usePrefs must be used within PrefsProvider");
  }
  return ctx;
}
