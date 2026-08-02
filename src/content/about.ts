/**
 * Copy and verse samples for the /about page.
 * Each sample is live-edited via PoemEditor (embed) with real meter settings.
 */

import {
  overlaysForMeterSeed,
  resolveMeterConfig,
} from "@/lib/meters/presets";
import {
  DEFAULT_SETTINGS,
  type EditorSettings,
} from "@/lib/settings";

export const ABOUT_TITLE = "lyriic — about";

export const ABOUT_DESCRIPTION =
  "A free, local-first zen editor for writing poetry and lyrics in meter — syllable counts, optional rulers, and quiet word tools in your browser.";

export const ABOUT_ORIGIN_URL = "https://jpeckham.com/projects/lyriic/";

export type AboutPoem = {
  /** Short UI label above the poem. */
  label: string;
  /** Plain-language summary for accessibility (not shown as marketing prose). */
  summary: string;
  /** Full poem text (newline-separated lines). */
  text: string;
  settings: EditorSettings;
};

/** Build editor settings for an about demo from a catalog/custom meter id. */
function aboutMeterSettings(
  meter: string,
  options: {
    customPattern?: number[];
    showStress?: boolean;
    showMeterBreaks?: boolean;
    showRhymeScheme?: boolean;
  } = {},
): EditorSettings {
  const customPattern = options.customPattern ?? DEFAULT_SETTINGS.customPattern;
  const config = resolveMeterConfig({
    meter,
    customPattern,
    customFoot: DEFAULT_SETTINGS.customFoot,
    customRhymePattern: DEFAULT_SETTINGS.customRhymePattern,
  });
  const overlays = overlaysForMeterSeed(config);
  return {
    ...DEFAULT_SETTINGS,
    meter,
    customPattern,
    ...overlays,
    showStress: options.showStress ?? overlays.showStress,
    showMeterBreaks: options.showMeterBreaks ?? overlays.showMeterBreaks,
    showRhymeScheme: options.showRhymeScheme ?? false,
  };
}

/** Hero sample — one quiet octosyllabic line with counts + rulers. */
export const ABOUT_HERO: AboutPoem = {
  label: "Hero",
  summary: "A quiet octosyllabic line with live syllable counts and rulers.",
  text: "A quiet number by the line",
  settings: aboutMeterSettings("custom", { customPattern: [8] }),
};

/** Why we built it — haiku 5/7/5. */
export const ABOUT_WHY: AboutPoem = {
  label: "Why",
  summary:
    "Counting syllables by hand broke the flow of writing, so lyriic keeps quiet counts beside the line.",
  text: ["Fingers on the desk", "counting stole the quiet draft", "tools stay out of sight"].join(
    "\n",
  ),
  settings: aboutMeterSettings("haiku"),
};

/**
 * Feature poems — each names a capability without brochure paragraphs.
 * Stress sample uses iambic tetrameter marks (˘ ˈ).
 */
export const ABOUT_FEATURES: AboutPoem[] = [
  {
    label: "Syllables",
    summary: "Per-line syllable counts sit in the gutter as you write.",
    text: [
      "five by the gutter",
      "the line breathes; the number waits",
      "exact, not a shove",
    ].join("\n"),
    settings: aboutMeterSettings("haiku"),
  },
  {
    label: "When it runs long",
    summary: "Lines over the meter target show a clear over count.",
    text: "beautiful memories forever",
    settings: aboutMeterSettings("custom", { customPattern: [5] }),
  },
  {
    label: "Meter",
    summary: "Optional rulers and stress marks show the foot under the line.",
    text: "I meant to write a song tonight",
    settings: aboutMeterSettings("iambic-tetrameter", {
      showStress: true,
      showMeterBreaks: true,
    }),
  },
  {
    label: "Word tools",
    summary: "Hover or tap a word for rhymes, synonyms, and definitions.",
    text: "Tap a word — rhymes come quiet",
    settings: aboutMeterSettings("custom", { customPattern: [7] }),
  },
  {
    label: "Local",
    summary: "Drafts stay in the browser. No account. Works offline after load.",
    text: "No account. The draft stays here.",
    settings: aboutMeterSettings("custom", { customPattern: [7] }),
  },
];

/** Stance limerick — free, local-first, not generative AI. */
export const ABOUT_STANCE: AboutPoem = {
  label: "Stance",
  summary:
    "Free and local-first: no account, no generative AI writing your verse, drafts stay on your device.",
  text: [
    "A draft that can live on its own—",
    "no account, no cloud, and no throne.",
    "No AI writes lines;",
    "the meter just shines—",
    "your poem stays here, not a loan.",
  ].join("\n"),
  settings: aboutMeterSettings("limerick"),
};

export const ABOUT_CLOSE_LINE = "Open a blank page. Count with the eye.";
