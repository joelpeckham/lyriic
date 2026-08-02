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

/** Hero sample — soft count as companion, not drill sergeant. */
export const ABOUT_HERO: AboutPoem = {
  label: "Hero",
  summary:
    "A soft syllable count keeps quiet time—no boots, no brass—just counting feet.",
  text: ["A soft count keeps a quiet beat", "No boots, no brass—just counting feet."].join(
    "\n",
  ),
  settings: aboutMeterSettings("iambic-tetrameter", { showStress: false }),
};

/** Why we built it — hand-counting broke the draft. */
export const ABOUT_WHY: AboutPoem = {
  label: "Why",
  summary:
    "Hand-counting syllables broke drafting, so the tally sits quietly beside the line.",
  text: [
    "I counted by tapping my fingers for hours;",
    "The poem grew legs and ran off to the flowers.",
    "A digit now loiters beside every line,",
    "And I draft at a canter—no knuckle-count shrine.",
  ].join("\n"),
  settings: aboutMeterSettings("anapestic-tetrameter"),
};

/**
 * Feature poems — each names a capability without brochure paragraphs.
 */
export const ABOUT_FEATURES: AboutPoem[] = [
  {
    label: "Syllables",
    summary:
      "Per-line syllable counts sit quietly in the gutter—exact, patient, and never bossy.",
    text: [
      "I keep a small clerk in the gutter of verse",
      "Who tallies my feet with a patience perverse;",
      "He never will nudge me, or lecture, or glare—",
      "He simply reports what syllables are there.",
    ].join("\n"),
    settings: aboutMeterSettings("custom", { customPattern: [11] }),
  },
  {
    label: "When it runs long",
    summary:
      "When a line exceeds the meter target, the gutter shows a clear over count.",
    text: "I ordered five; the waiter wheeled out a syllable soufflé the size of Cleveland.",
    settings: aboutMeterSettings("custom", { customPattern: [5] }),
  },
  {
    label: "Meter",
    summary:
      "Optional rulers and stress marks show the foot under the line so you can see the scansion without muttering.",
    text: [
      "I mutter less; the rulers speak",
      "in ticks beneath the line",
      "They chalk each foot from weak to peak",
      "so beat and mark align",
    ].join("\n"),
    settings: aboutMeterSettings("common-meter", {
      showStress: true,
      showMeterBreaks: true,
    }),
  },
  {
    label: "Word tools",
    summary:
      "Hover or tap a word and rhymes, synonyms, and definitions tip-toe in—helpers, not a flood.",
    text: [
      "Tap once: a rhyme in bedroom slippers",
      "sidles up—no synonym shippers.",
    ].join("\n"),
    settings: aboutMeterSettings("custom", { customPattern: [9] }),
  },
  {
    label: "Local",
    summary:
      "Drafts stay on your device with no account, no cloud storage, and offline use after the first load.",
    text: [
      "No password parade, and no cloud for a throne—",
      "your draft stays offline once the page has been shown.",
    ].join("\n"),
    settings: aboutMeterSettings("custom", { customPattern: [11] }),
  },
];

/** Stance — free, local-first, meter tools only; no generative AI. */
export const ABOUT_STANCE: AboutPoem = {
  label: "Stance",
  summary:
    "Lyriic counts meter and leaves the writing—and the draft—to you, on your device.",
  text: [
    "We count your meter; we will not compose—",
    "your draft stays home in its Saturday clothes.",
  ].join("\n"),
  settings: aboutMeterSettings("heroic-couplet"),
};

export const ABOUT_CLOSE_LINE = "Focus on your words, not your meter.";
