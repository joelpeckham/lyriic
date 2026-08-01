export const PREFS_STORAGE_KEY = "lyriic.prefs.v1";

export type ThemePref = "system" | "light" | "dark";
export type ContrastPref = "default" | "more";

export type AppPrefs = {
  theme: ThemePref;
  contrast: ContrastPref;
  /** Quiet first-run editor hint has been dismissed (typed or acknowledged). */
  seenEditorHint: boolean;
};

export const DEFAULT_PREFS: AppPrefs = {
  theme: "system",
  contrast: "default",
  seenEditorHint: false,
};

export function isThemePref(value: unknown): value is ThemePref {
  return value === "system" || value === "light" || value === "dark";
}

export function isContrastPref(value: unknown): value is ContrastPref {
  return value === "default" || value === "more";
}

/** Normalize persisted or partial prefs into a valid AppPrefs. */
export function normalizePrefs(raw: unknown): AppPrefs {
  const s =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  return {
    theme: isThemePref(s.theme) ? s.theme : DEFAULT_PREFS.theme,
    contrast: isContrastPref(s.contrast) ? s.contrast : DEFAULT_PREFS.contrast,
    seenEditorHint:
      typeof s.seenEditorHint === "boolean"
        ? s.seenEditorHint
        : DEFAULT_PREFS.seenEditorHint,
  };
}

export function loadPrefs(): AppPrefs {
  try {
    const raw = localStorage.getItem(PREFS_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PREFS };
    return normalizePrefs(JSON.parse(raw) as unknown);
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

export function savePrefs(prefs: AppPrefs): void {
  try {
    localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Quota / private mode — appearance still applies in-session.
  }
}

export function systemPrefersDark(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

export function resolveDark(theme: ThemePref): boolean {
  if (theme === "dark") return true;
  if (theme === "light") return false;
  return systemPrefersDark();
}

/** Apply theme/contrast classes and color-scheme to <html>. */
export function applyPrefsToDocument(prefs: AppPrefs): void {
  const root = document.documentElement;
  const dark = resolveDark(prefs.theme);
  root.classList.toggle("dark", dark);
  root.style.colorScheme = dark ? "dark" : "light";
  if (prefs.contrast === "more") {
    root.dataset.contrast = "more";
  } else {
    delete root.dataset.contrast;
  }
}
