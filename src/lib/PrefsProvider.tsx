import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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
  setPrefs: (next: AppPrefs) => void;
};

const PrefsContext = createContext<PrefsContextValue | null>(null);

function commitPrefs(
  next: AppPrefs,
  setPrefsState: (next: AppPrefs) => void,
): void {
  setPrefsState(next);
  savePrefs(next);
}

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefsState] = useState<AppPrefs>(() => loadPrefs());

  const setPrefs = useCallback((next: AppPrefs) => {
    commitPrefs(next, setPrefsState);
  }, []);

  const setTheme = useCallback(
    (theme: ThemePref) => {
      commitPrefs({ ...prefs, theme }, setPrefsState);
    },
    [prefs],
  );

  const setContrast = useCallback(
    (contrast: ContrastPref) => {
      commitPrefs({ ...prefs, contrast }, setPrefsState);
    },
    [prefs],
  );

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

  const value = useMemo(
    () => ({ prefs, setTheme, setContrast, setPrefs }),
    [prefs, setTheme, setContrast, setPrefs],
  );

  return (
    <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>
  );
}

export function usePrefs(): PrefsContextValue {
  const ctx = useContext(PrefsContext);
  if (!ctx) {
    throw new Error("usePrefs must be used within PrefsProvider");
  }
  return ctx;
}
