/** Platform-agnostic app shortcuts (Mod = ⌘ on macOS, Ctrl elsewhere). */

export function isModKey(event: KeyboardEvent): boolean {
  return event.metaKey || event.ctrlKey;
}

function isApplePlatform(): boolean {
  if (typeof navigator === "undefined") return false;
  const uaData = (
    navigator as Navigator & {
      userAgentData?: { platform?: string };
    }
  ).userAgentData;
  const platform =
    typeof uaData?.platform === "string"
      ? uaData.platform
      : navigator.platform;
  return /Mac|iPhone|iPod|iPad/i.test(platform);
}

const MOD_GLYPH = isApplePlatform() ? "⌘" : "Ctrl";
const SHIFT_GLYPH = isApplePlatform() ? "⇧" : "Shift";

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

/** Shared Word tools sentence for Settings + FAQ. */
export const WORD_TOOLS_HINT =
  "Tap a word for tools. Long-press for synonyms.";

/** Display labels for Settings → Keyboard (platform-correct Mod glyph). */
export const SHORTCUT_HINTS = [
  { action: "Settings", keys: `${MOD_GLYPH} + ,` },
  { action: "Focus poem", keys: `${MOD_GLYPH} + .` },
  { action: "Synonyms", keys: `${MOD_GLYPH} + '` },
  { action: "Rhymes", keys: `${MOD_GLYPH} + ;` },
  {
    action: "Syllables",
    keys: `${MOD_GLYPH} + ${SHIFT_GLYPH} + '`,
  },
] as const;

/** Word-tool shortcuts only (surfaced next to the Word tools section). */
export const WORD_TOOL_SHORTCUT_HINTS = SHORTCUT_HINTS.filter((hint) =>
  hint.action === "Synonyms" ||
  hint.action === "Rhymes" ||
  hint.action === "Syllables",
);
