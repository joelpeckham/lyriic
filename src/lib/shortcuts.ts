/** Platform-agnostic app shortcuts (Mod = ⌘ on macOS, Ctrl elsewhere). */

export function isModKey(event: KeyboardEvent): boolean {
  return event.metaKey || event.ctrlKey;
}

/**
 * Handle global app shortcuts. Returns true if the event was consumed.
 * - Mod-, → toggle settings
 * - Mod-. → focus poem canvas
 * Escape closes settings when open (does not steal CM Escape when closed).
 */
export function handleAppShortcut(
  event: KeyboardEvent,
  options: {
    settingsOpen: boolean;
    setSettingsOpen: (open: boolean) => void;
    focusPoem: () => void;
  },
): boolean {
  const { settingsOpen, setSettingsOpen, focusPoem } = options;

  if (event.key === "Escape" && settingsOpen) {
    event.preventDefault();
    setSettingsOpen(false);
    focusPoem();
    return true;
  }

  if (!isModKey(event) || event.altKey || event.shiftKey) return false;

  // Mod-,
  if (event.key === ",") {
    event.preventDefault();
    setSettingsOpen(!settingsOpen);
    return true;
  }

  // Mod-.
  if (event.key === ".") {
    event.preventDefault();
    if (settingsOpen) setSettingsOpen(false);
    focusPoem();
    return true;
  }

  return false;
}

/** Display labels for Settings → Keyboard (Mac-first; fine for v1). */
export const SHORTCUT_HINTS = [
  { action: "Settings", keys: "⌘ + ," },
  { action: "Focus poem", keys: "⌘ + ." },
] as const;
