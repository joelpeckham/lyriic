/**
 * Copy and verse samples for the home / about landing page.
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

export const ABOUT_ORIGIN_URL = "https://jpeckham.com/projects/lyriic/";

export type AboutPoem = {
  /** Short UI label above the poem. */
  label: string;
  /** Plain-language subtitle under the label (SEO + human readable). */
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
    showCounts?: boolean;
    showRulers?: boolean;
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
    showCounts: options.showCounts ?? overlays.showCounts,
    showRulers: options.showRulers ?? overlays.showRulers,
    showStress: options.showStress ?? overlays.showStress,
    showMeterBreaks: options.showMeterBreaks ?? overlays.showMeterBreaks,
    showRhymeScheme: options.showRhymeScheme ?? false,
  };
}

/** Hero sample — soft count as companion, not drill sergeant. */
export const ABOUT_HERO: AboutPoem = {
  label: "Hero",
  summary:
    "A soft count keeps a steady beat. No boots, no brass—just counting feet.",
  text: ["A soft count keeps a steady beat", "No boots, no brass, just counting feet."].join(
    "\n",
  ),
  settings: aboutMeterSettings("iambic-tetrameter", { showStress: false }),
};

/** Why we built it — hand-counting broke the draft. */
export const ABOUT_WHY: AboutPoem = {
  label: "A failed poem",
  summary:
    "I suck at counting syllables. So I built a zen poetry editor that counts for me.",
  text: [
    "I counted. Rapping, tapping, jabs on every jot.",
    "And then above my head appeared a bulb, a thought.",
    "The verse can wait a sec. Now let me write some code.",
    "Machines append a count. And now I can't be slowed.",
  ].join("\n"),
  settings: aboutMeterSettings("iambic-hexameter", {
    showRulers: false,
    showStress: true,
  }),
};

/**
 * Feature poems — each names a capability without brochure paragraphs.
 */
export const ABOUT_FEATURES: AboutPoem[] = [
  {
    label: "Syllables",
    summary:
      "Per-line syllable counts sit quietly in the gutter. Patient and never bossy.",
    text: [
      "I keep a tiny clerk beside my rhyme",
      "He tallies my beats as I keep the time",
      "He never stops to scold or chasten me",
      "The count he keeps with perfect guarantee",
    ].join("\n"),
    settings: aboutMeterSettings("iambic-pentameter", { showStress: false, showRulers: false }),
  },
  {
    label: "When it runs long",
    summary:
      "When a line exceeds the meter target, the gutter shows a clear over count.",
    text: [
      "I aimed for a limerick neat,",
      "with eight on each long-running beat.",
      "The shorts were just great,",
      "but five crossed the eight",
      "and kept on counting: seven, eight, nine. Oh who cares, you can just cheat.",
    ].join("\n"),
    settings: aboutMeterSettings("limerick"),
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
      showRulers: false
    }),
  },
  {
    label: "Word tools",
    summary:
      "Hover or tap a word and rhymes, synonyms, and definitions are presented as inline helpers.",
    text: [
      "Tap any tough word",
      "rhymes and synonyms appear.",
      "Even orange blinks.",
    ].join("\n"),
    settings: aboutMeterSettings("haiku"),
  },
  {
    label: "Local",
    summary:
      "Drafts stay on your device with no account, no cloud storage, and offline use after the first load.",
    text: [
      "No login, no account, no rented shelf—",
      "your draft stays local, safe beside yourself.",
    ].join("\n"),
    settings: aboutMeterSettings("heroic-couplet", { showStress: false }),
  },
];

/** Stance — free, local-first, meter tools only; no generative AI. */
export const ABOUT_STANCE: AboutPoem = {
  label: "AI Stance",
  summary:
    "Lyriic counts meter and leaves the writing to you, on your device. No AI allowed.",
  text: [
    "We count your meter; we will not compose—",
    "your draft stays home in its Saturday clothes.",
  ].join("\n"),
  settings: aboutMeterSettings("heroic-couplet", { showStress: false, showMeterBreaks: false })
};

export const ABOUT_CLOSE_LINE = "Focus on your words, not your meter.";
