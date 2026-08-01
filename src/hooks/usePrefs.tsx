import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { migrateFontSizeToPrefsIfNeeded } from "@/lib/projects/storage";
import {
  applyPrefsToDocument,
  clampFontSize,
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
  setFontSize: (fontSize: number) => void;
};

const PrefsContext = createContext<PrefsContextValue | null>(null);

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefsState] = useState<AppPrefs>(() => {
    // Run before first loadPrefs so legacy project fontSize is available.
    migrateFontSizeToPrefsIfNeeded();
    return loadPrefs();
  });

  function setTheme(theme: ThemePref) {
    setPrefsState((prev) => ({ ...prev, theme }));
  }

  function setContrast(contrast: ContrastPref) {
    setPrefsState((prev) => ({ ...prev, contrast }));
  }

  function setFontSize(fontSize: number) {
    setPrefsState((prev) => ({
      ...prev,
      fontSize: clampFontSize(fontSize),
    }));
  }

  // Persist outside setState updaters.
  useEffect(() => {
    savePrefs(prefs);
  }, [prefs]);

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
      value={{ prefs, setTheme, setContrast, setFontSize }}
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
